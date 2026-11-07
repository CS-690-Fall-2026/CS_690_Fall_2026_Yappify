Claude Sonnet 5.5


The spec explicitly blocks work on three questions, and there are further gaps I’d have to guess at. I haven’t answered any of them.

Blocking questions (the spec says stop and ask)

Which formats belong in SUPPORTED_AUDIO_FORMATS? Validation, the file picker’s accept filter, and the AC-7 test fixtures all depend on this.
What is the value of MAX_CLIP_DURATION? Duration validation, the DurationLimitError threshold, and the boundary tests depend on it.
What licensing requirements apply to copyrighted or protected audio? This could add consent checkboxes, attestations, content detection, or terms acceptance to the upload flow.

Questions the spec leaves unresolved

Format and validation
4. How is the format detected: file extension, the browser-reported File.type, or the file’s actual bytes? What happens if they disagree, such as an .mp3 that is really a WAV, or an empty MIME type?
5. If a file is in a permitted format but cannot be decoded, which error applies: InvalidAudioError or UnsupportedFormatError? What about a supported container holding an unsupported codec?
6. Which error applies if a file is both too long and corrupt, or both unsupported and too long? Is there an order of checks?
7. Is the duration limit inclusive? The invariant says “less than or equal,” but is it measured to the sample, rounded, or truncated?
8. How do we get duration for files whose headers lack it or report it wrongly (e.g. some VBR MP3s, streamed WebM)? Do we decode the full file, and is that acceptable for performance?
9. Is there a maximum file size, separate from duration? The spec mentions none, but a short clip can still be a huge lossless file.
10. What about zero-length audio, or audio with no audio track (e.g. a video file)? Is a zero-second clip valid, given durationSeconds is only “nonnegative”?
11. Are video files with audio tracks accepted or rejected?

The interface
12. What does uploadAudio mean? The signature suggests local validation and wrapping into a Blob, but the name and UploadFailedError imply sending data to a server. Is there a backend, an endpoint, authentication, or storage? Or is “upload” purely client-side for now?
13. If there is a server, who owns server-side validation, and what are the retry, timeout, and progress-reporting expectations?
14. Is audio: Blob the original file bytes, or re-encoded data? (Non-goals rule out conversion, but this is not stated.)
15. What exactly triggers UploadFailedError, and can the user retry?
16. How is mimeType “detected,” and what is its canonical form (e.g. audio/mpeg vs audio/mp3)?
17. Is the function expected to report cancellation? Edge case 4 says no clip is created, but the function takes a File, so the picker lives elsewhere. Which component owns the picker, and is cancellation just a no-op?

UI and behavior
18. Where does the upload entry point live in the app, and what does it look like?
19. What exact error messages should users see for each of the four errors? Is the wording specified, localized, or accessible (screen reader announcements)?
20. What does “playable, unpublished clip” look like? Which player controls are required (play/pause, seek, duration display), and what visual cue marks “unpublished”?
21. Where does the accepted clip appear, in a list or a draft area, and does it persist across reloads or sessions? If so, where is it stored?
22. How do we handle multiple files selected at once, or repeated uploads? Is there a cap on clips per user?
23. Can the user delete or replace an uploaded unpublished clip? The spec says no editing or trimming but is silent on removal.
24. Does the user see a clip title, filename, or metadata, and is any metadata (ID3 tags, filename) read, stored, or stripped?
25. How does uploaded audio differ from recorded audio downstream, e.g. in the publishing flow? Do they share the same data model?

Cross-cutting
26. Which browsers and platforms must be supported? Format support in decodeAudioData and <audio> differs across them, and mobile file pickers behave differently.
27. Are there accessibility, privacy, or security requirements, such as malware scanning or content moderation, beyond the licensing question?
28. What is the testing scope for AC-7? Do we need tests for the four errors and four edge cases, or only the single named acceptance test? Who supplies the fixture files?
29. The spec cites Evidence E-8 and E-16 and Assumption A-4, but they are not included. Is A-4 (users want to upload short clips) validated, and what does “short” mean given that it ties to the unresolved duration limit?