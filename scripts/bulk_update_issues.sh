#!/usr/bin/env bash
set -euo pipefail

# Bulk update issues based on a TSV file.
# TSV columns:
#   number\ttitle\tlabels(comma)\tassignees(comma)\tbody_file\tremove_labels(comma)\tremove_assignees(comma)
# - Leave a field empty to skip updating it.
# - For body_file, put a path to a .md file (optional).

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing $1" >&2; exit 1; }; }
need gh

FILE=${1:-backlog/updates.tsv}
[ -f "$FILE" ] || { echo "Input TSV not found: $FILE" >&2; exit 1; }

repo=$(git config --get remote.origin.url | sed -E 's#^git@github.com:(.*)\.git$#\1#; s#^https?://github.com/##; s#\.git$##')
[ -n "$repo" ] || { echo "Cannot detect repo" >&2; exit 1; }

lineno=0
while IFS=$'\t' read -r number title labels assignees body_file remove_labels remove_assignees; do
  lineno=$((lineno+1))
  # Skip header or empty lines
  if [ "$lineno" -eq 1 ] && [[ "$number" =~ ^number$ ]]; then continue; fi
  [ -n "${number:-}" ] || continue

  args=(-R "$repo")
  [ -n "${title:-}" ] && args+=(--title "$title")
  if [ -n "${labels:-}" ]; then
    args+=(--add-label "$labels")
  fi
  if [ -n "${assignees:-}" ]; then
    args+=(--add-assignee "$assignees")
  fi
  if [ -n "${remove_labels:-}" ]; then
    args+=(--remove-label "$remove_labels")
  fi
  if [ -n "${remove_assignees:-}" ]; then
    args+=(--remove-assignee "$remove_assignees")
  fi
  if [ -n "${body_file:-}" ]; then
    if [ -f "$body_file" ]; then
      args+=(--body-file "$body_file")
    else
      echo "Warning: body file not found: $body_file (line $lineno)" >&2
    fi
  fi

  echo "Editing #$number ..."
  gh issue edit "$number" "${args[@]}"
done < "$FILE"

echo "Done."
