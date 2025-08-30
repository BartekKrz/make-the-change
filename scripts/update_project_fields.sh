#!/usr/bin/env bash
set -euo pipefail

# Update GitHub Project v2 fields (Status, Priority, Size, Iteration) for issues from a TSV file.
# TSV columns: number\tstatus\tpriority\tsize\titeration
# - Leave a field empty to skip updating that field.
# - Project number defaults to 3; override with PROJECT_NUMBER env var.

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing $1" >&2; exit 1; }; }
need gh
need jq

FILE=${1:-backlog/project_fields.tsv}
[ -f "$FILE" ] || { echo "Input TSV not found: $FILE" >&2; exit 1; }

repo=$(git config --get remote.origin.url | sed -E 's#^git@github.com:(.*)\.git$#\1#; s#^https?://github.com/##; s#\.git$##')
owner=${repo%%/*}
reponame=${repo##*/}

PROJECT_NUMBER=${PROJECT_NUMBER:-3}

# Fetch project data and field IDs/options
read -r -d '' GQL_PROJ <<'EOF'
query($login:String!, $number:Int!) {
  owner: repositoryOwner(login: $login) {
    ... on User {
      projectV2(number: $number) {
        id
        title
        fields(first: 50) {
          nodes {
            __typename
            ... on ProjectV2Field { id name }
            ... on ProjectV2SingleSelectField { id name options { id name } }
            ... on ProjectV2IterationField { id name configuration { iterations { id title } } }
          }
        }
      }
    }
  }
}
EOF

proj=$(gh api graphql -f query="$GQL_PROJ" -F login="$owner" -F number="$PROJECT_NUMBER")
project_id=$(echo "$proj" | jq -r '.data.owner.projectV2.id')
[ "$project_id" != "null" ] || { echo "Project not found. Check owner and PROJECT_NUMBER." >&2; exit 1; }

status_field_id=$(echo "$proj" | jq -r '.data.owner.projectV2.fields.nodes[] | select(.name=="Status") | .id')
priority_field_id=$(echo "$proj" | jq -r '.data.owner.projectV2.fields.nodes[] | select(.name=="Priority") | .id')
size_field_id=$(echo "$proj" | jq -r '.data.owner.projectV2.fields.nodes[] | select(.name=="Size") | .id')
iteration_field_id=$(echo "$proj" | jq -r '.data.owner.projectV2.fields.nodes[] | select(.name=="Iteration") | .id')

status_opts=$(echo "$proj" | jq -r --arg id "$status_field_id" '.data.owner.projectV2.fields.nodes[] | select(.id==$id) | .options // [] | map({key:(.name|ascii_downcase), val:.id}) | from_entries')
priority_opts=$(echo "$proj" | jq -r --arg id "$priority_field_id" '.data.owner.projectV2.fields.nodes[] | select(.id==$id) | .options // [] | map({key:(.name|ascii_downcase), val:.id}) | from_entries')
size_opts=$(echo "$proj" | jq -r --arg id "$size_field_id" '.data.owner.projectV2.fields.nodes[] | select(.id==$id) | .options // [] | map({key:(.name|ascii_downcase), val:.id}) | from_entries')
iter_opts=$(echo "$proj" | jq -r --arg id "$iteration_field_id" '.data.owner.projectV2.fields.nodes[] | select(.id==$id) | .configuration.iterations // [] | map({key:(.title|ascii_downcase), val:.id}) | from_entries')

# Mutations
read -r -d '' GQL_ADD <<'EOF'
mutation($project:ID!, $content:ID!){ addProjectV2ItemById(input:{projectId:$project, contentId:$content}){ item { id } } }
EOF

read -r -d '' GQL_UPD_SS <<'EOF'
mutation($project:ID!, $item:ID!, $field:ID!, $option: String!){
  updateProjectV2ItemFieldValue(input:{projectId:$project, itemId:$item, fieldId:$field, value:{ singleSelectOptionId:$option }}){ clientMutationId }
}
EOF

read -r -d '' GQL_UPD_ITER <<'EOF'
mutation($project:ID!, $item:ID!, $field:ID!, $iter: String!){
  updateProjectV2ItemFieldValue(input:{projectId:$project, itemId:$item, fieldId:$field, value:{ iterationId:$iter }}){ clientMutationId }
}
EOF

read -r -d '' GQL_NODE <<'EOF'
query($owner:String!, $name:String!, $number:Int!){ repository(owner:$owner,name:$name){ issue(number:$number){ id } } }
EOF

read -r -d '' GQL_FIND_ITEM <<'EOF'
query($login:String!, $number:Int!, $owner:String!, $name:String!, $issue:Int!) {
  owner: repositoryOwner(login: $login) {
    ... on User {
      projectV2(number: $number) {
        items(first: 100) {
          nodes {
            id
            content { __typename ... on Issue { number repository { owner { login } name } } }
          }
        }
      }
    }
  }
}
EOF

find_item_id(){
  local issuenum="$1"
  gh api graphql -f query="$GQL_FIND_ITEM" -F login="$owner" -F number="$PROJECT_NUMBER" -F owner="$owner" -F name="$reponame" -F issue="$issuenum" \
    | jq -r --arg o "$owner" --arg n "$reponame" --argjson num "$issuenum" '.data.owner.projectV2.items.nodes[] | select(.content.__typename=="Issue" and .content.number==$num and .content.repository.owner.login==$o and .content.repository.name==$n) | .id' \
    | sed -n '1p'
}

lineno=0
while IFS=$'\t' read -r number status priority size iteration; do
  lineno=$((lineno+1))
  if [ "$lineno" -eq 1 ] && [[ "$number" =~ ^number$ ]]; then continue; fi
  [ -n "${number:-}" ] || continue

  # Get issue node id
  node=$(gh api graphql -f query="$GQL_NODE" -F owner="$owner" -F name="$reponame" -F number="$number" | jq -r '.data.repository.issue.id')
  [ "$node" != "null" ] || { echo "Issue #$number not found" >&2; continue; }

  # Ensure item exists in project
  item_id=$(find_item_id "$number" || true)
  if [ -z "${item_id:-}" ]; then
    add=$(gh api graphql -f query="$GQL_ADD" -F project="$project_id" -F content="$node" || true)
    item_id=$(echo "$add" | jq -r '.data.addProjectV2ItemById.item.id' 2>/dev/null || true)
    if [ -z "${item_id:-}" ] || [ "$item_id" = "null" ]; then
      # Try to locate again
      item_id=$(find_item_id "$number" || true)
    fi
  fi
  [ -n "$item_id" ] || { echo "Cannot get project item for #$number" >&2; continue; }

  lower(){ echo "$1" | tr '[:upper:]' '[:lower:]'; }

  # Update Status
  if [ -n "${status:-}" ] && [ "$status_field_id" != "null" ]; then
    key=$(lower "$status")
    opt=$(echo "$status_opts" | jq -r --arg k "$key" '.[$k] // empty')
    [ -n "$opt" ] || { echo "Unknown Status '$status' for #$number" >&2; } || true
    if [ -n "$opt" ]; then
      gh api graphql -f query="$GQL_UPD_SS" -F project="$project_id" -F item="$item_id" -F field="$status_field_id" -F option="$opt" >/dev/null
      echo "#${number} Status -> $status"
    fi
  fi

  # Update Priority
  if [ -n "${priority:-}" ] && [ "$priority_field_id" != "null" ]; then
    key=$(lower "$priority")
    opt=$(echo "$priority_opts" | jq -r --arg k "$key" '.[$k] // empty')
    if [ -n "$opt" ]; then
      gh api graphql -f query="$GQL_UPD_SS" -F project="$project_id" -F item="$item_id" -F field="$priority_field_id" -F option="$opt" >/dev/null
      echo "#${number} Priority -> $priority"
    else
      echo "Unknown Priority '$priority' for #$number" >&2
    fi
  fi

  # Update Size
  if [ -n "${size:-}" ] && [ "$size_field_id" != "null" ]; then
    key=$(lower "$size")
    opt=$(echo "$size_opts" | jq -r --arg k "$key" '.[$k] // empty')
    if [ -n "$opt" ]; then
      gh api graphql -f query="$GQL_UPD_SS" -F project="$project_id" -F item="$item_id" -F field="$size_field_id" -F option="$opt" >/dev/null
      echo "#${number} Size -> $size"
    else
      echo "Unknown Size '$size' for #$number" >&2
    fi
  fi

  # Update Iteration
  if [ -n "${iteration:-}" ] && [ "$iteration_field_id" != "null" ]; then
    key=$(lower "$iteration")
    iter=$(echo "$iter_opts" | jq -r --arg k "$key" '.[$k] // empty')
    if [ -n "$iter" ]; then
      gh api graphql -f query="$GQL_UPD_ITER" -F project="$project_id" -F item="$item_id" -F field="$iteration_field_id" -F iter="$iter" >/dev/null
      echo "#${number} Iteration -> $iteration"
    else
      echo "Unknown Iteration '$iteration' for #$number" >&2
    fi
  fi

done < "$FILE"

echo "Done."

