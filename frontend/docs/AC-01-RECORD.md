# Frontend Technical Documentation — S-1 / AC-01 Audio Recording

## Architecture & Overview
This documentation describes the client-side implementation of **Story S-1 / Acceptance Criterion AC-01** (Record an Audio Clip).

### Components & Modules

1. **[`recorder.ts`](file:///home/ben/code/CS%20690/CS_690_Fall_2026_Yappify/frontend/src/audio/recorder.ts)**:
   - Low-level recording abstraction built upon the Web Streams and MediaStream Recording API (`navigator.mediaDevices.getUserMedia` & `MediaRecorder`).
   - Exports the following types:
     - `RecordingStatus`: `'idle' | 'recording' | 'completed' | 'error'`
     - `RecordedClip`: `{ audio: Blob; durationSeconds: number; mimeType: string; }`
   - Custom errors:
     - `PermissionDeniedError`: Thrown when microphone permission is denied or dismissed.
     - `RecordingStateError`: Thrown when state operations are attempted out of sequence (e.g. starting when already recording, stopping when idle).
     - `RecordingDeviceError`: Thrown when media devices or recording channels fail.
   - Core functions:
     - `startRecording(): Promise<void>`: Requests microphone permissions, creates and starts `MediaRecorder`, and listens for data chunks.
     - `stopRecording(): Promise<RecordedClip>`: Stops recording, resolves with an audio `Blob`, records duration, and releases the media tracks.

2. **[`AudioRecorder.tsx`](file:///home/ben/code/CS%20690/CS_690_Fall_2026_Yappify/frontend/src/components/AudioRecorder.tsx)**:
   - React component providing:
     - Record button (accessible via name `/^record/i`).
     - Stop button (accessible via name `/^stop/i`, disabled when not recording).
     - Completed playback controls: Play button (accessible via name `/play/i`) and an `<audio>` element with `src` set to a `blob:` URL.

3. **[`AudioRecorderVanilla.ts`](file:///home/ben/code/CS%20690/CS_690_Fall_2026_Yappify/frontend/src/components/AudioRecorderVanilla.ts)**:
   - Lightweight DOM implementation mirroring `AudioRecorder.tsx` without external framework dependencies for fast runtime execution in local environments.

4. **[`App.tsx`](file:///home/ben/code/CS%20690/CS_690_Fall_2026_Yappify/frontend/src/App.tsx) & [`main.ts`](file:///home/ben/code/CS%20690/CS_690_Fall_2026_Yappify/frontend/src/main.ts)**:
   - Entry points mounting the audio recording interface onto `#root`.

5. **[`dev-server.mjs`](file:///home/ben/code/CS%20690/CS_690_Fall_2026_Yappify/frontend/dev-server.mjs)**:
   - Built-in static/SPA development server running on `http://localhost:5173`.
