import {
  startRecording,
  stopRecording,
  RecordingStatus,
  RecordedClip,
} from "../audio/recorder";

export class AudioRecorderUI {
  private container: HTMLElement;
  private status: RecordingStatus = "idle";
  private clip: RecordedClip | null = null;
  private audioUrl: string | null = null;
  private errorMessage: string | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private setStatus(status: RecordingStatus) {
    this.status = status;
    this.render();
  }

  private async handleRecord() {
    try {
      this.errorMessage = null;
      await startRecording();
      this.setStatus("recording");
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : "Failed to record.";
      this.setStatus("error");
    }
  }

  private async handleStop() {
    try {
      const clip = await stopRecording();
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl);
      }
      this.clip = clip;
      this.audioUrl = URL.createObjectURL(clip.audio);
      this.setStatus("completed");
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : "Failed to stop recording.";
      this.setStatus("error");
    }
  }

  private handlePlay() {
    const audioEl = this.container.querySelector("audio");
    if (audioEl) {
      audioEl.play();
    }
  }

  public render() {
    this.container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Record an Audio Clip";
    this.container.appendChild(title);

    const controls = document.createElement("div");
    controls.className = "controls";

    const recordBtn = document.createElement("button");
    recordBtn.type = "button";
    recordBtn.textContent = "Record";
    recordBtn.disabled = this.status === "recording";
    recordBtn.onclick = () => this.handleRecord();
    controls.appendChild(recordBtn);

    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.textContent = "Stop";
    stopBtn.disabled = this.status !== "recording";
    stopBtn.onclick = () => this.handleStop();
    controls.appendChild(stopBtn);

    this.container.appendChild(controls);

    if (this.status === "recording") {
      const indicator = document.createElement("p");
      indicator.textContent = "Recording in progress...";
      this.container.appendChild(indicator);
    }

    if (this.errorMessage) {
      const errEl = document.createElement("p");
      errEl.setAttribute("role", "alert");
      errEl.textContent = this.errorMessage;
      this.container.appendChild(errEl);
    }

    if (this.status === "completed" && this.audioUrl) {
      const playbackSection = document.createElement("div");
      playbackSection.className = "playback-section";

      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.textContent = "Play";
      playBtn.onclick = () => this.handlePlay();
      playbackSection.appendChild(playBtn);

      const audio = document.createElement("audio");
      audio.src = this.audioUrl;
      audio.controls = true;
      playbackSection.appendChild(audio);

      if (this.clip) {
        const duration = document.createElement("p");
        duration.textContent = `Duration: ${this.clip.durationSeconds.toFixed(1)}s`;
        playbackSection.appendChild(duration);
      }

      this.container.appendChild(playbackSection);
    }
  }
}
