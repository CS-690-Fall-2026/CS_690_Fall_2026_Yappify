# Code Review: `UploadedClipView.tsx` and `UploadClip.tsx`

**Reviewer:** `reviewer` subagent (Antigravity CLI)  
**Date:** 2026-11-21  
**Task:** Task 4.7 (AC-07)  

**Scope:**
- `frontend/src/components/UploadedClipView.tsx`
- `frontend/src/components/UploadClip.tsx`
- Specification: `docs/design/S-7.md` (Sections 2, 4, 5, 6, 7, 8, 9) and `docs/plans/S-7-plan.md` (Tasks 4.6 and 4.7)
- Related Modules & Tests: `frontend/src/audio/upload.ts`, `frontend/src/data/clips.ts`, `frontend/src/utils/formatDuration.ts`, `frontend/tests/acceptance/ac-07-upload.spec.ts`, and `frontend/tests/rules/upload-rules.spec.ts`.

---

## Evaluation Summary

### 1. Correctness & Edge Cases
- **Design Decisions 1 & 14:** Accepted files retain `status: "unpublished"` and display an `<span>Unpublished</span>` label without automated publishing.
- **Design Decisions 2 & 15:** Accepted clips render native `<audio controls preload="metadata" />`, the original filename, duration formatted via `formatDuration`, unpublished label, and a "Remove" button.
- **Design Decisions 3 & 12:** Rejected files do not produce playable clips, do not mutate `data/clips.ts`, and preserve any existing valid clip.
- **Design Decisions 11 & 12 (Replacement & Rejection):** A successful upload replaces the previous clip in both React state and the clip store; a rejected upload displays the appropriate error below the controls and leaves the previous valid clip intact.
- **Design Decision 11 & §7 Case 4 (Cancellation):** If the file picker is canceled (empty `change` event), `file` is `undefined`, returning before `uploadAudio` or `setError(null)` is called. The existing clip and any existing error message remain unchanged.
- **Input Reset:** `input.value = ""` is reset immediately in `handleFileChange`, allowing subsequent selection of the identical file to trigger `onChange`.
- **Error Handling:** Subclasses of `UploadError` render their specific messages, while unknown errors fall back to `UploadFailedError`. Errors are cleared when a new selection begins.
- **Accessibility:** The copyright checkbox and file picker have accessible labels (`<label htmlFor>` / wrapping `<label>`). Errors render in a live region with `role="alert"` and `aria-live="assertive"`.

### 2. Security
- **XSS Prevention:** File names, error strings, and duration labels are rendered through standard React JSX string children (`<p>{clip.fileName}</p>`), preventing injection attacks. No `dangerouslySetInnerHTML` is used.
- **Memory & Object URL Management:** Object URLs are allocated in `useEffect` and reliably revoked in the effect cleanup. Strict Mode double-mounts and clip replacements cleanly revoke previously allocated URLs.

### 3. Concurrency & State
- **Double-submit & Input Disabling:** `isChecking` is set while `uploadAudio` awaits. Both the file input and copyright checkbox are `disabled={isChecking}`, preventing concurrent upload invocations.
- **State Mirroring:** `UploadClip` lazily initializes from `getUnpublishedClip()` and keeps React state in sync with `setUnpublishedClip()` and `removeUnpublishedClip()`.
- **Strict Mode & Revocation Race Avoidance:** In `UploadedClipView`, `const src = clipUrl?.clipId === clip.id ? clipUrl.url : undefined;` prevents the `<audio>` element from attempting to load a revoked URL of a previous clip during the render phase prior to effect execution.

### 4. Performance & Scalability
- Validation runs purely on the client with lightweight metadata probing.
- Minimal re-renders; no memory leaks detected.

### 5. Maintainability & Testing
- Strict adherence to TypeScript typing and Playwright selector requirements (no multiple-match ambiguities, compliance with Playwright strict mode).
- Clean separation between upload state management (`UploadClip`) and playback presentation (`UploadedClipView`).

---

## Review Outcome

**Review passed — no actionable findings.**

---

### Verified Residual Risks & Testing Gaps

1. **Initial Mount Frame Without `src` Attribute:**
   In `UploadedClipView.tsx`, `src` is `undefined` on the initial DOM commit because `URL.createObjectURL` is invoked inside `useEffect` (which schedules a second render with the created URL). While this is the recommended React pattern for avoiding object URL leaks, any test or script evaluating `audio.src` synchronously on the mount tick before effect commit would observe an empty `src` (Playwright's auto-waiting and `waitForFunction` in `ac-07-upload.spec.ts` safely wait for media metadata).
2. **Remove Button Interaction During Replacement Validation:**
   While `isChecking` is `true`, the file input and checkbox are disabled; however, the "Remove" button in `UploadedClipView` is not disabled. If a user triggers a replacement upload and clicks "Remove" during duration probing, the old clip is cleared immediately and the new clip replaces it once validation resolves. In normal usage, client validation takes a few milliseconds, making this window minimal.
3. **Browser Audio Codec Variances:**
   Decoding of `.m4a` files relies on browser/OS support for AAC in MP4 containers (`canPlayType("audio/mp4")`), which is standard across modern target desktop browsers (Chrome, Edge, Firefox, Safari) but can vary in specialized headless Linux distributions missing proprietary media codecs. This is recognized in design decision 15.
