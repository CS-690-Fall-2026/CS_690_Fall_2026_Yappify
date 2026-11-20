// S-7 upload validation (docs/design/S-7.md decisions 3, 9, 10, 12, 13, 14;
// docs/plans/S-7-plan.md "Validation (uploadAudio)").
//
// Frontend-only: the file is validated in the browser and nothing is sent to a
// network (decision 8). The first failing check determines the error.

import {
  MAX_CLIP_DURATION,
  MAX_UPLOAD_BYTES,
  METADATA_TIMEOUT_MS,
  SUPPORTED_AUDIO_FORMATS,
  type NormalizedMimeType,
  type SupportedFormat,
} from "./constants";
import type { RecordedClip } from "./recorder";

/** An accepted upload: the original File, its measured duration and normalized MIME type (decision 14). */
export type UploadResult = RecordedClip & {
  mimeType: NormalizedMimeType;
  status: "unpublished";
};

export interface UploadOptions {
  /** Whether the user checked the ownership/permission confirmation (decision 13). */
  ownershipConfirmed: boolean;
}

/** Base class for every upload error. `message` is the user-facing text. */
export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

export class OwnershipNotConfirmedError extends UploadError {
  constructor(message = "Please confirm that you own this audio or have permission to upload it.") {
    super(message);
    this.name = "OwnershipNotConfirmedError";
  }
}

export class UnsupportedFormatError extends UploadError {
  constructor(message = "Unsupported audio format. Please select MP3, WAV, or M4A.") {
    super(message);
    this.name = "UnsupportedFormatError";
  }
}

export class FileSizeLimitError extends UploadError {
  constructor(message = "Audio files must be 20 MB or smaller.") {
    super(message);
    this.name = "FileSizeLimitError";
  }
}

export class InvalidAudioError extends UploadError {
  constructor(message = "This audio file could not be played or is invalid.") {
    super(message);
    this.name = "InvalidAudioError";
  }
}

export class DurationLimitError extends UploadError {
  constructor(message = "Audio clips must be 60 seconds or shorter.") {
    super(message);
    this.name = "DurationLimitError";
  }
}

export class UploadFailedError extends UploadError {
  constructor(message = "The audio file could not be loaded. Please try again.") {
    super(message);
    this.name = "UploadFailedError";
  }
}

/** Finds the supported format for a file name by its lower-cased extension, or null. */
function formatForFileName(fileName: string): SupportedFormat | null {
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) return null;
  const extension = fileName.slice(dot).toLowerCase();
  for (const format of Object.keys(SUPPORTED_AUDIO_FORMATS) as SupportedFormat[]) {
    const extensions: readonly string[] = SUPPORTED_AUDIO_FORMATS[format].extensions;
    if (extensions.includes(extension)) return format;
  }
  return null;
}

/**
 * Loads only the audio metadata through a detached `<audio>` element and
 * resolves with the reported duration. Rejects with InvalidAudioError on a
 * decode error or after METADATA_TIMEOUT_MS. The temporary object URL, the
 * listeners and the timer are always cleaned up.
 */
function readDuration(file: File): Promise<number> {
  const url = URL.createObjectURL(file);
  const probe = new Audio();
  probe.preload = "metadata";

  let timer: ReturnType<typeof setTimeout> | undefined;
  let onLoaded: (() => void) | undefined;
  let onError: (() => void) | undefined;

  const loaded = new Promise<number>((resolve, reject) => {
    onLoaded = () => resolve(probe.duration);
    onError = () => reject(new InvalidAudioError());
    timer = setTimeout(() => reject(new InvalidAudioError()), METADATA_TIMEOUT_MS);
    probe.addEventListener("loadedmetadata", onLoaded);
    probe.addEventListener("error", onError);
    probe.src = url;
  });

  return loaded.finally(() => {
    clearTimeout(timer);
    if (onLoaded) probe.removeEventListener("loadedmetadata", onLoaded);
    if (onError) probe.removeEventListener("error", onError);
    // Detach the source so the element stops loading, then release the URL.
    probe.removeAttribute("src");
    probe.load();
    URL.revokeObjectURL(url);
  });
}

/**
 * Validates a selected audio file and returns it as an unpublished clip.
 *
 * Order (plan "Validation"; decision 12, with decision 13's confirmation first):
 * 0. ownership confirmed, 1. format, 2. size, 3. readable,
 * 4. decodable (metadata loads), 5. duration.
 */
export async function uploadAudio(file: File, options: UploadOptions): Promise<UploadResult> {
  // 0. Ownership confirmation (decision 13), before the file is read.
  if (!options.ownershipConfirmed) {
    throw new OwnershipNotConfirmedError();
  }

  // 1. Format (decision 9): extension first, then a non-empty MIME type must match it.
  const format = formatForFileName(file.name);
  if (format === null) {
    throw new UnsupportedFormatError();
  }
  const spec = SUPPORTED_AUDIO_FORMATS[format];
  const mimeTypes: readonly string[] = spec.mimeTypes;
  if (file.type !== "" && !mimeTypes.includes(file.type.toLowerCase())) {
    throw new UnsupportedFormatError();
  }

  // 2. Size (decision 11).
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new FileSizeLimitError();
  }

  // 3. Readability (decision 12): an unreadable file is a load failure, not invalid audio.
  try {
    await file.slice(0, 1).arrayBuffer();
  } catch {
    throw new UploadFailedError();
  }

  // 4. Decode (decisions 9, 10): the browser must support the codec and load the metadata.
  if (new Audio().canPlayType(spec.normalized) === "") {
    throw new InvalidAudioError();
  }
  const durationSeconds = await readDuration(file);

  // 5. Duration (decision 10): compared unrounded, so 60.04 s is rejected.
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new InvalidAudioError();
  }
  if (durationSeconds > MAX_CLIP_DURATION) {
    throw new DurationLimitError();
  }

  // 6. Accepted: keep the original File unmodified (decision 14).
  return {
    audio: file,
    durationSeconds,
    mimeType: spec.normalized,
    status: "unpublished",
  };
}
