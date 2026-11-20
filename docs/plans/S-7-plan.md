# S-7 — Upload Existing Audio: Implementation Plan (revision 2, for team review)

## Context

MILESTONE2 deliverable 4 calls for building S-7 against the locked AC-7 test
(`frontend/tests/acceptance/ac-07-upload.spec.ts`, tag `m2-tests-locked`), which
is currently red. Requirements come from `docs/design/S-7.md` §8, decisions 1–16.
S-1 (`ac-01-record.spec.ts`) has to stay green. This plan changes no files. Once
the team approves it, Task 4.1 commits it as `docs/plans/S-7-plan.md`.

**Changes since revision 1**
1. The rule tests (previously 4.6) now come **before** the validation implementation. They are written red first and guide the work that follows.
2. The upload UI (previously 4.5) is split into two tasks: **upload controls** (4.6) and **uploaded-audio display** (4.7).

Unchanged: the mock current user, the separate clip store (`data/clips.ts`) and the 10-second metadata timeout.

**What the locked AC-7 test needs on the page** (we write the code to fit these; the test does not change):
- A checkbox labelled "I confirm that I own this audio or have permission to upload it". It starts unchecked.
- An `input[type="file"]` that has an accessible name.
- After `tone.wav` (5 s) is accepted, the page shows exactly one element containing `tone.wav` and one containing `0:05` (Playwright strict mode fails on duplicates).
- The first `<audio>` on the page has loaded metadata and its duration is within 0.05 s of 5 s. `play()` must succeed.
- An element whose whole text is `Unpublished`.
- AC-1 compatibility: the upload `<audio>` element appears only after an accepted upload, so AC-1's `page.locator("audio").first()` still finds the recorder's player. The upload UI must not add any button matching `/play/i`, `/^record/i` or `/^stop/i`.

## 1. How

### Files

| File | Action | Task | Purpose |
|---|---|---|---|
| `frontend/src/audio/constants.ts` | create | 4.2 | Frontend config values (decision 14): formats, MIME variants, `MAX_CLIP_DURATION`, `MAX_UPLOAD_BYTES`, `UPLOAD_ACCEPT`, `METADATA_TIMEOUT_MS` |
| `frontend/src/utils/formatDuration.ts` | create | 4.2 | `formatDuration(seconds) → "m:ss"` (decision 15) |
| `frontend/tests/rules/wav.ts` | create | 4.3 | Writes PCM WAV buffers of a given length in memory, for test fixtures |
| `frontend/tests/rules/upload-rules.spec.ts` | create | 4.3 | Playwright rule tests for the S-7 edge cases, grouped `controls` and `display` |
| `frontend/playwright.config.ts` | modify (**needs approval**) | 4.3 | Change `testDir` from `./tests/acceptance` to `./tests` so `npm test` also runs the rule tests |
| `frontend/src/audio/upload.ts` | create | 4.4 | `uploadAudio()`, the error classes and the validation pipeline |
| `frontend/src/data/clips.ts` | create | 4.5 | In-memory store for the single unpublished clip, plus a mock current user (decision 8) |
| `frontend/src/components/UploadClip.tsx` | create | 4.6, 4.7 | Upload controls; holds the upload state. In 4.7 it gains one line that renders the display |
| `frontend/src/components/UploadedClipView.tsx` | create | 4.7 | Displays the accepted clip and owns its object URL |
| `frontend/src/App.tsx` | modify | 4.6 | Mount `<UploadClip />` after `<AudioRecorder />` |
| `docs/plans/S-7-plan.md`, `docs/traceability.md`, `LEDGER.md`, `MILESTONE2.md` §4a | create/append | 4.1, every task, 4.8 | Plan, traceability, one ledger entry per task, and plan-change notes |

Not touched: `recorder.ts`, `AudioRecorder.tsx`, the unused `main.ts`/`AudioRecorderVanilla.ts`, everything under `tests/acceptance/`, `package.json` and lockfiles. No new dependencies.

### Types and data structures

```ts
// constants.ts
export const SUPPORTED_AUDIO_FORMATS = {
  mp3: { extensions: [".mp3"], mimeTypes: ["audio/mpeg", "audio/mp3"], normalized: "audio/mpeg" },
  wav: { extensions: [".wav"], mimeTypes: ["audio/wav", "audio/x-wav", "audio/wave"], normalized: "audio/wav" },
  m4a: { extensions: [".m4a"], mimeTypes: ["audio/mp4", "audio/x-m4a", "audio/m4a"], normalized: "audio/mp4" },
} as const;
export type SupportedFormat = keyof typeof SUPPORTED_AUDIO_FORMATS;
export type NormalizedMimeType = (typeof SUPPORTED_AUDIO_FORMATS)[SupportedFormat]["normalized"];
export const MAX_CLIP_DURATION = 60;                 // seconds, decision 5
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;    // 20 MB, decision 11
export const UPLOAD_ACCEPT = ".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a";
export const METADATA_TIMEOUT_MS = 10_000;           // kept: 10 s

// upload.ts — reuses S-1's RecordedClip {audio, durationSeconds, mimeType} (decision 14)
export type UploadResult = RecordedClip & { mimeType: NormalizedMimeType; status: "unpublished" };
export interface UploadOptions { ownershipConfirmed: boolean }          // decision 13 revision
export async function uploadAudio(file: File, options: UploadOptions): Promise<UploadResult>;
export class UploadError extends Error {}   // base class; subclasses set `name` and a default user message
export class OwnershipNotConfirmedError extends UploadError {}
export class UnsupportedFormatError extends UploadError {}
export class FileSizeLimitError extends UploadError {}
export class InvalidAudioError extends UploadError {}
export class DurationLimitError extends UploadError {}
export class UploadFailedError extends UploadError {}

// data/clips.ts — kept separate; this is the one module a later backend replaces (decision 8)
export interface CurrentUser { id: string; displayName: string }
export interface UnpublishedClip extends UploadResult { id: string; ownerId: string; fileName: string }
export function getCurrentUser(): CurrentUser;                                   // mock record
export function setUnpublishedClip(result: UploadResult, fileName: string): UnpublishedClip; // replaces any existing clip
export function getUnpublishedClip(): UnpublishedClip | null;
export function removeUnpublishedClip(): void;

// UploadedClipView.tsx
export interface UploadedClipViewProps { clip: UnpublishedClip; onRemove: () => void }
```

`audio` holds the original `File`, which is a Blob, without re-encoding (decision 14).

### Validation (`uploadAudio`). The first failure determines the error.

0. **Ownership confirmation.** If `!options.ownershipConfirmed`, throw `OwnershipNotConfirmedError` before reading the file (decision 13).
1. **Format** (decision 9). Look up the lower-cased extension. A missing or unknown extension, including `.mp4`, throws `UnsupportedFormatError`. A non-empty `file.type` that is not one of that format's variants also throws `UnsupportedFormatError`. An empty MIME type is allowed through to decoding.
2. **Size** (decision 11). `file.size > MAX_UPLOAD_BYTES` throws `FileSizeLimitError`.
3. **Readability.** If `file.slice(0, 1).arrayBuffer()` rejects, throw `UploadFailedError` (decision 12).
4. **Decode** (decisions 9, 10). Create a temporary object URL and a detached `new Audio()` with `preload = "metadata"`. Race `loadedmetadata` against `error` and `METADATA_TIMEOUT_MS` (10 s). An error or a timeout throws `InvalidAudioError`, as does `canPlayType(normalized) === ""`. The probe URL is revoked in `finally`.
5. **Duration** (decision 10). A value that is not finite or is ≤ 0 throws `InvalidAudioError`. A value above `MAX_CLIP_DURATION` throws `DurationLimitError`. The raw value is compared without rounding, so 60.04 is rejected.
6. Return `{ audio: file, durationSeconds, mimeType: normalized, status: "unpublished" }`.

### Error handling (upload controls, task 4.6)

- `UploadError` messages are shown as written, using the exact wording from decision 12. Any other error is wrapped as `UploadFailedError`.
- Messages appear below the control in a persistent `<p role="alert" aria-live="assertive">`, which is cleared when a new selection starts (decision 15).
- A rejected file leaves the existing clip and the store unchanged (decisions 11, 12).

### Storage and playback (store 4.5, display 4.7)

- Clips are kept in memory only (decisions 7, 8). `data/clips.ts` holds a single module-level `UnpublishedClip | null`, with the owner taken from `getCurrentUser()`. Nothing goes to a network, `localStorage` or IndexedDB.
- `UploadClip` keeps the current `UnpublishedClip` in React state, mirroring the store.
- `UploadedClipView` owns the object URL. A `useEffect` keyed on `clip.id` calls `URL.createObjectURL(clip.audio)` and revokes the URL in its cleanup. This covers replacement (a new id), removal (the view unmounts) and the StrictMode double mount (decision 14).
- It renders the filename, `Duration: {formatDuration(d)}`, `<audio controls src={url}>`, `<span>Unpublished</span>` and a **Remove** button that calls `onRemove`. `onRemove` triggers `removeUnpublishedClip()` and clears the state.
- `formatDuration` rounds only the displayed value to whole seconds and pads the seconds (5 → `0:05`, 60 → `1:00`).

### UI integration

- `App.tsx` renders `<AudioRecorder />` and then `<UploadClip />` (decision 15).
- **Upload controls (4.6):**
  - an `<h2>Upload an Audio Clip</h2>`
  - the decision-13 checkbox, unchecked by default, inside a `<label>`
  - a `<label htmlFor>` "Choose audio file" plus `<input type="file" accept={UPLOAD_ACCEPT}>`, which selects a single file
  - while validating: the text "Checking audio…", with the input and checkbox disabled (decision 11)
  - the live error region
  - cancel handling: if the `change` handler receives zero files, it returns without calling `uploadAudio`. After each selection, `input.value = ""` is reset.
- **Uploaded-audio display (4.7):** `UploadClip` adds `{clip && <UploadedClipView clip={clip} onRemove={…} />}` below the controls. The filename appears in only that one element.

## 2. Implementation tasks

Each task gets one commit, `Task 4.N (AC-07): …`, and one `LEDGER.md` entry. Tasks 4.3–4.6 are deliberately left partly red. The ledger records which tests are expected to fail at each step. AC-1 must stay green in every task.

| # | Task | AC / decisions | Files | Done when |
|---|---|---|---|---|
| 4.1 | Commit the approved plan | AC-7 | `docs/plans/S-7-plan.md`, `docs/traceability.md` | Matches the approved revision. The diff touches only these files |
| 4.2 | Config constants and `formatDuration` | AC-7; d4, d5, d9, d11, d14, d15 | `src/audio/constants.ts`, `src/utils/formatDuration.ts` | `npm run build` passes. `npm test` shows AC-1 green and AC-7 still red |
| 4.3 | **Rule tests first (red)** | AC-7 §7 and §9 Additional Tests; d3, d5, d10–d13, d15 | `tests/rules/upload-rules.spec.ts`, `tests/rules/wav.ts`, `playwright.config.ts` | `npm test` discovers ac-01, ac-07 and the rule specs. Every rule test **fails because the upload UI is missing**, not because of a selector typo (red run saved to `evidence/red-rules.txt`). Locked tests unchanged. Cases are listed below |
| 4.4 | `uploadAudio` pipeline and error classes | AC-7; d3, d9, d10, d12, d13, d14 | `src/audio/upload.ts` | `npm run build` passes. The validation order and messages match the How section, which code review checks. The rule tests stay red because there is no UI yet |
| 4.5 | Separate clip store with mock user | AC-7; d7, d8, d11 | `src/data/clips.ts` | `npm run build` passes. No storage APIs used (`grep -n "localStorage\|indexedDB\|fetch" src/data/clips.ts` finds nothing) |
| 4.6 | **Upload controls**: file picker, confirmation checkbox, loading state, error display | AC-7; d11, d12, d13, d15 | `src/components/UploadClip.tsx`, `src/App.tsx` | `npx playwright test --grep @controls` passes, as does AC-1. The `@display` tests and AC-7 still fail, expectedly, because accepted clips are not rendered yet |
| 4.7 | **Uploaded-audio display**: audio player, filename, duration, unpublished status, Remove button | AC-7; d1, d2, d11, d14, d15 | `src/components/UploadedClipView.tsx`, `src/components/UploadClip.tsx` (one render line) | **Full `npm test` passes**: AC-1, AC-7 and every rule test. `git diff m2-tests-locked -- frontend/tests/acceptance` is empty |
| 4.8 | Final gate | AC-7 | `LEDGER.md`, `MILESTONE2.md` §4a | On a fresh clone, `npm ci && npm test` and `npm run build` pass. `m2-green` is tagged only with team approval |

**Rule-test cases (4.3).** Fixtures are generated in memory by `wav.ts` and passed through `setInputFiles({name, mimeType, buffer})`. No binaries are committed, and the fixtures' origin is documented in `wav.ts` (decision 16).

- `@controls`. Each case expects its message in the live region and no upload `<audio>`:
  - `.ogg` file → format message
  - `.mp4` file → format message
  - `.wav` with MIME `audio/mpeg` → format message
  - buffer over 20 MB → size message
  - random-byte `.wav` → invalid-audio message
  - 61 s WAV → duration message
  - 60.04 s WAV → duration message
  - box unchecked → confirmation message
  - checkbox unchecked on load, file input labelled, controls disabled while "Checking audio…" is shown
- `@display`:
  - a 60.00 s WAV is accepted and shows `1:00`
  - a rejected file after a valid clip leaves the previous clip in place
  - a second valid upload replaces the first
  - an empty `change` event leaves the clip unchanged
  - Remove clears the clip and its `<audio>`

## 3. Open items for team review (proposed defaults, unchanged)

1. `OwnershipNotConfirmedError`, message "Please confirm that you own this audio or have permission to upload it." It is checked first.
2. `FileSizeLimitError`, message "Audio files must be 20 MB or smaller." Decision 12 gives no message.
3. Rule tests in `frontend/tests/rules/`, which requires the `testDir` change to `./tests`.
4. Loading text "Checking audio…".
5. Red intermediate commits (4.3–4.6) are recorded in the ledger as a known exception to the AGENTS.md green gate, which applies at 4.7/4.8.

## Verification

- After each code task: `cd frontend && npm run build`.
- At 4.3: `npm test` red run, saved as evidence. At 4.6: `npx playwright test --grep @controls`. At 4.7 and 4.8: full `npm test`.
- `git diff m2-tests-locked -- frontend/tests/acceptance`. This must be empty.
- Manual check with `npm run dev`: MP3, WAV and M4A files ≤ 60 s each play. A 61 s file, a `.txt` file and an unchecked box are each rejected. A refresh clears the clip (decision 7).
- No backend, so `pytest` and coverage are not run. Coverage is not claimed.
