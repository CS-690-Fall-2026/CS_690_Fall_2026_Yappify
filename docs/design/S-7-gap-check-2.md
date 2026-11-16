What "upload" means

1. Does anything get sent to the backend? UploadFailedError suggests a network call, but Decision 7 says clips are kept only in browser memory. Without a network call, when does UploadFailedError happen?
2. AGENTS.md says to prioritise persistence, but this doc says the clip is lost on page refresh. Which one wins for this feature?
3. Is any backend work in scope, such as an endpoint, a model, or pytest tests?
4. Should the user be logged in to upload?

Format detection

5. How is the format detected: by file extension, by the browser's File.type, or by reading the file's first bytes?
6. What happens when the extension and the content disagree, such as a WAV renamed to .mp3?
7. Which MIME strings count as each format? M4A shows up as audio/mp4, audio/x-m4a or audio/m4a depending on the browser and OS, and WAV as audio/wav, audio/x-wav or audio/wave.
8. What should the returned mimeType be: the browser's raw value or a normalised one?
9. Does "M4A" include every codec inside that container (AAC, ALAC)? Is an audio-only .mp4 file accepted?
10. If the browser can't play a supported format (for example, a codec the OS doesn't support), is that InvalidAudioError or UnsupportedFormatError?
11. If File.type is empty, which some OSes report, do we reject the file or check further?

Duration

12. How is duration measured: HTML audio element metadata or Web Audio decoding? VBR MP3s can give different answers.
13. Is there a tolerance at the limit? Is a file reporting 60.04 s accepted or rejected? Do we round?
14. Is a 0-second file valid? The doc says "nonnegative". Is there a minimum duration?
15. What if the duration comes back as Infinity or NaN, which some browsers report for certain files? Which error is that?

Limits not in the doc

16. Is there a file-size limit? A very large file could freeze the tab while it's decoded.
17. Can the user select several files at once?
18. How many unpublished clips can exist at a time? Does a new upload replace the previous one or add to a list?
19. Is there a timeout or loading state while the file is checked? Can the user cancel partway?

Errors

20. If a file fails several checks, which error wins? For example, an unsupported format that is also too long.
21. Are the errors Error subclasses? Where are they defined and exported? Do they need a code field?
22. What exact message does the user see for each error, and where is it shown?
23. Edge case 2 says "rejects" but, unlike 1 and 3, doesn't say "displays an error". Is that deliberate?
24. Is "the file can't be read" (the precondition) InvalidAudioError or UploadFailedError?
25. On cancel (edge case 4), is uploadAudio never called, or called and rejected? Does cancelling clear an earlier clip?

Copyright confirmation (Decision 6)

26. When does the user confirm: before choosing a file, after it's accepted, or before publishing?
27. What does the confirmation look like (checkbox, modal), and what is the exact wording?
28. It isn't in the uploadAudio signature or UploadResult. Is it enforced in the UI only? Is it recorded anywhere?
29. What happens if the user doesn't confirm? There is no error type for it.

Interface and data

30. Is UploadResult.audio the original File passed through, or a copy or re-encoded Blob?
31. Should the result include the original filename, a client-side ID, or a playback URL? Who creates and cleans up the object URLs?
32. Does status ever change from "unpublished"? If so, which component changes it?
33. Should this share a clip type, and the MAX_CLIP_DURATION constant, with the recording feature (S-1)?
34. "Configured" maximum and formats: where does that configuration live (a constants file, env, backend)?

UI and flow

35. Where does the upload control go: which page or route, and which component?
36. Is drag-and-drop expected, or only a file picker?
37. Should the picker's accept attribute filter to the supported formats? That only hides other files and doesn't replace validation.
38. What does an unpublished clip show: filename, duration, waveform, a "draft" label?
39. Can the user delete an unpublished clip?
40. How does an uploaded clip move into publishing (caption, tags)? Is the publish button part of this story?
41. What are the accessibility requirements for the control, the errors and the player?
42. Which browsers must this work in?

Process and tests

43. Decisions 4–7 are "pending team confirmation". Do I build with the provisional values now or wait?
44. The test name test_ac7_valid_audio_upload_displays_playback is pytest style, but this is a frontend feature tested with Playwright. Which suite does it belong in, and what should it be called?
45. Only the success case has an acceptance test. Should the four edge cases get tests too, and what counts as passing for each?
46. Where do test audio files come from (valid MP3/WAV/M4A, over 60 s, corrupted, wrong format)? Can I commit them to the repo, and how big can they be?
47. How should the test prove the clip is "playable": a player control exists, it has a duration, or it actually plays?






## Gap Classification

The following classifications are based on the updated S-7 design document. Proposed decisions are still pending team confirmation.

### Upload Behavior

Q1 — Real Gap
The document does not clearly establish whether uploading involves a backend request or only local browser processing. Section 8 needs to clarify this.

Q2 — Real Gap
Section 8 proposes temporary browser storage, but this may conflict with AGENTS.md's persistence instructions. The team needs to resolve this conflict.

Q3 — Real Gap
The design does not explicitly state whether backend endpoints, models, or backend tests are required.

Q4 — Real Gap
The document does not specify whether authentication is required before uploading.

### Format Detection

Q5 — Real Gap
Section 5 lists supported formats but does not explain how the application identifies them.

Q6 — Real Gap
The document does not define how mismatches between file extensions and actual file contents are handled.

Q7 — Real Gap
The supported MIME types for MP3, WAV, and M4A are not specified.

Q8 — Real Gap
Section 5 defines mimeType as a string but does not specify whether it is normalized.

Q9 — Real Gap
The accepted codecs and containers for M4A and MP4 files are not clearly defined.

Q10 — Real Gap
The document does not specify which error occurs when a browser cannot decode a supported format.

Q11 — Real Gap
The document does not explain what happens when File.type is empty.

### Duration

Q12 — Real Gap
Section 5 defines durationSeconds but does not specify how duration is measured.

Q13 — Real Gap
The document does not state whether duration values are rounded or whether a tolerance is allowed at the 60-second limit.

Q14 — Real Gap
Section 5 permits nonnegative duration, but it is unclear whether zero-second audio should be accepted.

Q15 — Real Gap
The document does not explain how invalid duration values such as NaN or Infinity are handled.

### Additional Limits

Q16 — Real Gap
No maximum file size is specified.

Q17 — Real Gap
The document does not explicitly limit users to selecting one file at a time.

Q18 — Real Gap
The number of unpublished clips a user can hold is not defined.

Q19 — Real Gap
Loading behavior, validation cancellation, and timeouts are not defined.

### Error Handling

Q20 — Real Gap
The document lists errors but does not define which error takes priority when multiple conditions fail.

Q21 — Real Gap
Section 4 names possible errors but does not define their TypeScript implementation or exported structure.

Q22 — Real Gap
The exact user-facing error messages and their location in the interface are not specified.

Q23 — Real Gap
Section 7 states that files exceeding the duration limit are rejected but does not explicitly require displaying an error.

Q24 — Real Gap
The document does not clearly distinguish an unreadable file from a failed upload.

Q25 — Real Gap (Partially Answered)
Section 7, Edge Case 4 states that canceling file selection creates no new clip. However, it does not specify whether uploadAudio is called or whether an existing clip remains visible.

### Copyright Confirmation

Q26 — Real Gap
Section 8 requires copyright confirmation but does not specify when the user provides it.

Q27 — Real Gap
The confirmation interface and exact wording are not defined.

Q28 — Real Gap
The document does not explain how confirmation is enforced or whether it is recorded.

Q29 — Real Gap
The behavior when a user declines copyright confirmation is not specified.

### Interface and Data

Q30 — Real Gap
Section 4 defines UploadResult.audio as a Blob but does not specify whether it contains the original file or transformed audio.

Q31 — Real Gap
The document does not define whether filenames, IDs, or playback URLs are returned or how object URLs are managed.

Q32 — Already Answered (Partially)
Section 4 defines status as "unpublished", and Section 3 excludes publishing from S-7. Any later status changes belong to a separate publishing feature.

Q33 — Real Gap
The document does not specify whether S-7 shares types or configuration constants with S-1.

Q34 — Real Gap
The document does not identify where supported formats and duration settings are defined.

### User Interface

Q35 — Real Gap
The document does not identify the page or component containing the upload control.

Q36 — Real Gap (Partially Answered)
Section 2 requires selecting a file from the device, but it does not explicitly state whether drag-and-drop is supported.

Q37 — Real Gap
The document does not specify whether the file picker uses an accept attribute.

Q38 — Real Gap
The document requires playable audio but does not specify what additional information is displayed.

Q39 — Real Gap
The document does not define whether users can delete an unpublished upload.

Q40 — Already Answered (Partially)
Section 3 excludes automatic publishing, and Section 8 establishes uploading and publishing as separate actions. The future publishing workflow remains outside S-7.

Q41 — Real Gap
Accessibility requirements for file selection, errors, and playback are not defined.

Q42 — Real Gap
The supported browsers are not specified.

### Process and Testing

Q43 — Real Gap
Section 8 identifies decisions 4–7 as provisional. Team confirmation is required before treating them as final implementation requirements.

Q44 — Already Answered
Section 9 identifies the test as test_ac7_valid_audio_upload_displays_playback. The existing test belongs to the Playwright frontend suite at frontend/tests/ac-07-upload.spec.ts.

Q45 — Real Gap
Section 7 identifies four edge cases, but the design does not define their corresponding automated tests or exact expected results.

Q46 — Real Gap
The document does not define the source, location, or size limits for test audio fixtures.

Q47 — Real Gap
Section 9 requires playable audio but does not define how automated tests will verify playback.

## Summary

Total questions reviewed: 47

Already Answered or Partially Answered:
- Q32
- Q40
- Q44

All other questions contain at least one unresolved implementation detail.

The real gaps must be addressed in Section 8 of docs/design/S-7.md. Related questions may be resolved through shared decisions rather than creating a separate decision for every question.

The proposed decisions regarding supported formats, maximum duration, copyright confirmation, and temporary storage are pending team confirmation. They should not be treated as finalized requirements until approved.
