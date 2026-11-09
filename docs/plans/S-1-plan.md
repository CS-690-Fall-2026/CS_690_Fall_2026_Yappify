
# S-1 — Record an Audio Clip: Implementation Plan

## 1. How

This plan covers the implementation of S-1, allowing users to record an audio clip directly in Yappify. The implementation will follow AC-1 from docs/design/S-1.md.

### Files to Create or Modify

The following paths are proposed and must be verified against the repository before implementation.

- frontend/src/audio/recorder.ts
  - Create the recording logic, data types, and errors.

- frontend/src/components/AudioRecorder.tsx
  - Create the Record and Stop buttons, recording status, error display, and playback control.

- frontend/src/App.tsx
  - Modify the application to display the recording interface, if this is the correct entry point.

- frontend/tests/s1-record-audio.spec.ts
  - Create the Playwright acceptance test for AC-1.

No backend files, dependencies, or unrelated application features will be modified.

### Data Storage

- MediaRecorder will collect audio data in memory while recording.
- Stopping the recording will combine the audio into a Blob.
- The completed recording will contain the audio data, duration, and MIME type.
- React component state will hold the completed recording for playback.
- A browser object URL will allow the user to play the recording.
- Persistent storage is not included in this initial plan and requires confirmation before implementation.

## 2. Numbered Implementation Tasks

1. **[AC-1] Verify Repository Structure**
   Inspect the frontend folder and confirm the exact file paths and existing components before making changes.

2. **[AC-1] Write Acceptance Test**
   Create the Playwright test for AC-1 before implementing the feature. Verify that pressing Record and then Stop displays a completed recording with a playback control.

3. **[AC-1] Define Recording Types and Errors**
   Define RecordingStatus, RecordedClip, and the recording error types described in S-1.md.

4. **[AC-1] Implement Start Recording**
   Implement startRecording() to request microphone access, start recording, and prevent multiple active sessions.

5. **[AC-1] Implement Stop Recording**
   Implement stopRecording() to stop the active recording, produce the audio Blob, and return the completed clip.

6. **[AC-1] Create Recording Interface**
   Add Record and Stop buttons and display the current recording status.

7. **[AC-1] Display Completed Recording**
   Display the completed recording with an audio playback control.

8. **[AC-1] Handle Recording Errors**
   Handle microphone permission denial and recording failures within the approved scope.

9. **[AC-1] Run Tests and Review Changes**
   Run the Playwright acceptance test, inspect the Git diff, and check the recording workflow against AC-1.

## 3. Unresolved Questions

The following decisions require confirmation before implementing behavior that depends on them:

1. What maximum recording duration should Yappify support?
2. Should interrupted recordings be recovered or discarded?
3. Should recordings persist after the page reloads?
4. Which recording format and MIME type should be supported?
5. Which browsers and devices must support recording?
6. Where should the recording screen be mounted in the existing application?
7. How should recording duration be measured?
8. What should happen when a user starts another recording after completing one?

Do not implement functionality that depends on unresolved decisions. Stop and ask for clarification.

## 4. Scope Restrictions

The following features are not part of S-1:

- Audio transcription.
- Audio trimming or editing.
- Publishing or sharing recordings.
- Uploading existing audio files (S-7).

## 5. Verification

Acceptance Criterion: AC-1

Given the user has granted microphone permission and is on the recording screen,
When the user presses Record and then Stop,
Then Yappify displays a completed recording with an available playback control.

Planned test:
test_ac1_record_and_stop_displays_playback

Test command:
cd frontend && npx playwright test

The test must pass after S-1 is implemented.
