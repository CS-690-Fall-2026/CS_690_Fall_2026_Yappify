# Deliverable 4c — Delegated Code Review of S-7 (code-reviewer)

## Provenance

| Field | Value |
|---|---|
| Story / AC | S-7 (Upload Existing Audio) / AC-7; AC-1 regression check |
| Agent definition | `.agents/agents/code-reviewer/agent.md` (frontmatter `name: reviewer`), included verbatim in the prompt |
| Prompt | `prompts/S-7-4c-code-reviewer.txt` (agent definition + task brief) |
| Invocation | Claude Code `Agent` tool, `subagent_type: general-purpose`, background run, launched in parallel with the test-writer. Prompt given to the agent: "Your complete instructions are in the file …/prompts/S-7-4c-code-reviewer.txt. Before doing anything else, read that entire file with the Read tool and follow it exactly. … This is a strictly read-only review: do not create, edit, delete, or format any file. Your final message must be the complete review report in the format the file specifies." |
| Model | `claude-opus-5-5` (orchestrating session and subagent) |
| Date | 2026-11-20 |
| Review target | HEAD `66168cfa64e9c8c42b47337a53ef21426625e4b8` (main); locked tests at `m2-tests-locked` = `d1732e760b05fd88701f316262b7003da1ee0b55` |
| Independence | The agent got only its prompt file. It did not see the orchestrator's conclusions, Ledger Entry 33's review notes, or the test-writer's report. |
| Permitted actions | Read-only file inspection, plus read-only `git diff` / `git log` / `git show`. No edits, no tests run. |
| Team-approved format change | Findings are numbered `CR-xxx` instead of the definition's `AC-xxx`, and an `ac_ref` field is added. |

## Summary of findings

| ID | Severity | ac_ref | Checklist item | Location | Recommended correction (short form) |
|---|---|---|---|---|---|
| CR-001 | minor | AC-7 | 4 Accessibility | `frontend/src/components/UploadClip.tsx:78` | Put "Checking audio…" in a `role="status" aria-live="polite"` region |
| CR-002 | minor | AC-7 | 4 Accessibility | `frontend/src/components/UploadClip.tsx:48-51` (button at `UploadedClipView.tsx:42`) | After Remove, move focus to the file input (ref + `focus()`) |
| CR-003 | minor | AC-7 | 2 Validation | `frontend/src/audio/constants.ts:20` | Set `UPLOAD_ACCEPT` to `.mp3,.wav,.m4a` so the picker matches decision 9 |
| CR-004 | minor | AC-7 | 3 Object URLs | `frontend/src/components/UploadedClipView.tsx:25-31` | Add a rule test that tracks create/revoke of the playback object URL on replace and remove (d14) |
| CR-005 | minor | none | 5 Unrelated changes | `frontend/package.json:10-22` | Process: record team approval for the Deliverable 5 devDependencies, lockfile and README changes, or move them to their own approved task; fix the stale README line |

**Totals: 0 blocking, 5 minor.**

## Verification results

- Agent's own statement: static review only. It ran no tests and created, modified or deleted no files (see section (d) of the report).
- Orchestrator check of the working tree, before and after: `git status --porcelain` before launch showed only `?? .gitignore` and `?? LEDGER-conflict-backup.txt` (plus the orchestrator's new `prompts/S-7-4c-*.txt`). The result after both reviews is recorded in `evidence/delegation/test-review.md` § Orchestrator verification.

---

## Agent report (verbatim)

# Code Review: S-7 (Upload Existing Audio), HEAD 66168cf compared with m2-tests-locked (d1732e7)

**Overall: no blocking findings and 5 minor ones.** The implementation matches the S-7 design §4–§9 and decisions 1–16, apart from the two approved deviations. It meets AC-7 and leaves AC-1 unaffected. The minor findings cover accessibility, the file-picker `accept` filter, one testing gap, and dependency/lockfile changes that the S-7 plan said would not happen.

---

### CR-001 — minor
**ac_ref:** AC-7
**Checklist item:** 4
**Spec basis:** docs/design/S-7.md §8 decision 11 (loading message while validating) and decision 15 (accessibility)
**Location:** `frontend/src/components/UploadClip.tsx:78`
**Issue:** The loading text `<p>Checking audio…</p>` is a plain paragraph. It is not inside a live region. While validation runs, the file input and checkbox are disabled (lines 61 and 73), and assistive technology is told nothing about why.
**Impact:** A screen-reader user selects a file and the controls go silent and disabled for up to `METADATA_TIMEOUT_MS` (10 s), with no announcement. Only the error path is announced (line 81). A successful upload is not announced either, so these users cannot tell that the check is running or that it has finished.
**Recommended fix:**
```tsx
{isChecking && <p role="status" aria-live="polite">Checking audio…</p>}
```
This does not change the rule tests: they locate the text with `getByText(CHECKING)` or `textContent`, not by role.

### CR-002 — minor
**ac_ref:** AC-7
**Checklist item:** 4
**Spec basis:** docs/design/S-7.md §8 decision 15 (Remove button; accessibility)
**Location:** `frontend/src/components/UploadClip.tsx:48-51` (the button is rendered at `frontend/src/components/UploadedClipView.tsx:42`)
**Issue:** Activating **Remove** unmounts the button that has focus. Nothing moves focus anywhere else, so it falls back to `<body>`.
**Impact:** Keyboard and screen-reader users lose their place after removing a clip and have to navigate from the top of the document again. This is a common WCAG 2.4.3 (Focus Order) problem.
**Recommended fix:**
```tsx
const fileInputRef = React.useRef<HTMLInputElement>(null);
const handleRemove = () => {
  removeUnpublishedClip();
  setClip(null);
  fileInputRef.current?.focus();
};
// ...
<input ref={fileInputRef} id={FILE_INPUT_ID} type="file" ... />
```

### CR-003 — minor
**ac_ref:** AC-7
**Checklist item:** 2
**Spec basis:** docs/design/S-7.md §8 decision 9 ("Audio-only MP4 files with a .mp4 extension will not be accepted"; the listed MIME variants) and decision 15 (accept attribute for the supported formats)
**Location:** `frontend/src/audio/constants.ts:20`
**Issue:** `UPLOAD_ACCEPT` includes `audio/mp4`. On most platforms that MIME type maps to `.mp4` as well as `.m4a`, so the picker offers `.mp4` files that `uploadAudio` always rejects (`upload.ts:139-142`). The list also leaves out several variants that decision 9 recognises (`audio/mp3`, `audio/x-wav`, `audio/wave`, `audio/m4a`). This does not break validation, because extensions decide the format, but the picker filter and the validation rules disagree. The string is copied from the approved plan, so this is a design-level inconsistency, not a coding slip.
**Impact:** Users are invited to pick `.mp4` files and then always see "Unsupported audio format".
**Recommended fix:**
```ts
// Extensions alone match decision 4/9 exactly; uploadAudio still validates every file.
export const UPLOAD_ACCEPT = ".mp3,.wav,.m4a";
```

### CR-004 — minor
**ac_ref:** AC-7
**Checklist item:** 3
**Spec basis:** docs/design/S-7.md §8 decision 14 (object URL revoked when the clip is replaced or removed)
**Location:** `frontend/src/components/UploadedClipView.tsx:25-31`
**Issue:** The playback object URL handling is correct as written. It creates one URL per `clip.id`, revokes it in the effect cleanup on replacement, removal and unmount, and handles the StrictMode double mount (`main.tsx:8` uses `React.StrictMode`). The `src` guard on line 34 also stops a revoked URL from being shown. No test checks any of this. The only revocation test covers the metadata probe in `upload.ts` (`tests/unit/upload-mutation-kills.unit.spec.ts:248-325`). The rule tests at `tests/rules/upload-rules.spec.ts:164-191` check only what is visible on the page.
**Impact:** A regression that leaks blob URLs on replace or remove would pass every test. Decision 14's revocation requirement is therefore unverified.
**Recommended fix:** Add a rule test that counts calls to create and revoke:
```ts
test("playback URL is revoked on replace and remove (d14)", async ({ page }) => {
  await page.addInitScript(() => {
    const live = new Set<string>();
    (window as any).__live = live;
    const c = URL.createObjectURL, r = URL.revokeObjectURL;
    URL.createObjectURL = (o) => { const u = c(o); live.add(u); return u; };
    URL.revokeObjectURL = (u) => { live.delete(u); r(u); };
  });
  await page.goto("/");
  await select(page, wav("a.wav", 5)); await expectClip(page, "a.wav", "0:05");
  await select(page, wav("b.wav", 5)); await expectClip(page, "b.wav", "0:05");
  expect(await page.evaluate(() => (window as any).__live.size)).toBe(1);
  await page.getByRole("button", { name: "Remove" }).click();
  await expect.poll(() => page.evaluate(() => (window as any).__live.size)).toBe(0);
});
```

### CR-005 — minor
**ac_ref:** none
**Checklist item:** 5
**Spec basis:** docs/plans/S-7-plan.md §1 Files ("Not touched: … `package.json` and lockfiles. No new dependencies."); AGENTS.md (protected lockfiles, `README.md`; no new dependencies without approval; commit format `Task N (AC-xx): …`)
**Location:** `frontend/package.json:10-22`
**Issue:** Commits `b068c56` ("unit tests") and `df684be` ("feat: add coverage and mutation testing setup") change things inside the review's change scope:
- They add the devDependencies `@stryker-mutator/core`, `@types/node`, `istanbul-lib-coverage`, `istanbul-reports` and `v8-to-istanbul`, plus a `test:coverage` script.
- They rewrite `frontend/package-lock.json` (about 3.8k lines).
- They edit the protected `README.md`.

LEDGER.md (lines 546-557) records this as Deliverable 5d–5f work, so it is not unrelated to the milestone. Still, it contradicts the approved S-7 plan. Neither commit message follows the `Task N (AC-xx):` format, and I found no explicit approval for the new dependencies. The ledger itself (line 655) notes that README.md now presents `npm run test:coverage` as the test command and mentions "pending UI specs", which are now stale. No S-7 source logic is affected.
**Impact:** The dependency surface and lockfile changed outside the approved S-7 scope, with no traceable approval. This also weakens the claim in the 4.8 ledger entry that there are no unrelated changes.
**Recommended fix:** This is process work, not code. Either record explicit team approval for the Deliverable 5 dependencies and the README edit in LEDGER.md / MILESTONE2.md, or move them into their own approved task. With approval, correct README line 68 so it reads:
```md
2. **Frontend:** `npm test` from `frontend/` (all Playwright suites); `npm run test:coverage` for the S-7 coverage gate.
```

---

## (a) Summary
- Blocking: **0**
- Minor: **5** (CR-001 to CR-005)

## (b) Verdict per checklist item
1. **Design and AC-7 compliance: pass, no findings.**
   - The `uploadAudio(file, {ownershipConfirmed})` signature follows the d13 revision.
   - The error subclasses are exported (d12).
   - `UploadResult` reuses S-1's `RecordedClip` with `audio` set to the original `File`, a normalized MIME type and `status: "unpublished"` (d14).
   - Formats and the duration limit come from the constants module (d4, d5, d14).
   - The display shows the filename, `Duration: m:ss`, a native `<audio controls>`, `Unpublished` and Remove (d15).
   - The confirmation label text and unchecked default match d13 and the locked AC-7 test.
2. **Validation and error handling: pass, one minor finding (CR-003).**
   - Check order is ownership → format (extension, then non-empty MIME, case-insensitive) → size (`>` 20 MiB, so exactly 20 MiB is accepted) → readability (`UploadFailedError`) → `canPlayType` → metadata or timeout (`InvalidAudioError`) → finite and > 0 (`InvalidAudioError`) → `> 60` unrounded (`DurationLimitError`). This matches d10/d12 plus approved deviation 1.
   - The messages are the exact d12 strings.
   - Timer, listeners and probe URL are cleaned up in `finally`.
   - No promise can go unhandled: `handleFileChange` uses try/catch/finally, and non-`UploadError` errors map to the `UploadFailedError` message.
3. **Browser-memory storage and object URLs: pass, one testing gap (CR-004).**
   - `data/clips.ts` uses a module variable only, with no fetch, localStorage or IndexedDB.
   - The probe URL is revoked on success, error and timeout.
   - The playback URL is revoked on replace, remove and unmount, and correctly under StrictMode.
4. **Accessibility and UI: pass with minor issues (CR-001, CR-002).**
   - The file input has a `<label htmlFor>` and the checkbox is wrapped in a label.
   - The error alert is rendered only while an error exists (approved deviation 2).
   - Both inputs are disabled while checking.
   - Cancel returns early without calling `uploadAudio`, and `input.value` is reset.
   - The filename, `0:05` and `Unpublished` each appear in exactly one element, so strict locators work.
   - AC-1 compatibility holds: no upload `<audio>` exists before an accepted upload, and no button text matches `/play/i`, `/^record/i` or `/^stop/i`.
5. **Bugs, regressions and unrelated changes: one minor process finding (CR-005).**
   - Overlapping selections are prevented by disabling the input.
   - If the component unmounts during validation, the clip is still stored, and the next mount shows it through the `getUnpublishedClip()` initializer. That is consistent and not a defect.
   - `recorder.ts` and `AudioRecorder.tsx` are unchanged. `App.tsx` adds only `<UploadClip />`.
   - The `testDir` change to `./tests` was approved in the plan.

## (c) Residual risks and testing gaps
- Every browser-level test uses WAV fixtures generated in memory. No test accepts MP3 or M4A in a real browser, and no test covers Firefox, Safari or Edge (the d15 targets) or real-world `file.type` variants. Only Chromium is configured.
- Duration display rounds while acceptance does not, so a 59.5–60.0 s clip is shown as `1:00`. That is allowed by the d10/d15 split, but no test covers it.
- Files whose metadata reports `Infinity` duration (some MP3s without a header) are rejected as invalid. That is correct per d10, but it may surprise users with real files.
- With `aria-live="assertive"` on a `role="alert"` that is mounted only when needed, screen readers announce the message when the region appears. This was not checked with a real screen reader.
- I did not run the tests. This review is static only.

## (d) Files inspected and commands run
**Files read:**
- prompts/S-7-4c-code-reviewer.txt
- docs/design/S-7.md
- docs/plans/S-7-plan.md
- frontend/src/audio/upload.ts
- frontend/src/audio/constants.ts
- frontend/src/data/clips.ts
- frontend/src/utils/formatDuration.ts
- frontend/src/components/UploadClip.tsx
- frontend/src/components/UploadedClipView.tsx
- frontend/src/App.tsx
- frontend/src/main.tsx
- frontend/src/audio/recorder.ts
- frontend/src/components/AudioRecorder.tsx
- frontend/tests/acceptance/ac-01-record.spec.ts
- frontend/tests/acceptance/ac-07-upload.spec.ts
- frontend/tests/rules/upload-rules.spec.ts
- frontend/stryker.config.mjs
- frontend/package.json

**Grep only:**
- frontend/tests/unit/*.ts
- frontend/tests/integration/upload.integration.spec.ts
- frontend/tests/property/upload.property.spec.ts
- LEDGER.md

**Commands (all read-only):**
- `git log --oneline m2-tests-locked..HEAD`
- `git diff --stat m2-tests-locked..HEAD -- frontend/src frontend/playwright.config.ts frontend/package.json`
- `git diff m2-tests-locked..HEAD -- frontend/src frontend/playwright.config.ts frontend/package.json`
- `git diff --stat m2-tests-locked..HEAD -- .` (in frontend/)
- `git diff --stat m2-tests-locked..HEAD -- docs README.md AGENTS.md .gitignore`
- `git log --format='%h %s' m2-tests-locked..HEAD -- package.json package-lock.json playwright.config.ts`
- `git show --stat b068c56 df684be 622e394 09c757f`
- `git show b068c56 -- package.json`
- `git show df684be -- docs/design/S-7.md README.md`
- `cat -n` / `sed -n` / `grep` / `ls` on the files above

No files were created, modified or deleted.
