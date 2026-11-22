#!/usr/bin/env bash
# Milestone 2, Deliverable 6b: run the reviewer subagent headless and save its
# structured report.
#
# Usage: bash scripts/review_story.sh
# Runs from any directory; paths are resolved against the repository root.
# Runs under the normal agy permission rules: never add --dangerously-skip-permissions
# or any other bypass flag.

set -euo pipefail

STORY_ID="S-7"
SRC="frontend/src"
SCHEMA="agent/review-schema.json"
OUT="evidence/headless-review.json"

cd "$(dirname "$0")/.."

FILES=$(git diff --name-only m2-tests-locked HEAD -- "$SRC")
if [ -z "$FILES" ]; then
  echo "review_story: no files changed under $SRC since m2-tests-locked" >&2
  exit 1
fi

PROMPT="Use the reviewer subagent to review these files against docs/design/${STORY_ID}.md and its acceptance criteria.
Report only what the reviewer finds. Files: ${FILES}"

# The ledger entry for this task references the full prompt by path.
printf '%s\n' "$PROMPT" > prompts/6b-headless-review.txt

agy -p "$PROMPT" --output-format json \
  --json-schema "$SCHEMA" > "$OUT"

if [ ! -s "$OUT" ]; then
  echo "review_story: agy produced no output in $OUT" >&2
  exit 1
fi

echo "review_story: wrote $OUT"
