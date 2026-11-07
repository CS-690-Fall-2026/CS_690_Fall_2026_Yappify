Claude Sonnet 5.5

The spec blocks work on two questions, and there are further gaps I’d have to guess at. I haven’t answered any of them.

Blocking questions (the spec says stop and ask)

What is the maximum recording duration? An auto-stop timer, a countdown or limit indicator in the UI, the behavior at the limit, and any boundary tests all depend on this.
Should an interrupted recording be recoverable or discarded? Edge case 3 and the RecordingDeviceError path depend on this: whether partial audio is buffered, whether a partial RecordedClip is ever surfaced, and what the user sees afterward.

Questions the spec leaves unresolved

State machine and interface
3. What are the legal transitions between idle, recording, completed, and error? Specifically, what happens when startRecording() is called from completed or error? Does the previous clip get discarded, kept, or block the new recording?
4. Does stopRecording() called from idle, completed, or error throw RecordingStateError? The precondition says stop is permitted only while recording, but the throwing behavior isn’t stated.
5. Edge case 2 says pressing Record while recording creates no second session. Does it throw RecordingStateError, silently no-op, or disable the button? Is the button disabled in that state?
6. How do status, error, and the clip data (section 5) relate to the two functions? They are listed as data, but the interface only exposes two functions. Is there a store, hook, or component state, and who owns it?
7. When status is "error", what happens to the error message and the state afterward? Does it reset to idle, and can the user retry?
8. Which error applies in overlapping cases? For example, permission revoked mid-recording, the device unplugged at start, or getUserMedia failing for reasons other than permission (no device, in use by another app, insecure context).
9. How is the durationSeconds measured: wall-clock between start and stop, media timestamps, or decoded length? Does it include paused or interrupted time? A MediaRecorder blob often lacks duration metadata, so which source is authoritative?
10. What if the recording is zero seconds, such as an immediate Record then Stop? Is that valid, rejected, or given a minimum length?

Permissions and device
11. When is microphone permission requested: on screen load or on first Record press? The precondition says recording begins only when access is granted, but AC-1 assumes it’s already granted.
12. What if permission was previously denied and the browser won’t re-prompt? Should the UI explain how to re-enable it?
13. Which microphone is used when several exist? Is a device selector in scope? What happens if the default device changes mid-recording?
14. Should the microphone stream be released immediately on stop, error, and unmount? Is the browser recording indicator expected to disappear?

Format and audio
15. Which MIME type and codec should be recorded (audio/webm, audio/ogg, audio/mp4)? Browsers differ, so is a fallback chain acceptable, and must the result match anything the publishing flow or S-7’s SUPPORTED_AUDIO_FORMATS will accept?
16. Are there audio quality requirements (sample rate, bitrate, mono vs. stereo, noise suppression, echo cancellation, auto gain)?
17. Is there a maximum file size or memory limit, separate from duration?

UI and behavior
18. What does the recording screen look like, and where does it live in the app? What are the Record and Stop controls, and is there a live indicator such as elapsed time, a level meter, or a pulsing dot?
19. What exact error messages should users see for each of the three errors? Is the wording specified, localized, or announced to screen readers?
20. What playback controls are required on the completed recording (play/pause, seek, duration display)? Is it a native <audio controls> element or a custom player?
21. Is there a way to discard or re-record a completed clip? The spec rules out editing and trimming and is silent on deletion.
22. Does the completed recording persist across navigation, reloads, or sessions, and where is it stored? Or is it lost when the user leaves the screen?
23. What happens if the user navigates away, switches tabs, locks the phone, or backgrounds the app mid-recording? Does recording continue, stop, or get discarded? Mobile browsers often suspend audio capture in the background, and this overlaps with the interruption question above.
24. Is Stop’s return value or the stored clip used by anything downstream? How does a recorded clip relate to S-7’s uploaded clip (shared data model, shared status field, shared list)?

Cross-cutting
25. Which browsers and platforms must be supported? MediaRecorder and getUserMedia support and output formats vary, and iOS Safari behaves differently from Chrome.
26. Are there privacy, security, or consent requirements beyond browser permission, such as a recording notice, or retention and upload rules?
27. What is the testing scope? Do we need tests for each error and each edge case, or only test_ac1_record_and_stop_displays_playback? How should the microphone be mocked, and who supplies fixtures?
28. The spec cites interview evidence E-12 and E-13, but it isn’t included. Are there other user contexts (hands-free, walking, noisy environments) that should influence requirements, such as screen-off recording or large touch targets?



