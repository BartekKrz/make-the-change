#!/usr/bin/env bash
set -euo pipefail

# Analyze GitHub issues, PRs, labels, and Projects for the current repo.
# Requires: curl, jq, git, and a GitHub token in $GITHUB_TOKEN or $GH_TOKEN

err() { printf "\e[31m[err]\e[0m %s\n" "$*" >&2; }
info() { printf "\e[34m[info]\e[0m %s\n" "$*" >&2; }
ok() { printf "\e[32m[ok]\e[0m %s\n" "$*" >&2; }

need() {
  command -v "$1" >/dev/null 2>&1 || { err "Missing dependency: $1"; exit 1; }
}

need curl
need jq
need git

token="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
if [ -z "${token}" ]; then
  err "Set GITHUB_TOKEN or GH_TOKEN to access private repo data."
  err "Scopes needed: repo (read), project (read)"
  exit 1
fi

# Detect owner/repo from git remote
remote_url=$(git config --get remote.origin.url || true)
if [ -z "$remote_url" ]; then
  err "No git remote found. Run inside a cloned repository."
  exit 1
fi

# Normalize Git URL to https form and extract owner/repo
norm_url="$remote_url"
if [[ "$norm_url" =~ ^git@github.com:(.*)\.git$ ]]; then
  path_part="${BASH_REMATCH[1]}"
elif [[ "$norm_url" =~ ^https?://github.com/(.*)\.git$ ]]; then
  path_part="${BASH_REMATCH[1]}"
elif [[ "$norm_url" =~ ^https?://github.com/(.*)$ ]]; then
  path_part="${BASH_REMATCH[1]}"
else
  err "Unsupported remote URL: $remote_url"
  exit 1
fi

owner="${path_part%%/*}"
repo="${path_part##*/}"

base="https://api.github.com"
ua="CodexCLI-Analyzer"
auth=(-H "Authorization: Bearer ${token}")

info "Repository: $owner/$repo"

get_json() {
  local url="$1"; shift
  curl -sS -H "User-Agent: $ua" "${auth[@]}" "$url" "$@"
}

search_count() {
  local q="$1"
  local encoded=$(python3 - <<EOF
import urllib.parse, sys
print(urllib.parse.quote(sys.argv[1]))
EOF
"$q")
  get_json "$base/search/issues?q=$encoded&per_page=1" | jq -r '.total_count'
}

header() { printf "\n=== %s ===\n" "$*"; }

# Repo details
repo_json=$(get_json "$base/repos/$owner/$repo")
private=$(jq -r '.private' <<<"$repo_json")
default_branch=$(jq -r '.default_branch' <<<"$repo_json")
open_issues_incl_pr=$(jq -r '.open_issues_count' <<<"$repo_json")
has_projects=$(jq -r '.has_projects' <<<"$repo_json")
header "Repository Details"
echo "private: $private"
echo "default_branch: $default_branch"
echo "open_issues_incl_pr: $open_issues_incl_pr"
echo "has_projects (classic): $has_projects"

# Issue/PR counts (exclude PRs)
header "Issue & PR Counts"
open_issues=$(search_count "repo:$owner/$repo is:issue is:open")
closed_issues=$(search_count "repo:$owner/$repo is:issue is:closed")
open_prs=$(search_count "repo:$owner/$repo is:pr is:open")
merged_prs=$(search_count "repo:$owner/$repo is:pr is:merged")
echo "open_issues: $open_issues"
echo "closed_issues: $closed_issues"
echo "open_prs: $open_prs"
echo "merged_prs: $merged_prs"

# Triage health
header "Triage Health"
no_label=$(search_count "repo:$owner/$repo is:issue is:open no:label")
no_assignee=$(search_count "repo:$owner/$repo is:issue is:open no:assignee")
echo "open_issues_no_label: $no_label"
echo "open_issues_no_assignee: $no_assignee"

# Staleness (30/90 days)
now=$(date -u +%F)
date_30=$(python3 - <<'EOF'
from datetime import datetime, timedelta
print((datetime.utcnow() - timedelta(days=30)).strftime('%Y-%m-%d'))
EOF
)
date_90=$(python3 - <<'EOF'
from datetime import datetime, timedelta
print((datetime.utcnow() - timedelta(days=90)).strftime('%Y-%m-%d'))
EOF
)
header "Staleness"
stale_30=$(search_count "repo:$owner/$repo is:issue is:open updated:<$date_30")
stale_90=$(search_count "repo:$owner/$repo is:issue is:open updated:<$date_90")
echo "open_stale_30d: $stale_30"
echo "open_stale_90d: $stale_90"

# Recent flow
header "Recent Flow"
created_7=$(search_count "repo:$owner/$repo is:issue created:>=$(python3 - <<'EOF'
from datetime import datetime, timedelta
print((datetime.utcnow() - timedelta(days=7)).strftime('%Y-%m-%d'))
EOF
)" )
closed_30=$(search_count "repo:$owner/$repo is:issue is:closed closed:>=$date_30")
echo "issues_created_last_7d: $created_7"
echo "issues_closed_last_30d: $closed_30"

# Labels distribution (top 10 by open issues)
header "Top Labels (by open issues)"
labels=$(get_json "$base/repos/$owner/$repo/labels?per_page=100" | jq -r '.[].name')
declare -a rows
count=0
while IFS= read -r lbl; do
  # avoid over-querying very large sets
  count=$((count+1))
  [ $count -le 60 ] || break
  open_with_label=$(search_count "repo:$owner/$repo is:issue is:open label:\"$lbl\"")
  rows+=("$open_with_label\t$lbl")
  # tiny jitter to stay gentle with API
  sleep 0.05
done <<< "$labels"

printf "%s\n" "${rows[@]}" | sort -nr | head -n 10 | awk -F"\t" '{printf "%-4s %s\n", $1, $2}'

# Repo classic projects (if any)
header "Projects (Classic)"
projects_json=$(get_json "$base/repos/$owner/$repo/projects?per_page=100" -H "Accept: application/vnd.github.inertia-preview+json")
proj_count=$(jq 'length' <<<"$projects_json")
echo "repo_classic_projects: $proj_count"
if [ "$proj_count" -gt 0 ]; then
  echo "$projects_json" | jq -r '.[] | "- ["+(.state)+"] " + .name + " (#" + ( .number|tostring ) + ")"'
fi

# Projects (V2) via GraphQL for the owner
header "Projects (V2) for Owner"
read -r -d '' gql <<'EOF'
query($login: String!) {
  owner: repositoryOwner(login: $login) {
    login
    ... on User {
      projectsV2(first: 20) {
        nodes { id title number closed }
      }
    }
    ... on Organization {
      projectsV2(first: 20) {
        nodes { id title number closed }
      }
    }
  }
}
EOF

gql_resp=$(curl -sS -H "User-Agent: $ua" "${auth[@]}" -H 'Content-Type: application/json' \
  -X POST https://api.github.com/graphql \
  -d "$(jq -n --arg login "$owner" --arg query "$gql" '{query: $query, variables: {login: $login}}')")

if [ "$(jq -r '.errors|length' <<<"$gql_resp" 2>/dev/null || echo 0)" != "null" ] && [ "$(jq -r '.errors|length' <<<"$gql_resp" 2>/dev/null)" -gt 0 ]; then
  err "GraphQL errors:"; echo "$gql_resp" | jq -r '.errors'
else
  echo "$gql_resp" | jq -r '.data.owner.projectsV2.nodes[] | "- [" + (if .closed then "closed" else "open" end) + "] " + .title + " (#" + (.number|tostring) + ")"'
fi

ok "Done."

