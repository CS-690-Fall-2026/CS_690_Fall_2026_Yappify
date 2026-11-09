export type RecordingStatus = "idle" | "recording" | "completed" | "error";

export interface RecordedClip {
  audio: Blob;
  durationSeconds: number;
  mimeType: string;
}

export class PermissionDeniedError extends Error {
  constructor(message = "Microphone access is denied.") {
    super(message);
    this.name = "PermissionDeniedError";
  }
}

export class RecordingStateError extends Error {
  constructor(message = "Recording operation is invalid for the current state.") {
    super(message);
    this.name = "RecordingStateError";
  }
}

export class RecordingDeviceError extends Error {
  constructor(message = "Microphone is unavailable or recording fails.") {
    super(message);
    this.name = "RecordingDeviceError";
  }
}

let activeStream: MediaStream | null = null;
let activeRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let recordingStartTime = 0;

/**
 * Starts an audio recording session using the user's microphone.
 *
 * @throws {RecordingStateError} If a recording session is already active.
 * @throws {PermissionDeniedError} If microphone permission was denied.
 * @throws {RecordingDeviceError} If the microphone device failed or is unavailable.
 */
export async function startRecording(): Promise<void> {
  if (activeRecorder && activeRecorder.state === "recording") {
    throw new RecordingStateError("Recording is already in progress.");
  }

  try {
    activeStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err: unknown) {
    if (
      err instanceof DOMException &&
      (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
    ) {
      throw new PermissionDeniedError();
    }
    throw new RecordingDeviceError(
      err instanceof Error ? err.message : "Failed to access audio device.",
    );
  }

  audioChunks = [];
  try {
    activeRecorder = new MediaRecorder(activeStream);
  } catch (err: unknown) {
    activeStream.getTracks().forEach((track) => track.stop());
    activeStream = null;
    throw new RecordingDeviceError(
      err instanceof Error ? err.message : "MediaRecorder initialization failed.",
    );
  }

  activeRecorder.ondataavailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  recordingStartTime = Date.now();
  activeRecorder.start();
}

/**
 * Stops the current active recording session and returns the recorded clip.
 *
 * @throws {RecordingStateError} If there is no active recording session to stop.
 */
export async function stopRecording(): Promise<RecordedClip> {
  if (!activeRecorder || activeRecorder.state !== "recording") {
    throw new RecordingStateError("No active recording to stop.");
  }

  return new Promise((resolve, reject) => {
    const recorder = activeRecorder!;
    const stream = activeStream;

    recorder.onstop = () => {
      const durationSeconds = Math.max(0, (Date.now() - recordingStartTime) / 1000);
      const mimeType = recorder.mimeType || "audio/webm";
      const audioBlob = new Blob(audioChunks, { type: mimeType });

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      activeStream = null;
      activeRecorder = null;
      audioChunks = [];

      resolve({
        audio: audioBlob,
        durationSeconds,
        mimeType,
      });
    };

    recorder.onerror = (event: Event) => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      activeStream = null;
      activeRecorder = null;
      audioChunks = [];
      reject(new RecordingDeviceError("An error occurred during recording."));
    };

    recorder.stop();
  });
}
