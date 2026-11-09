# AudioRecorder Component (`frontend/src/components/AudioRecorder.tsx`)

## Overview
A React UI component implementing Story S-1 / AC-01.

## UI Elements & Behavior
- **Record Button**:
  - Starts the microphone recording session via `startRecording()`.
  - Disabled during active recording.
- **Stop Button**:
  - Stops the recording session via `stopRecording()`.
  - Enabled only while recording is active.
- **Playback Controls**:
  - Rendered when status changes to `"completed"`.
  - Includes a `Play` button that triggers playback on the internal `<audio>` element.
  - An `<audio>` element with `src` set to a `blob:` URL created via `URL.createObjectURL(recordedClip.audio)`.
  - Cleans up object URLs on unmount or subsequent recordings.
- **Error Display**:
  - Displays any error encountered during microphone access or recording.
