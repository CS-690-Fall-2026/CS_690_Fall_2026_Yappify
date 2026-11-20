// S-7 upload configuration (docs/design/S-7.md decisions 4, 5, 9, 11, 14).

/** Supported upload formats, their accepted MIME variants, and the normalized MIME type. */
export const SUPPORTED_AUDIO_FORMATS = {
  mp3: { extensions: [".mp3"], mimeTypes: ["audio/mpeg", "audio/mp3"], normalized: "audio/mpeg" },
  wav: { extensions: [".wav"], mimeTypes: ["audio/wav", "audio/x-wav", "audio/wave"], normalized: "audio/wav" },
  m4a: { extensions: [".m4a"], mimeTypes: ["audio/mp4", "audio/x-m4a", "audio/m4a"], normalized: "audio/mp4" },
} as const;

export type SupportedFormat = keyof typeof SUPPORTED_AUDIO_FORMATS;
export type NormalizedMimeType = (typeof SUPPORTED_AUDIO_FORMATS)[SupportedFormat]["normalized"];

/** Maximum clip duration in seconds (decision 5). */
export const MAX_CLIP_DURATION = 60;

/** Maximum upload size in bytes: 20 MB (decision 11). */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

/** `accept` attribute for the file picker (decision 15). The app still validates every file. */
export const UPLOAD_ACCEPT = ".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a";

/** How long to wait for audio metadata before treating the file as invalid: 10 s. */
export const METADATA_TIMEOUT_MS = 10_000;
