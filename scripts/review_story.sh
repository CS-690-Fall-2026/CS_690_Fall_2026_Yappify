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

# One-shot: a recorded review is graded evidence, so a re-run must be deliberate.
# Overwriting it (and the prompt file the ledger cites) would leave the tree
# disagreeing with the tagged submission.
if [ -e "$OUT" ] && [ -z "${REVIEW_FORCE:-}" ]; then
  echo "review_story: $OUT already exists and is the recorded review." >&2
  echo "review_story: to replace it deliberately, run REVIEW_FORCE=1 bash scripts/review_story.sh" >&2
  exit 2
fi

FILES=$(git diff --name-only m2-tests-locked HEAD -- "$SRC")
if [ -z "$FILES" ]; then
  echo "review_story: no files changed under $SRC since m2-tests-locked" >&2
  exit 1
fi

PROMPT="Use the reviewer subagent to review these files against docs/design/${STORY_ID}.md and its acceptance criteria.
Report only what the reviewer finds.
Complete the review in this turn and return the JSON report now; do not hand off and return a placeholder.
Files: ${FILES}"

# The ledger entry for this task references the full prompt by path.
printf '%s\n' "$PROMPT" > prompts/6b-headless-review.txt

AGENT_FLAGS=()
if [ -n "${REVIEW_AGENT:-}" ]; then
  AGENT_FLAGS=(--agent "$REVIEW_AGENT")
fi

agy -p "$PROMPT" --output-format json \
  --json-schema "$SCHEMA" "${AGENT_FLAGS[@]}" > "$OUT"

if [ ! -s "$OUT" ]; then
  echo "review_story: agy produced no output in $OUT" >&2
  exit 1
fi

echo "review_story: wrote $OUT"
