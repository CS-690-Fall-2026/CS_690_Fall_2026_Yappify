# Milestone 2 — Build One Story with Your Agent Team

Team deliverable. S-7 (upload existing audio) builds on Milestone 1's design work; S-1 (record) is the Milestone 1 story and stays green.

## Deliverable map

| Deliverable | Paths / tags |
|---|---|
| 1. Follow-up, story, open questions, gap check | `docs/design/S-7.md`, `docs/design/S-7-gap-check-2.md`, `docs/backlog.md` §4d |
| 2. Agent setup | `AGENTS.md`, `agent/agy-permissions.json`, `.agents/agents/test-writer/agent.md`, `.agents/agents/code-reviewer/agent.md` |
| 3. Acceptance tests and lock | `frontend/tests/acceptance/`, `evidence/test-audit.md`, `evidence/red.txt`, tag `m2-tests-locked` |
| 4. Plan and build | `docs/plans/S-7-plan.md`, task commits `8d6dee4`–`a94bd7d` (Tasks 4.1–4.7), Task 4.8 verification, tag `m2-green` — _in progress: tag `m2-green` and remaining 4c–4f requirements pending_ |
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

### Build status

| Task | Commit | Result |
|---|---|---|
| 4.1 Plan | `8d6dee4` | Plan committed |
| 4.2 Constants and `formatDuration` | `24d9120` | Build passes; AC-1 green, AC-7 red (expected) |
| 4.3 Rule tests (red first) | `c5afb1d` | 15 rule tests red because the UI was missing (`evidence/red-rules.txt`) |
| 4.4 `uploadAudio` pipeline | `d5a0a61` | Build passes |
| 4.5 Clip store | `cee4ab4` | Build passes; no storage APIs used |
| 4.6 Upload controls | `cca5bd1` | 10 `@controls` tests and AC-1 pass; `@display` and AC-7 red (expected) |
| 4.7 Uploaded-audio display | `a94bd7d` | Full suite green |
| 4.8 Final verification | this commit | See below |

**Approved deviations from the plan:** (1) ownership confirmation is checked before format (plan open item 1); (2) the error `role="alert"` region is rendered only while an error exists, not permanently, because the `@display` tests expect no alert after a successful or cancelled selection (LEDGER Entry 30).

**Final verification (Task 4.8, 2026-11-20, at `a94bd7d`):** `npm ci` from the lockfile in a fresh clone, `npm run build` passed, and `npm test` gave **43 passed, 0 failed**: AC-1 1, AC-7 1, rule tests 15, unit 13, mutation-kill unit 8, integration 2, property 3. A strict `tsc --noEmit` on the S-7 source and components passed. `git diff m2-tests-locked -- frontend/tests/acceptance` is empty. Details are in LEDGER Entry 33. Deliverable 4 is not yet complete: the `m2-green` tag and the remaining 4c–4f requirements are pending.


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

### 5d. Coverage

- **README test command:** `npm run test:coverage` from `frontend/` (`frontend/scripts/coverage.mjs`), which collects Chromium V8 JS coverage across the passing Playwright suites, maps it via Vite inline source maps + `v8-to-istanbul`, prints missing lines and branch coverage, and exits non-zero if S-7 line coverage drops below `80%`.
- **Report:** `evidence/coverage.txt` — **100% line coverage** (`278/278` lines across `constants.ts`, `upload.ts`, `clips.ts`, and `formatDuration.ts`) and **100% branch coverage** (`60/60` branches) after adding the 5e tests (up from `99.28%` lines / `96.49%` branches before 5e).
- **Uncovered line/branch note:** Before the 5e unit additions, `src/audio/upload.ts:162-164` (`if (new Audio().canPlayType(spec.normalized) === "") { throw new InvalidAudioError(); }`) and the false branch of `src/utils/formatDuration.ts:6` (`Number.isFinite(seconds) && seconds > 0 ? ... : 0`) were uncovered because Chromium natively supports WAV/MP3/M4A codecs and `uploadAudio` rejects non-positive/non-finite durations before formatting; both are acceptable defensive branches and are now also exercised by `frontend/tests/unit/upload-mutation-kills.unit.spec.ts`. The figures above were measured before Tasks 4.6–4.7. The UI components `UploadClip.tsx` and `UploadedClipView.tsx` now exist and pass the full suite, but coverage has not been re-measured to include them.

### 5e. Mutation testing

- **Configuration:** `frontend/stryker.config.mjs` (mutates only the S-7 story logic files: `src/audio/upload.ts`, `src/data/clips.ts`, `src/utils/formatDuration.ts`, and `src/audio/constants.ts`; uses Stryker's `command` runner against `tests/unit`, `tests/integration`, and `tests/property`, with `frontend/tests/coverage-test.ts` propagating `__STRYKER_ACTIVE_MUTANT__` into Chromium).
- **Before (`evidence/mutation-before.txt`):** `95` killed, `34` survived (`73.64%` mutation score across `129` mutants).
- **After (`evidence/mutation-after.txt`):** `116` killed, `13` survived (`89.92%` mutation score: `clips.ts` `100.00%`, `formatDuration.ts` `90.91%`, `upload.ts` `89.42%`, `constants.ts` `66.67%`).
- **Triage selection (20 of 34 initial survivors):** Because the first run produced 34 survivors (>20), we triaged 20 by selecting all validation-logic, boundary-condition, error-handling, data-store, and formatter mutants plus representative metadata-timeout/cleanup entrypoints, leaving redundant inner probe-cleanup guards (`upload.ts:116-120`), `probe.preload`, dotfile `dot <= 0`, and unbuilt UI constant `UPLOAD_ACCEPT` (`constants.ts:20`) outside the 20-row triage.

| Mutant | What it changed | Resolution (killing test + commit / reason) |
|---|---|---|
| `upload.ts:145` (#72) | `file.type !== ""` -> `true` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d9): uploadAudio accepts valid .wav file when file.type is empty string` (`df684be`) |
| `upload.ts:145` (#74) | `file.type !== ""` -> `file.type !== "Stryker was here!"` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d9): uploadAudio accepts valid .wav file when file.type is empty string` (`df684be`) |
| `upload.ts:171` (#106) | `durationSeconds > MAX_CLIP_DURATION` -> `>=` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d5, d10): uploadAudio accepts exact 60.00 s WAV boundary with unpublished status` (`df684be`) |
| `upload.ts:150` (#81) | `file.size > MAX_UPLOAD_BYTES` -> `>=` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d11): uploadAudio accepts exact MAX_UPLOAD_BYTES (20 MB) WAV file` (`df684be`) |
| `upload.ts:162` (#90) | `canPlayType(...) === ""` -> `false` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d9, d12): uploadAudio rejects with InvalidAudioError when canPlayType returns empty string` (`df684be`) |
| `upload.ts:162-164` (#93) | Emptied `if (canPlayType === "")` block | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d9, d12): uploadAudio rejects with InvalidAudioError when canPlayType returns empty string` (`df684be`) |
| `upload.ts:32` (#4) | `this.name = "UploadError"` -> `""` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d12): UploadError base class sets name to "UploadError"` (`df684be`) |
| `upload.ts:108` (#39) | `setTimeout(() => reject(...))` -> `() => undefined` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d10, d12): uploadAudio rejects with InvalidAudioError on metadata timeout and cleans up URL and timer` (`df684be`) |
| `upload.ts:114-122` (#44) | Emptied `loaded.finally(() => {})` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d10, d12): uploadAudio rejects with InvalidAudioError on metadata timeout and cleans up URL and timer` (`df684be`) |
| `upload.ts:115` (#45) | Removed `clearTimeout(timer)` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d10, d12): uploadAudio rejects with InvalidAudioError on metadata timeout and cleans up URL and timer` (`df684be`) |
| `upload.ts:121` (#57) | Removed `URL.revokeObjectURL(url)` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d10, d12): uploadAudio rejects with InvalidAudioError on metadata timeout and cleans up URL and timer` (`df684be`) |
| `clips.ts:24-27` (#112) | `MOCK_CURRENT_USER` -> `{}` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d8, d11): getCurrentUser returns a copy and setUnpublishedClip generates strictly increasing clip IDs` (`df684be`) |
| `clips.ts:25` (#113) | `id: "user-1"` -> `""` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d8, d11): getCurrentUser returns a copy and setUnpublishedClip generates strictly increasing clip IDs` (`df684be`) |
| `clips.ts:26` (#114) | `displayName: "Demo User"` -> `""` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d8, d11): getCurrentUser returns a copy and setUnpublishedClip generates strictly increasing clip IDs` (`df684be`) |
| `clips.ts:37` (#116) | `return { ...MOCK_CURRENT_USER }` -> `return {}` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d8, d11): getCurrentUser returns a copy and setUnpublishedClip generates strictly increasing clip IDs` (`df684be`) |
| `clips.ts:47` (#120) | `nextClipNumber++` -> `nextClipNumber--` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d8, d11): getCurrentUser returns a copy and setUnpublishedClip generates strictly increasing clip IDs` (`df684be`) |
| `formatDuration.ts:6` (#124) | `Number.isFinite(seconds) && seconds > 0` -> `true` | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d15): formatDuration formats 0, -5, NaN, Infinity as 0:00, 5 as 0:05, and 60 as 1:00` (`df684be`) |
| `formatDuration.ts:6` (#126) | `&&` -> `\|\|` in duration guard | Killed by `upload-mutation-kills.unit.spec.ts` — `AC-7 (d15): formatDuration formats 0, -5, NaN, Infinity as 0:00, 5 as 0:05, and 60 as 1:00` (`df684be`) |
| `formatDuration.ts:6` (#128) | `seconds > 0` -> `seconds >= 0` | Equivalent: for `seconds === 0`, `Math.round(0)` produces `0`, identical to the `: 0` fallback (`"0:00"`). |
| `upload.ts:81` (#26) | `if (dot < 0)` -> `if (false)` | Equivalent: when `dot === -1`, `fileName.slice(-1)` has length `<= 1`, which never matches `.mp3`, `.wav`, or `.m4a`. |

Even at 99.28% line coverage (and 100% line coverage on `clips.ts` and `formatDuration.ts`), the initial 73.64% mutation score exposed missing boundary checks (`60.00 s`, `20 MB`, `file.type === ""`) and weak assertions (`ownerId === getCurrentUser().id` passing even when both were `undefined`) that coverage never flagged.

### 5f. Traceability

| Evidence ID | Story ID | AC ID | Test name | Passing commit |
|---|---|---|---|---|
| E-8, E-16, A-4 | S-7 | AC-7 | `test_ac7_valid_audio_upload_displays_playback` | `a94bd7d` |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › unsupported .ogg is rejected (d4, d9)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › audio-only .mp4 is rejected (d9)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › .wav with conflicting MIME audio/mpeg is rejected (d9)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › file over 20 MB is rejected (d11)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › undecodable .wav is rejected as invalid audio (d3, d12)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › 61 s WAV is rejected (d5, d10)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › 60.04 s WAV is rejected; duration is not rounded (d10)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › valid file without ownership confirmation is rejected (d13)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › confirmation unchecked on load and file input labelled (d13, d15)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `controls › controls are disabled while checking audio (d11)` | `cca5bd1` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `display › 60.00 s WAV is accepted and shows 1:00 (d5, d10, d15)` | `a94bd7d` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `display › rejected file leaves the previous clip in place (d11, d12)` | `a94bd7d` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `display › second valid upload replaces the first (d11)` | `a94bd7d` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `display › cancelled selection leaves the clip unchanged (d11, §7 case 4)` | `a94bd7d` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `display › Remove clears the clip and its audio element (d15)` | `a94bd7d` (added red in `c5afb1d`) |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.1, §4): uploadAudio rejects unsupported .ogg format with UnsupportedFormatError` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.1, d9, §4): uploadAudio rejects audio-only .mp4 extension with UnsupportedFormatError` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.1, d9, §4): uploadAudio rejects file with no extension with UnsupportedFormatError` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.1, d9, §4): uploadAudio rejects conflicting MIME type for .wav extension` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.2, d5, §4): uploadAudio rejects 61 s audio with DurationLimitError` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.2, d10, §4): uploadAudio rejects 60.04 s audio without rounding` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.3, d3, d12, §4): uploadAudio rejects corrupted audio with InvalidAudioError` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.3, d10, §4): uploadAudio rejects 0, NaN, and Infinity durations with InvalidAudioError` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§7.4, d11): cancelled selection creates no clip when empty and preserves existing clip invariant` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d13, §4): uploadAudio rejects valid audio when ownershipConfirmed is false` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d11, §4): uploadAudio rejects file exceeding 20 MB with FileSizeLimitError` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d12, §4): uploadAudio rejects unreadable file with UploadFailedError` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (§4, d14): uploadAudio accepts valid 5 s WAV and returns unpublished UploadResult` | `b068c56` |
| E-8, E-16, A-4 | S-7 | AC-7 | `valid upload passes uploadAudio, stores UnpublishedClip in clips.ts, and loads playable audio` | `09c757f` |
| E-8, E-16, A-4 | S-7 | AC-7 | `rejected upload preserves stored clip; second valid upload replaces it with new id; remove clears store` | `09c757f` |
| E-8, E-16, A-4 | S-7 | AC-7 | `§6 Invariant: every accepted upload has a permitted format and finite duration in (0, MAX_CLIP_DURATION]` | `622e394` |
| E-8, E-16, A-4 | S-7 | AC-7 | `§6 Postconditions: rejected uploads never mutate or create a clip in clips.ts across arbitrary sequences` | `622e394` |
| E-8, E-16, A-4 | S-7 | AC-7 | `§6 Preconditions: unreadable, undecodable, or non-permitted-format inputs are never accepted` | `622e394` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d9): uploadAudio accepts valid .wav file when file.type is empty string` | `df684be` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d5, d10): uploadAudio accepts exact 60.00 s WAV boundary with unpublished status` | `df684be` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d11): uploadAudio accepts exact MAX_UPLOAD_BYTES (20 MB) WAV file` | `df684be` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d9, d12): uploadAudio rejects with InvalidAudioError when canPlayType returns empty string` | `df684be` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d10, d12): uploadAudio rejects with InvalidAudioError on metadata timeout and cleans up URL and timer` | `df684be` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d12): UploadError base class sets name to "UploadError"` | `df684be` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d8, d11): getCurrentUser returns a copy and setUnpublishedClip generates strictly increasing clip IDs` | `df684be` |
| E-8, E-16, A-4 | S-7 | AC-7 | `AC-7 (d15): formatDuration formats 0, -5, NaN, Infinity as 0:00, 5 as 0:05, and 60 as 1:00` | `df684be` |

## 6c. Answers to headless review findings

Two runs are committed, both unedited:

- `evidence/headless-review.json` — `bash scripts/review_story.sh` after `m2-green`, main session, one turn, 150.7 s. `structured_output` is `{"findings": [], "verdict": "pass"}` and validates against `agent/review-schema.json`.
- `evidence/headless-review-agent-mode.json` — the same prompt run with `agy --agent reviewer`, the 6b fallback for a report that does not show the reviewer doing the work. Four turns, 259.7 s, verdict `pass`, three residual risks citing `clips.ts` and `UploadedClipView.tsx`. In this form agy leaves `structured_output` null and writes the report into `response`, which is why both files exist.

**Findings: none in either run**, so there is nothing to fix and nothing to reject.

Residual risks, recorded rather than answered — each is a settled scope decision:

| Risk | Where it is settled |
|---|---|
| Decoder variance across browsers (`canPlayType`, `loadedmetadata`) | Decision 15; the suite runs Chromium with WAV fixtures |
| Accepted clips live only in module memory in `clips.ts` | Decisions 7 and 8 — persistence deferred |
| `UploadedClipView` has no `src` on the first frame, because the object URL is created in `useEffect` | Decisions 2 and 14; tests wait for metadata readiness |

## Reflection (300–500 words)

_Pending — written by the team._


