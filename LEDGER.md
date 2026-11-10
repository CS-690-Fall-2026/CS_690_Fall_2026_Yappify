# Yappify — Provenance Ledger

## Entry 1

**artifact:** `docs/plans/S-1-plan.md`

**tool:** Claude, Sonnet 5.5, November 8, 2026

**prompts:** I asked Claude to create an implementation plan for S-1 using the design document and AC-1. I asked it to explain which files would need to be created or modified, how the recording data would be stored, and what tasks would be needed to implement the feature. The full prompt is saved in `prompts/S-1-plan.txt`.

**review:** I reviewed the plan and compared it to the S-1 design document to make sure it followed the requirements. The original plan placed the acceptance test after the implementation tasks, so I moved it earlier to follow the tests-first approach required for the assignment. I also checked that the plan focused on recording audio and did not include unrelated features like publishing, editing, or transcription. The proposed file paths still need to be verified against the repository.

**checks:** I compared the proposed tasks with S-1 and AC-1. I did not run any implementation tests since this was only the planning stage.

**evidence:** S-1, AC-1, E-12, E-13

**risk:** The maximum recording duration, recording format, and handling of interrupted recordings are still unresolved. The proposed file paths also need to be confirmed before implementation begins.
## Entry 2

artifact: contents of frontend/src, frontend/docs, and frontend/dev-server.mjs, at commit ccced50b6427c707bd818bf09b3c27a0ebadf634
tool: Antigravity, Gemini 3.8 Flash, 11/9/26
prompts: prompts/S-01.md
review: Read the prompts for cmd access in antigravity, and verify that the commands executed match the expected outcomes.
checks: ran the tests in frontend/tests and validated the tests for the changes made pass and the remaining tests were skipped
evidence: docs/design/S-1.md, frontend/tests/ac-01-record.spec.ts
risk: Frontend will need additional updates once the backend is implemented.

## Entry 3

artifact: Interview 2
prompts: Look at interview 2 and number the paragraphs in each set of notes P01, P02
review: used an online diff tool to check only the paragraph numbering changes.
checks: manual review
evidence: Interview 2
risk: None

## Entry 4

artifact: Interview 1
prompts: Look at interview 1 and number the paragraphs in each set of notes P01, P02
review: used an online diff tool to check only the paragraph numbering changes.
checks: manual review
evidence: Interview 1
risk: None


## Entry 5

artifact: AGENTS.md
prompts: Make a AGENTS.md
Include standing instructions for your AI coding tool. At a minimum: the language and framework, the test command, the files and folders the agent must not change, and the rule that it shows a plan and waits for approval before editing.
review: reviewed AGENTS.md to verify it included the required standing instructions.
checks: manual review
evidence: Milestone 1 step 6A
risk: None

## Entry 6

artifact: README.md
prompts: prompts/readme.md
Include standing instructions for your AI coding tool. At a minimum: the language and framework, the test command, the files and folders the agent must not change, and the rule that it shows a plan and waits for approval before editing.
review: reviewed README.md to verify it included the required standing instructions.
checks: manual review
evidence: README.md
risk: None