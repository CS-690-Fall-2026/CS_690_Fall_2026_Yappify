# Audio Recorder Module (`frontend/src/audio/recorder.ts`)

## Overview
Provides low-level functions and state types to record audio using the browser's MediaStream Recording API (`navigator.mediaDevices.getUserMedia` and `MediaRecorder`).

## Architecture & Interfaces

### Data Types
- `RecordingStatus`: `'idle' | 'recording' | 'completed' | 'error'`
- `RecordedClip`:
  - `audio`: `Blob` - recorded audio binary data.
  - `durationSeconds`: `number` - length of the audio recording in seconds.
  - `mimeType`: `string` - MIME type of the recorded clip (e.g., `audio/webm`).

### Errors
- `PermissionDeniedError`: Thrown when microphone permission is denied or dismissed.
- `RecordingStateError`: Thrown when an invalid transition occurs (e.g. calling `startRecording` when already recording, or `stopRecording` when idle).
- `RecordingDeviceError`: Thrown when the microphone device is unavailable or errors during recording.

### Functions
- `startRecording(): Promise<void>`:
  Requests microphone access, initializes `MediaRecorder`, and begins capturing audio chunks.
- `stopRecording(): Promise<RecordedClip>`:
  Stops `MediaRecorder`, cleans up media stream tracks, and resolves with a `RecordedClip`.
