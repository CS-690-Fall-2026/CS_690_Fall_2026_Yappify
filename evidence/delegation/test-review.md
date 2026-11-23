# Deliverable 4c — Delegated Test Review of S-7 (test-writer)

## Provenance

| Field | Value |
|---|---|
| Story / AC | S-7 (Upload Existing Audio) / AC-7; AC-1 regression check |
| Agent definition | `.agents/agents/test-writer/agent.md`, included verbatim in the prompt |
| Prompt | `prompts/S-7-4c-test-writer.txt` (agent definition + task brief) |
| Invocation | Claude Code `Agent` tool, `subagent_type: general-purpose`, background run, launched in parallel with the code-reviewer. Prompt given to the agent: "Your complete instructions are in the file …/prompts/S-7-4c-test-writer.txt. Before doing anything else, read that entire file with the Read tool and follow it exactly. … This is a review task only: do not create, edit, delete, or format any file, and run only the commands the file permits. Your final message must be the complete review report in the format the file specifies." |
| Model | `claude-opus-5-5` (orchestrating session and subagent) |
| Date | 2026-11-20 |
| Review target | HEAD `66168cfa64e9c8c42b47337a53ef21426625e4b8` (main); locked tests at `m2-tests-locked` = `d1732e760b05fd88701f316262b7003da1ee0b55` |
| Independence | The agent got only its prompt file. It did not see the orchestrator's conclusions, Ledger Entry 33's review notes, or the code-reviewer's report. |
| Permitted actions | Read-only file inspection; `cd frontend && npm test`; `git diff m2-tests-locked -- frontend/tests/acceptance`; `git diff --stat m2-tests-locked HEAD -- frontend/tests/acceptance`; `git hash-object` / `git rev-parse` / `git ls-tree` on the locked files. No edits to source, tests or documentation. |
| Review mode | The test-writer definition normally writes tests. For this task it was told to describe proposed tests, not write them. |

## Summary of findings

| ID | Severity | ac_ref | Checklist item | Location | Recommended correction (short form) |
|---|---|---|---|---|---|
| TW-001 | **blocking** | AC-7 | 1, 3, 4 | `frontend/tests/unit/upload.unit.spec.ts:442`; `upload-mutation-kills.unit.spec.ts:91-174`; `tests/rules/upload-rules.spec.ts:148-191`; `tests/property/upload.property.spec.ts:43-54,75-159` | Add tests that accept MP3 and M4A (and the MIME variants and upper-case extensions) and check the normalized `mimeType` (d4, d9) |
| TW-002 | **blocking** | AC-7 | 1, 4 | No order test in `frontend/tests/unit/*`, `tests/rules/upload-rules.spec.ts` | Add precedence tests: format before size, ownership before format, size before readability (d12, plan deviation 1) |
| TW-003 | minor | AC-7 | 4 | `tests/rules/upload-rules.spec.ts:66-190`; `tests/integration/upload.integration.spec.ts:26,112`; `tests/property/upload.property.spec.ts:75,164,245`; `docs/traceability.md:13` | Put "AC-7" in 20 test or describe titles; copy the §5f rows into `docs/traceability.md` |
| TW-004 | minor | AC-7 | 3 | `tests/unit/upload.unit.spec.ts:284-340` | Replace the tautological cancel unit test with a UI cancel test |
| TW-005 | minor | AC-7 | 3 | `tests/integration/upload.integration.spec.ts:140-154,187`; `tests/property/upload.property.spec.ts:206-228` | Reword the claims; add a UI test that each kind of rejection leaves the displayed clip unchanged |
| TW-006 | minor | AC-7 | 3 | `tests/rules/upload-rules.spec.ts:164-171,182-190` | Check that the replaced player loads the second file; check that the playback URL is revoked on replace and Remove (d14) |
| TW-007 | minor | AC-7 | 4 | `upload-mutation-kills.unit.spec.ts:339,398-414,435-444`; `upload.integration.spec.ts:101` | Remove expected values taken from the implementation, or record them as team decisions |
| TW-008 | minor | AC-7 | 1 | `tests/rules/upload-rules.spec.ts:110-115` | Test the `accept` attribute, that `multiple` is absent, and where the error appears |
| TW-009 | minor | AC-7 | 1, 3 | `tests/rules/upload-rules.spec.ts` (no case) | Test the alert lifecycle and the UI's UploadFailedError message |
| TW-010 | minor | AC-7 | 3 | `tests/rules/upload-rules.spec.ts:173-180` | Prove that the cancel `change` event fired; add a cancel test with no prior clip |
| TW-011 | minor | AC-7 | 3 | `tests/unit/upload.unit.spec.ts:277-280`; `upload-mutation-kills.unit.spec.ts:291-303,339` | Assert the outcome count; isolate the timer-patching test from app timers |
| TW-012 | minor | AC-7 | 1 | no test | Test that an upload makes no network request and writes no `localStorage` or IndexedDB data (d7, d8, d13) |
| TW-013 | minor | AC-7 | 3 | `tests/rules/upload-rules.spec.ts:1,49-52` | Strengthen `expectRejected`; consider importing `../coverage-test` |

**Totals: 2 blocking, 11 minor.** The agent states that both blocking findings are gaps in test coverage, not demonstrated defects in the application.

## Verification results (as executed by the agent)

| Command | Result |
|---|---|
| `cd frontend && npm test` | exit 0. **43 passed, 0 failed, 0 skipped** (16.7 s). By file: ac-01 1, ac-07 1, upload-rules 15, upload.unit 13, upload-mutation-kills.unit 8, upload.integration 2, upload.property 3 |
| `git diff m2-tests-locked -- frontend/tests/acceptance` | exit 0, empty |
| `git diff --stat m2-tests-locked HEAD -- frontend/tests/acceptance` | exit 0, empty |
| `git hash-object` compared with `m2-tests-locked:` blobs | all 3 match (`ac-01-record.spec.ts` 2226025b…, `ac-07-upload.spec.ts` c26a055b…, `fixtures/tone.wav` ca57c5ce…) |

## Orchestrator verification (after both reviews)

- `git rev-parse HEAD` → `66168cfa64e9c8c42b47337a53ef21426625e4b8`, the same as before. Nothing was committed or tagged.
- `git diff --stat` → empty. No tracked file was modified by either agent.
- `git status --porcelain` → `?? .gitignore`, `?? LEDGER-conflict-backup.txt` (both present before launch), plus `?? prompts/S-7-4c-code-reviewer.txt`, `?? prompts/S-7-4c-test-writer.txt` and `?? evidence/delegation/`, which were all created by the orchestrator as approved.
- Ignored paths: `.venv/`, `frontend/dist/`, `frontend/node_modules/` and `frontend/test-results/`, the same set as before launch. `npm test` refreshes the ignored `frontend/test-results/`. The agent also wrote `/tmp/s7-tw-npmtest.log`, outside the repo.
- `git diff m2-tests-locked -- frontend/tests/acceptance | wc -c` → `0`.

---

## Agent report (verbatim)

# S-7 (Upload Existing Audio): delegated test review (test-writer, review only)

Target: HEAD `66168cf` (main). Locked tag `m2-tests-locked` points to `d1732e760b05fd88701f316262b7003da1ee0b55`. I did not create, edit, delete or format any repository file. The only thing written to disk was the `npm test` console output, redirected to `/tmp/s7-tw-npmtest.log`, which is outside the repo.

## Findings

### TW-001 — blocking
**ac_ref:** AC-7
**Checklist item:** 1, 3, 4
**Spec basis:** docs/design/S-7.md §8 decision 4 (SUPPORTED_AUDIO_FORMATS = MP3, WAV, M4A), decision 9 (MIME variants and normalized return values), AC-7 Given ("a format permitted by SUPPORTED_AUDIO_FORMATS")
**Location:** `frontend/tests/unit/upload.unit.spec.ts:442`, `frontend/tests/unit/upload-mutation-kills.unit.spec.ts:91-174`, `frontend/tests/rules/upload-rules.spec.ts:148-191`, `frontend/tests/property/upload.property.spec.ts:43-54,75-159`
**Issue:** Every positive (accepted) assertion in the suite uses a `.wav` file whose MIME is `audio/wav` or empty. No test asserts any of these:
- an `.mp3` or `.m4a` file is accepted;
- the MIME variants `audio/mp3`, `audio/x-m4a`, `audio/m4a`, `audio/x-wav` or `audio/wave` are accepted;
- an upper-case extension is accepted;
- the normalized `mimeType` is `audio/mpeg` for MP3 or `audio/mp4` for M4A.

The property invariant test does generate `.mp3`, `.m4a`, `.WAV`, `audio/x-wav` and `audio/wave` inputs. It only checks "if accepted, then valid" plus `acceptedCount > 0`, so it would still pass if every MP3 and M4A file were rejected.
**Impact:** The suite stays green if a defect removes MP3 or M4A support, breaks a MIME variant, or returns the wrong normalized MIME type. Two of the three formats in decision 4 are never verified as uploadable.
**Recommended correction:** Add these tests:
- `AC-7 (d4, d9): uploadAudio accepts .mp3 with audio/mpeg and audio/mp3 and returns mimeType "audio/mpeg"`
- `AC-7 (d4, d9): uploadAudio accepts .m4a with audio/mp4, audio/x-m4a and audio/m4a and returns mimeType "audio/mp4"`
- `AC-7 (d9): uploadAudio accepts .wav with audio/x-wav and audio/wave and returns "audio/wav"`
- `AC-7 (d9): uploadAudio accepts upper-case .WAV extension`

Each should expect `status: "unpublished"`, `audio === file` and a finite duration in (0, 60]. Two ways to supply the audio:
- **Mock:** replace `window.Audio` with a mock that fires `loadedmetadata` with duration 5, using the same pattern as the NaN/0/Infinity test.
- **Real fixtures:** commit small, documented MP3 and M4A files (decision 16) for one end-to-end UI test, `AC-7 (d4): MP3 and M4A uploads display a playable unpublished clip`, which asserts metadata loads and `play()` succeeds.

### TW-002 — blocking
**ac_ref:** AC-7
**Checklist item:** 1, 4
**Spec basis:** docs/design/S-7.md §8 decision 12 (validation order format → size → decode → duration; "The first failed validation determines the error"); docs/plans/S-7-plan.md approved deviation (ownership confirmation checked before format)
**Location:** whole suite. There is no order test in `frontend/tests/unit/*.spec.ts` or `frontend/tests/rules/upload-rules.spec.ts`.
**Issue:** Every rejection test fails exactly one check, so the precedence between checks is never exercised. Only one precedence is implicitly covered: the over-20 MB file of zero bytes (`upload-rules.spec.ts:81`) shows that size wins over decode. These are not covered:
- format before size (oversize `.ogg`);
- ownership before format (unconfirmed `.ogg`), which is the approved deviation;
- size before readability.
**Impact:** Reordering the checks in `uploadAudio` (for example, size before format, or format before ownership) would not fail any test, even though decision 12 and the approved plan say which error the user sees.
**Recommended correction:** Add these tests:
- `AC-7 (d12): oversize .ogg is rejected with UnsupportedFormatError (format checked before size)`. Expected: name `UnsupportedFormatError`, message "Unsupported audio format. Please select MP3, WAV, or M4A."
- `AC-7 (d13, plan deviation): unconfirmed .ogg is rejected with OwnershipNotConfirmedError`. Expected: the plan's confirmation message.
- `AC-7 (d12): oversize unreadable .wav is rejected with FileSizeLimitError (size before readability)`.

### TW-003 — minor
**ac_ref:** AC-7
**Checklist item:** 4
**Spec basis:** test-writer Rule 2 (the AC ID must be in the test name or an immediately associated comment)
**Location:**
- `frontend/tests/rules/upload-rules.spec.ts:66-190` (15 tests)
- `frontend/tests/integration/upload.integration.spec.ts:26,112`
- `frontend/tests/property/upload.property.spec.ts:75,164,245`
- `docs/traceability.md:13`
**Issue:** 20 of the 43 tests do not have "AC-7" in their title or describe block. They cite only `dN` or `§6`. AC-7 appears only in file-level docblocks (rules: none; integration and property: "S-7 / AC-7"), and those are not attached to each test. `docs/traceability.md` lists only the acceptance test; MILESTONE2.md §5f has the fuller table.
**Impact:** Traceability depends on the separate table, and `--grep AC-7` misses 20 tests.
**Recommended correction:** Prefix the titles or describe blocks with `AC-7`, for example `describe("AC-7 controls", …)` and `"AC-7 (§6 Invariant): …"`. Also mirror the §5f rows into `docs/traceability.md`.

### TW-004 — minor
**ac_ref:** AC-7
**Checklist item:** 3
**Spec basis:** §7 edge case 4; decision 11 ("Canceling selection will not call uploadAudio")
**Location:** `frontend/tests/unit/upload.unit.spec.ts:284-340`
**Issue:** The test is tautological. It reads `getUnpublishedClip()` twice with nothing in between, and the "cancel" is just a comment. No cancel handler or `UploadClip` code runs, so the test cannot fail because of cancellation behavior.
**Impact:** It inflates coverage of §7.4. The real check is the UI rule test (see TW-010).
**Recommended correction:** Remove the test or replace it with a UI test:
- `AC-7 (§7.4, d11): cancelling with no prior clip creates no clip and shows no error`. Load the page, set the checkbox, call `setInputFiles([])`, then expect no `audio` element, no "Unpublished" text and no `role="alert"`.
- Optionally spy on `uploadAudio` (via `page.addInitScript` patching the module) to assert it was not called.

### TW-005 — minor
**ac_ref:** AC-7
**Checklist item:** 3
**Spec basis:** §6 Postconditions; decisions 11 and 12 ("A rejected upload leaves the previous valid clip unchanged")
**Location:** `frontend/tests/integration/upload.integration.spec.ts:140-154,187`; `frontend/tests/property/upload.property.spec.ts:206-228`
**Issue:** In both tests, the test code itself calls `setUnpublishedClip` only when `uploadAudio` resolves. `uploadAudio` never touches the store, so "rejected upload did not change the store" is true by construction. The assertion checks the test's own control flow, not the application's.
**Impact:** These tests could not catch a component that stores or clears the clip on rejection. The UI rule test `display › rejected file leaves the previous clip in place` is the only real guard, and it covers only `.ogg`.
**Recommended correction:** Reword the claims to match what is tested (that `uploadAudio` rejects with an `UploadError` subclass). Add a UI-level property or loop test: `AC-7 (§6, d12): rejected uploads of each error kind (format, size, invalid, duration, unconfirmed) leave the displayed clip unchanged`. After each rejection, expect the same filename, duration and "Unpublished" label, and exactly one `audio` element.

### TW-006 — minor
**ac_ref:** AC-7
**Checklist item:** 3
**Spec basis:** decision 11 ("A successful new upload replaces the previous clip"), decision 14 (object URL revoked when the clip is replaced or removed), decision 2
**Location:** `frontend/tests/rules/upload-rules.spec.ts:164-171,182-190`
**Issue:** The replacement test checks only the text and that there is one `<audio>`. It does not check that the player now plays the second file. If a stale `src` still pointed at the first (5 s) file, the test would pass. No test checks that the playback object URL in `UploadedClipView` is revoked on replace or remove; the only revocation test covers the probe URL in `uploadAudio`.
**Impact:** A playback mismatch or a URL leak would go undetected.
**Recommended correction:**
- Extend the replacement scenario as `AC-7 (d11, d2): second upload's player loads the second file`. Wait for `readyState >= HAVE_METADATA` with `|duration − 10| < 0.05`.
- Add `AC-7 (d14): playback object URL is revoked on replace and on Remove`. Spy on `URL.revokeObjectURL` via `addInitScript`, and expect the previous `audio.src` to be among the revoked URLs.

### TW-007 — minor
**ac_ref:** AC-7
**Checklist item:** 4
**Spec basis:** test-writer Rule 1 (expected values only from AC or design); decision 8 specifies only "a mock current-user record"; decision 15 specifies only `m:ss`, with examples `0:05` and `1:00`
**Location:**
- `frontend/tests/unit/upload-mutation-kills.unit.spec.ts:398-414` (`"user-1"`, `"Demo User"`, `/^clip-(\d+)$/`)
- `frontend/tests/unit/upload-mutation-kills.unit.spec.ts:435-444` (`-5`, `NaN`, `Infinity` → `"0:00"`)
- `frontend/tests/unit/upload-mutation-kills.unit.spec.ts:339` (`clearedTimerIds` equals the sentinel)
- `frontend/tests/integration/upload.integration.spec.ts:101` (`/^clip-\d+$/`)
**Issue:** These expected values come from the implementation, not from the design or plan. The 5.4 → `0:05` and 59.6 → `1:00` cases are justified by the plan ("rounds only the displayed value"). The values listed above are not.
**Impact:** The tests lock in incidental implementation choices, which conflicts with Rule 1.
**Recommended correction:** Assert only what the spec gives:
- the owner ID equals `getCurrentUser().id` and is non-empty;
- clip IDs are distinct, and a new upload gets a new ID;
- `formatDuration(5) === "0:05"` and `formatDuration(60) === "1:00"`.

Alternatively, record the mock values and the non-finite formatting as explicit team decisions before keeping those asserts.

### TW-008 — minor
**ac_ref:** AC-7
**Checklist item:** 1
**Spec basis:** decision 15 (`accept` attribute for supported formats; standard picker), decision 11 ("one audio file at a time"), decision 12 ("Errors will appear below the upload control")
**Location:** `frontend/tests/rules/upload-rules.spec.ts:110-115`
**Issue:** No test checks the `accept` attribute, the absence of `multiple`, or where the error appears relative to the file input.
**Impact:** Losing the `accept` attribute or adding `multiple` would go unnoticed.
**Recommended correction:**
- `AC-7 (d15, d11): file input accepts MP3/WAV/M4A and selects a single file`. Expect the `accept` value to cover `.mp3`, `.wav` and `.m4a`, and expect no `multiple` attribute.
- Optionally, `AC-7 (d12): error is rendered after the file input in DOM order`.

### TW-009 — minor
**ac_ref:** AC-7
**Checklist item:** 1, 3
**Spec basis:** decision 12 (UploadFailedError message; errors announced), docs/plans/S-7-plan.md approved deviation 2 (the `role="alert"` region is rendered only while an error exists, and is cleared when a new selection starts)
**Location:** `frontend/tests/rules/upload-rules.spec.ts` (no case)
**Issue:** These behaviors are untested:
- **Alert lifecycle:** no test checks that the alert is cleared after an error is followed by a successful upload, or that there is no alert on initial load. The 60 s test asserts no alert only when no error came first.
- **UploadFailedError message:** "The audio file could not be loaded. Please try again." is never asserted in the UI.
- **Error wrapping:** the UI's wrapping of non-`UploadError` errors is not exercised.

**Impact:** The alert-lifecycle deviation and the UploadFailedError message are unverified.
**Recommended correction:**
- `AC-7 (d12, plan deviation): alert is absent on load, shown after a rejection, and removed after a subsequent valid upload`.
- `AC-7 (d12): unreadable file shows "The audio file could not be loaded. Please try again."`. Patch `File.prototype.slice` via `addInitScript` so reads fail.

### TW-010 — minor
**ac_ref:** AC-7
**Checklist item:** 3
**Spec basis:** §7 edge case 4; decision 11
**Location:** `frontend/tests/rules/upload-rules.spec.ts:173-180`
**Issue:** There are two weaknesses:
1. **Possibly vacuous:** `setInputFiles([])` runs on an input whose value the handler has already reset to `""`. Nothing proves a `change` event reached the handler, so the assertions could hold trivially.
2. **Untested case:** cancelling with no existing clip ("No new clip is created") is not tested at the UI level.

**Impact:** The cancellation coverage is weaker than the test name suggests.
**Recommended correction:** Add a `change` listener counter (via `page.evaluate`) and assert that the event fired, then keep the existing assertions. Also add the no-prior-clip cancel test described in TW-004.

### TW-011 — minor
**ac_ref:** AC-7
**Checklist item:** 3
**Spec basis:** decision 10 (NaN, Infinity and zero are invalid); plan (10 s metadata timeout)
**Location:** `frontend/tests/unit/upload.unit.spec.ts:277-280`; `frontend/tests/unit/upload-mutation-kills.unit.spec.ts:291-303,339`
**Issue:**
1. **Missing length check:** the NaN/0/Infinity loop never asserts `outcomes.length === 3`, so an empty result would pass vacuously.
2. **Flake risk in the timeout test:** it replaces global `window.setTimeout` and `clearTimeout` (running handlers synchronously) while the live app and Vite client are on the page. Any foreign timer call during that window changes `timeoutDelays` or `clearedTimerIds` (`toEqual([10_000])` / `toEqual([987654])`).

**Impact:** One weak assertion and a latent flake. Neither failed in this run.
**Recommended correction:**
- Assert `expect(outcomes.map(o => o.reported)).toEqual(["0","NaN","Infinity"])`.
- In the timeout test, filter the recorded delays and IDs to the expected sentinel and value, or run it on a blank page (`about:blank` plus a module import) where no app timers are active.

### TW-012 — minor
**ac_ref:** AC-7
**Checklist item:** 1
**Spec basis:** decision 8 (no request is sent to a backend), decision 13 (no permanent confirmation record), decision 7 (browser memory only)
**Location:** no test
**Issue:** Nothing asserts that an upload makes no network request or writes nothing to `localStorage` or IndexedDB. The plan relied on a grep of `clips.ts`.
**Impact:** A regression that persists the clip or posts the file would pass the suite.
**Recommended correction:** `AC-7 (d7, d8, d13): valid upload issues no network request and writes no persistent storage`. Record `page.on("request")` after page load, perform a valid upload, and expect no non-Vite requests. Also expect `localStorage.length === 0` and no confirmation key.

### TW-013 — minor
**ac_ref:** AC-7
**Checklist item:** 3
**Spec basis:** §6 Postconditions ("A rejected file does not produce an accepted clip")
**Location:** `frontend/tests/rules/upload-rules.spec.ts:49-52`, `frontend/tests/rules/upload-rules.spec.ts:1`
**Issue:** `expectRejected` checks only the alert text and that there is no `<audio>`. It does not check that the rejected filename and the "Unpublished" label are absent. The rule spec also imports `@playwright/test` rather than `../coverage-test`, so the 15 UI rule tests are left out of the coverage and Stryker instrumentation that MILESTONE2 §5 reports.
**Impact:** The rejection assertion is slightly weak, and the reported coverage and mutation metrics understate the UI tests (or exclude them).
**Recommended correction:** In `expectRejected`, add `expect(page.getByText(file.name)).toHaveCount(0)` and `expect(page.getByText(/^unpublished$/i)).toHaveCount(0)`. Consider switching the import to `../coverage-test`; that is a test-only change.

## (a) Summary counts
- Blocking: 2 (TW-001, TW-002)
- Minor: 11 (TW-003 to TW-013)
- No `test.skip`, `.only` or `fixme` anywhere in scope. All 43 tests executed and passed.

## (b) Per-checklist-item verdict
1. **Adequate S-7 coverage:** Partial. All four §7 edge cases and the §6 rules have tests, but MP3/M4A acceptance (TW-001) and decision-12 ordering (TW-002) are unverified. Further minor gaps are in TW-006, TW-008, TW-009 and TW-012.
2. **AC-1 and AC-7 still covered:** Yes. `test_ac1_record_and_stop_displays_playback` and `test_ac7_valid_audio_upload_displays_playback` both executed, were not skipped, and passed.
3. **Missing edge cases and weak assertions:** Findings TW-004, TW-005, TW-006, TW-010, TW-011 and TW-013. There are no skip or only markers.
4. **Rule, unit, integration and property tests reflect the design:**
   - **Matches:** the decision-12 messages match verbatim. The plan's messages for confirmation and size match. The boundaries match: 60.00 accepted, 60.04 and 61 rejected, 20 MB exactly accepted and 20 MB + 1 rejected, and 0/NaN/Infinity invalid.
   - **Problems:** AC ID naming is missing in 20 tests (TW-003), and some expectations come from the implementation (TW-007).
5. **Locked acceptance tests unchanged:** Yes. The diff is empty, and all three blob hashes match the tag. HEAD's tree is identical as well.

## (c) Coverage map (item 1)
| Spec item | Covering test(s) |
|---|---|
| §7.1 unsupported format | rules `.ogg`, `.mp4`, conflicting MIME; unit `.ogg`, `.mp4`, no extension, conflicting MIME; property Preconditions |
| §7.2 over MAX_CLIP_DURATION | rules 61 s, 60.04 s; unit 61 s, 60.04 s; integration (61 s) |
| §7.3 corrupted audio | rules undecodable `.wav`; unit corrupted, 0/NaN/Infinity, canPlayType `""`, metadata timeout; property Preconditions |
| §7.4 cancel | rules cancel with existing clip (possibly vacuous, TW-010); unit cancel test is tautological (TW-004); **gap:** cancel with no clip at UI level |
| §6 preconditions (readable, permitted format) | unit unreadable → UploadFailedError; property Preconditions |
| §6 postconditions | AC-7; rules display tests; property/integration (tautological, TW-005) |
| §6 invariant | property Invariant; unit 60.00 s boundary |
| d1 unpublished, not published | AC-7 "Unpublished"; rules expectClip; unit `status` |
| d2 playback control | AC-7 (metadata and play); rules `audio` count 1; integration play() |
| d3 reject invalid, no playable clip | rules expectRejected; unit |
| d4 MP3/WAV/M4A | WAV only. **Gap: TW-001** |
| d5 60 s | rules and unit 60.00 / 60.04 / 61 |
| d6 ownership confirmation, no auto-publish | rules unconfirmed; unit d13 |
| d7 browser memory only | **Gap: TW-012** (not strictly testable beyond "no persistence") |
| d8 frontend-only, mock user | mutation-kills getCurrentUser (implementation-derived values, TW-007); **gap:** no network check (TW-012) |
| d9 extension + MIME + decode, variants, normalized, empty MIME, `.mp4` rejected | conflicting MIME, `.mp4`, no extension, empty MIME `.wav`, canPlayType. **Gap:** MP3/M4A variants and normalization (TW-001) |
| d10 finite, > 0, ≤ 60, no rounding | 60.00 / 60.04 / 61; 0 / NaN / Infinity |
| d11 20 MB, one file, single clip, replace, preserve on reject, loading + disabled, cancel | 20 MB ± 1 boundaries; replace; preserve (`.ogg` only); loading/disabled observer; cancel. **Gap:** single-file / `multiple` (TW-008) |
| d12 order, messages, unreadable → UploadFailedError | messages: unit and rules (UploadFailed only at unit level); **order gap: TW-002**; UI UploadFailed message (TW-009) |
| d13 checkbox text, unchecked default, enforced | AC-7; rules unchecked-on-load and unconfirmed rejection; unit |
| d14 original File, object URL lifecycle, status | unit/integration `audio === file`; probe URL revoked (timeout test). **Gap:** playback URL revocation (TW-006) |
| d15 filename, `m:ss`, native control, label, Remove, accessible labels, live region, `accept` | AC-7; rules 1:00 / 0:05 / 0:10, Remove, labels, `role=alert`; formatDuration unit. **Gap:** `accept` attribute (TW-008) |
| d16 Playwright, documented fixtures, real metadata and playback | AC-7; `wav.ts` documents fixture origin; integration play() |
| Plan deviation: ownership before format | **Gap: TW-002** |
| Plan deviation: alert only while an error exists | partial (60 s test, cancel test). **Gap:** clearing after an error (TW-009) |

## (d) Verification results

**1. `cd frontend && npm test`** (run in background, output redirected to `/tmp/s7-tw-npmtest.log`): exit status 0.
```
Running 43 tests using 4 workers
...
  43 passed (16.7s)
EXIT=0
```
Per-file counts (all passed, 0 failed, 0 skipped):

| File | Passed |
|---|---|
| `tests/acceptance/ac-01-record.spec.ts` | 1 |
| `tests/acceptance/ac-07-upload.spec.ts` | 1 |
| `tests/rules/upload-rules.spec.ts` | 15 (10 `@controls`, 5 `@display`) |
| `tests/unit/upload.unit.spec.ts` | 13 |
| `tests/unit/upload-mutation-kills.unit.spec.ts` | 8 |
| `tests/integration/upload.integration.spec.ts` | 2 |
| `tests/property/upload.property.spec.ts` | 3 |

The key lines:
```
✓   2 [chromium] › tests/acceptance/ac-01-record.spec.ts:39:1 › test_ac1_record_and_stop_displays_playback (5.6s)
✓   1 [chromium] › tests/acceptance/ac-07-upload.spec.ts:30:1 › test_ac7_valid_audio_upload_displays_playback (1.3s)
```

**2. `git diff m2-tests-locked -- frontend/tests/acceptance`:** exit 0, empty output.

**3. `git diff --stat m2-tests-locked HEAD -- frontend/tests/acceptance`:** exit 0, empty output.

**4. `git ls-tree -r m2-tests-locked -- frontend/tests/acceptance`:** exit 0.
```
100644 blob 2226025b107933ce39d37a093cf76801dfc6fe2b	frontend/tests/acceptance/ac-01-record.spec.ts
100644 blob c26a055b994130ef0b1a43e49ce79f9f68b266da	frontend/tests/acceptance/ac-07-upload.spec.ts
100644 blob ca57c5ce4b0b98a336c96801c0b8edda07f9e03d	frontend/tests/acceptance/fixtures/tone.wav
```
`git rev-parse m2-tests-locked` returned `d1732e760b05fd88701f316262b7003da1ee0b55`.

**5. `git hash-object <file>` compared with `git rev-parse m2-tests-locked:<file>`:**
```
frontend/tests/acceptance/ac-01-record.spec.ts
  worktree: 2226025b107933ce39d37a093cf76801dfc6fe2b
  locked:   2226025b107933ce39d37a093cf76801dfc6fe2b
frontend/tests/acceptance/ac-07-upload.spec.ts
  worktree: c26a055b994130ef0b1a43e49ce79f9f68b266da
  locked:   c26a055b994130ef0b1a43e49ce79f9f68b266da
frontend/tests/acceptance/fixtures/tone.wav
  worktree: ca57c5ce4b0b98a336c96801c0b8edda07f9e03d
  locked:   ca57c5ce4b0b98a336c96801c0b8edda07f9e03d
```
All three match. As a supplementary check, `git ls-tree -r HEAD -- frontend/tests/acceptance` lists the same three blob hashes.

**6. Read-only greps:** I grepped `docs/traceability.md` and `MILESTONE2.md` for S-7, AC-7 and §5f entries to read the traceability tables.

## (e) Files inspected
All paths are under the repository root:
- `prompts/S-7-4c-test-writer.txt`
- `docs/design/S-7.md`
- `docs/plans/S-7-plan.md`
- `docs/traceability.md` (grep)
- `MILESTONE2.md` (§5f, lines 155–184)
- `frontend/tests/acceptance/ac-01-record.spec.ts`
- `frontend/tests/acceptance/ac-07-upload.spec.ts`
- `frontend/tests/acceptance/fixtures/tone.wav` (hash only)
- `frontend/tests/rules/upload-rules.spec.ts`
- `frontend/tests/rules/wav.ts`
- `frontend/tests/unit/upload.unit.spec.ts`
- `frontend/tests/unit/upload-mutation-kills.unit.spec.ts`
- `frontend/tests/integration/upload.integration.spec.ts`
- `frontend/tests/property/upload.property.spec.ts`
- `frontend/playwright.config.ts`
- `frontend/tests/coverage-test.ts`
- Implementation, read for interfaces only: `frontend/src/audio/upload.ts`, `frontend/src/audio/constants.ts`, `frontend/src/data/clips.ts`, `frontend/src/utils/formatDuration.ts`, `frontend/src/components/UploadClip.tsx`, `frontend/src/components/UploadedClipView.tsx`, `frontend/src/App.tsx`

Stop condition triggered: none. No test failed, and no production defect was observed. Both blocking findings are coverage gaps in the tests, not demonstrated defects in the application.
