import React, { useState, useRef, useEffect } from "react";
import {
  startRecording,
  stopRecording,
  RecordingStatus,
  RecordedClip,
} from "../audio/recorder";

/**
 * AudioRecorder Component
 *
 * Implements AC-01 (Story S-1):
 * Provides Record, Stop, and Playback controls for capturing audio clips.
 */
export const AudioRecorder: React.FC = () => {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [clip, setClip] = useState<RecordedClip | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleRecord = async () => {
    try {
      setErrorMessage(null);
      await startRecording();
      setStatus("recording");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to record.");
    }
  };

  const handleStop = async () => {
    try {
      const recordedClip = await stopRecording();
      const url = URL.createObjectURL(recordedClip.audio);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setClip(recordedClip);
      setAudioUrl(url);
      setStatus("completed");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to stop recording.");
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="audio-recorder-container">
      <h2>Record an Audio Clip</h2>

      <div className="controls">
        <button
          type="button"
          onClick={handleRecord}
          disabled={status === "recording"}
        >
          Record
        </button>

        <button
          type="button"
          onClick={handleStop}
          disabled={status !== "recording"}
        >
          Stop
        </button>
      </div>

      {status === "recording" && <p className="status-indicator">Recording in progress...</p>}
      {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}

      {status === "completed" && audioUrl && (
        <div className="playback-section">
          <h3>Playback</h3>
          <button type="button" onClick={handlePlay}>
            Play
          </button>
          <audio ref={audioRef} src={audioUrl} controls />
          {clip && (
            <p>Duration: {clip.durationSeconds.toFixed(1)}s</p>
          )}
        </div>
      )}
    </div>
  );
};
