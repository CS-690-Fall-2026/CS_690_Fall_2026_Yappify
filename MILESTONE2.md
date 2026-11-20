# Milestone 2 — Build One Story with Your Agent Team

Team deliverable. S-7 (upload existing audio) builds on Milestone 1's design work; S-1 (record) is the Milestone 1 story and stays green.

## Deliverable map

| Deliverable | Paths / tags |
|---|---|
| 1. Follow-up, story, open questions, gap check | `docs/design/S-7.md`, `docs/design/S-7-gap-check-2.md`, `docs/backlog.md` §4d |
| 2. Agent setup | `AGENTS.md`, `agent/agy-permissions.json`, `.agents/agents/test-writer/agent.md`, `.agents/agents/code-reviewer/agent.md` |
| 3. Acceptance tests and lock | `frontend/tests/acceptance/`, `evidence/test-audit.md`, `evidence/red.txt`, tag `m2-tests-locked` |
| 4. Plan and build | `docs/plans/S-7-plan.md`, task commits, tag `m2-green` — _pending_ |
| 5. Test strength | unit/integration/property tests, coverage, mutation — _pending_ |
| 6. Headless reviewer | `scripts/review_story.sh`, `agent/review-schema.json`, `evidence/headless-review.json` — _pending_ |
| 7. Provenance ledger | `LEDGER.md`, `prompts/` |
| 8. This report | `MILESTONE2.md` |

## Team roles

_To fill: who led agent setup, acceptance tests, the build, and the test-strength work._

## 1. Follow-up, the story, and its open questions

### 1a. Milestone 1 follow-up

_To fill._

### 1b. The story

**S-7** — As an audio creator, I want to upload an existing audio file so that I can share audio I already have without recording it again.
Evidence: E-8, E-16, A-4.

**AC-7** — Given the user has an audio file in a format permitted by `SUPPORTED_AUDIO_FORMATS` and within `MAX_CLIP_DURATION`, and the user has confirmed that they own the audio or have permission to upload it, When the user selects that file for upload, Then Yappify displays the uploaded audio as a playable, unpublished clip. Publication is out of scope for S-7.

Files: `frontend/src/audio/upload.ts`, `frontend/src/data/clips.ts`, `frontend/src/components/UploadClip.tsx` (to be created by the build), `frontend/tests/acceptance/ac-07-upload.spec.ts`.

### 1c. Settled decisions

All 16 decisions in `docs/design/S-7.md` §8 carry `Source: Team decision, 2026-11-19` (commit `15fd084`). Decision 15 was amended the same day to fix the duration display format as `m:ss` (commit `12084dd`).

### 1d. Gap check 2

`docs/design/S-7-gap-check-2.md`, prompt `prompts/S-7-gap-check-2.txt`.

## 3b. Answers to the test-writer audit

Audit: `evidence/test-audit.md`, produced by the `test-writer` subagent (Antigravity CLI 1.5.11) on 2026-11-19. Every fixed finding cites the commit that holds its final state; each SHA was resolved from that commit's subject and checked to be an ancestor of `HEAD` before this table was committed.

<!-- BEGIN AUDIT ANSWERS -->

| Finding | Resolution |
|---|---|
| 1.1 | Rejected — not an acceptance criterion; the unsupported-format edge case is a 5a unit test outside tests/acceptance/ |
| 1.2 | Rejected — not an acceptance criterion; MAX_CLIP_DURATION rejection is a 5a boundary test, decisions 5/10/12 |
| 1.3 | Rejected — not an acceptance criterion; corrupt/undecodable audio is a 5a invalid-input test, decisions 3/12 |
| 1.4 | Rejected — not an acceptance criterion; cancelled selection is a 5a rule test of decision 11 and needs a picker that fires no change event |
| 1.5 | Rejected — §6 postcondition, not a criterion; covered by every 5a rejection test |
| 1.6 | Rejected — §6 postcondition and decision 11 rule, not a criterion; 5a |
| 1.7 | Rejected — decision 11 replacement rule, not a criterion; 5a |
| 1.8 | Rejected — decision 10 duration rule, not a criterion; 5a boundary test where a zero-length data chunk can be asserted directly |
| 1.9 | Rejected — the confirmation is a Given of AC-7, not a separate criterion; its negative case is a decision-13 rule test for 5a |
| 1.10 | Rejected — decision 11 size rule, not a criterion; also has no specified user-facing message, so 5a asserts the absence of an accepted clip |
| 1.11 | Rejected — decision 15 remove-button element, not part of AC-7's Then; 5a |
| 2.1 | Fixed in `9d6fd56` — removed the publish-button absence assertion; unpublished state is asserted by decision 14's status label |
| 2.2 | Fixed in `9d6fd56` — decision 15 amended in 12084dd to fix the format; the test now asserts the exact string "0:05" |
| 2.3 | Fixed in `9d6fd56` — input[type=file] plus toHaveAccessibleName(/.+/); wording stays unpinned because decision 15 fixes only that a label exists |
| 2.4 | Fixed in `9d6fd56` — dropped the src-attribute assertion; decision 14 requires an object URL, not its DOM placement, and decision 16's metadata check remains |
| 3.1 | Fixed in `736754b` — metadata check kept and the duration compared to the fixture's 5 s; agent used ±0.25 s, review tightened it to ±0.05 s |
| 3.2 | Rejected — duplicate of 2.1 — same line, fixed there |
| 4 | Rejected — no criterion is missing a test, so none of the ten proposed tests belongs in the locked acceptance suite; they are 5a work in tests/unit, and two of them would not work as written (setInputFiles([]) fires no change event; a zero-length data chunk's failure mode is unverified) |

<!-- END AUDIT ANSWERS -->

## 4a. Plan changes

We reviewed Claude's original implementation plan for S-7 and made two changes.

**Change 1:** We moved the additional rule tests before the upload validation implementation. This allows us to follow the tests-first approach and check the expected behavior before implementing the code.

**Change 2:** We split the upload interface into two tasks. One handles the file picker, copyright checkbox, loading state, and errors, while the other handles displaying and managing uploaded audio. This makes each task smaller and easier to review.

The corrected plan is saved in docs/plans/S-7-plan.md.


## 5. Test strength

### Integration test

`frontend/tests/integration/upload.integration.spec.ts` runs S-7's upload/validation logic together with the real data module in Chromium with no mocks between them:

1. **Story logic:** `uploadAudio` in `frontend/src/audio/upload.ts` (real browser `File` readability check, `URL.createObjectURL`, `<audio>` metadata decoding, and format/size/duration/ownership validation), paired with `formatDuration` in `frontend/src/utils/formatDuration.ts`.
2. **Real data module:** the temporary in-memory clip store in `frontend/src/data/clips.ts` (`getCurrentUser`, `setUnpublishedClip`, `getUnpublishedClip`, `removeUnpublishedClip`).

### Property-based tests

`frontend/tests/property/upload.property.spec.ts` checks three universal properties derived from `docs/design/S-7.md` §6 ("Rules") across seeded random inputs in Chromium:

1. **§6 Invariant:** Every accepted clip has a permitted format in `SUPPORTED_AUDIO_FORMATS`, finite duration `0 < durationSeconds <= MAX_CLIP_DURATION`, `status === "unpublished"`, and the original `File` reference.
2. **§6 Postconditions:** Across randomized valid/invalid upload sequences against `frontend/src/data/clips.ts`, a rejected file never produces or mutates the stored clip.
3. **§6 Preconditions:** Inputs violating readability, decodability, or `SUPPORTED_AUDIO_FORMATS` are never accepted.

## 6c. Answers to headless review findings

_Pending._

## Reflection (300–500 words)

_Pending — written by the team._


