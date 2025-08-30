#!/usr/bin/env bash
set -euo pipefail

# Export open issues to TSV for bulk editing.
# Output columns: number\ttitle\tlabels(comma)\tassignees(comma)\turl

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing $1" >&2; exit 1; }; }
need gh
need jq

repo=$(git config --get remote.origin.url | sed -E 's#^git@github.com:(.*)\.git$#\1#; s#^https?://github.com/##; s#\.git$##')
[ -n "$repo" ] || { echo "Cannot detect repo" >&2; exit 1; }

out="backlog/issues-export.tsv"
mkdir -p backlog

echo -e "number\ttitle\tlabels\tassignees\turl" > "$out"

gh issue list -R "$repo" --state open --limit 200 \
  --json number,title,labels,assignees,url \
  --jq '.[] | [ .number, .title, (.labels | map(.name) | join(",")), (.assignees | map(.login) | join(",")), .url ] | @tsv' \
  >> "$out"

echo "Exported to $out"

