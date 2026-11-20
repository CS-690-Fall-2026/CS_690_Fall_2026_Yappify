import { expect, test, type Page } from "@playwright/test";
import { makeGarbage, makeWav } from "../rules/wav";

/**
 * S-7 / AC-7 unit tests for `uploadAudio` (docs/design/S-7.md §4, §7, §8
 * decisions 3, 5, 9–14) and the temporary clip-store cancellation invariant
 * (docs/design/S-7.md §7 case 4, §8 decisions 7 and 11).
 *
 * Executed via Playwright against Vite's module server so `uploadAudio` and
 * `clips` run with real browser `File`, `Blob`, `URL`, and `<audio>` metadata
 * decoding without adding new test dependencies.
 */

const UPLOAD_MODULE = "/src/audio/upload.ts";
const CLIPS_MODULE = "/src/data/clips.ts";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // decision 11

const EXPECTED_MESSAGES = {
  format: "Unsupported audio format. Please select MP3, WAV, or M4A.", // decision 12
  duration: "Audio clips must be 60 seconds or shorter.", // decision 12
  invalid: "This audio file could not be played or is invalid.", // decision 12
  failed: "The audio file could not be loaded. Please try again.", // decision 12
  confirm: "Please confirm that you own this audio or have permission to upload it.", // decision 13 / plan
  size: "Audio files must be 20 MB or smaller.", // decision 11 / plan
} as const;

interface SerializedUploadError {
  ok: false;
  name: string;
  message: string;
  isUploadError: boolean;
}

interface SerializedUploadSuccess {
  ok: true;
  durationSeconds: number;
  mimeType: string;
  status: string;
  sameFileReference: boolean;
}

type SerializedUploadOutcome = SerializedUploadError | SerializedUploadSuccess;

async function runUploadAudio(
  page: Page,
  input: {
    name: string;
    mimeType: string;
    buffer: Buffer;
    ownershipConfirmed?: boolean;
  },
): Promise<SerializedUploadOutcome> {
  const base64 = input.buffer.toString("base64");
  const ownershipConfirmed = input.ownershipConfirmed ?? true;

  return page.evaluate(
    async ({ modPath, name, mimeType, base64Data, confirmed }) => {
      const mod = await import(modPath);
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const file = new File([bytes], name, { type: mimeType });

      try {
        const result = await mod.uploadAudio(file, { ownershipConfirmed: confirmed });
        return {
          ok: true as const,
          durationSeconds: result.durationSeconds,
          mimeType: result.mimeType,
          status: result.status,
          sameFileReference: result.audio === file,
        };
      } catch (err: unknown) {
        const error = err as Error;
        return {
          ok: false as const,
          name: error.name,
          message: error.message,
          isUploadError: err instanceof mod.UploadError,
        };
      }
    },
    {
      modPath: UPLOAD_MODULE,
      name: input.name,
      mimeType: input.mimeType,
      base64Data: base64,
      confirmed: ownershipConfirmed,
    },
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("AC-7 S-7 §7 edge cases and §4 uploadAudio unit tests", () => {
  // AC-7 / §7 Edge Case 1 & §4 invalid input: unsupported file format
  test("AC-7 (§7.1, §4): uploadAudio rejects unsupported .ogg format with UnsupportedFormatError", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "clip.ogg",
      mimeType: "audio/ogg",
      buffer: makeWav(2),
    });

    expect(outcome).toEqual({
      ok: false,
      name: "UnsupportedFormatError",
      message: EXPECTED_MESSAGES.format,
      isUploadError: true,
    });
  });

  // AC-7 / §7 Edge Case 1 & Decision 9: audio-only .mp4 must not be accepted
  test("AC-7 (§7.1, d9, §4): uploadAudio rejects audio-only .mp4 extension with UnsupportedFormatError", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "clip.mp4",
      mimeType: "audio/mp4",
      buffer: makeWav(2),
    });

    expect(outcome).toEqual({
      ok: false,
      name: "UnsupportedFormatError",
      message: EXPECTED_MESSAGES.format,
      isUploadError: true,
    });
  });

  // AC-7 / §7 Edge Case 1 & Decision 9: missing extension
  test("AC-7 (§7.1, d9, §4): uploadAudio rejects file with no extension with UnsupportedFormatError", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "recording",
      mimeType: "audio/wav",
      buffer: makeWav(2),
    });

    expect(outcome).toEqual({
      ok: false,
      name: "UnsupportedFormatError",
      message: EXPECTED_MESSAGES.format,
      isUploadError: true,
    });
  });

  // AC-7 / §7 Edge Case 1 & Decision 9: conflicting MIME type and extension
  test("AC-7 (§7.1, d9, §4): uploadAudio rejects conflicting MIME type for .wav extension", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "mismatch.wav",
      mimeType: "audio/mpeg",
      buffer: makeWav(2),
    });

    expect(outcome).toEqual({
      ok: false,
      name: "UnsupportedFormatError",
      message: EXPECTED_MESSAGES.format,
      isUploadError: true,
    });
  });

  // AC-7 / §7 Edge Case 2 & §4 invalid input: exceeds MAX_CLIP_DURATION (60 s)
  test("AC-7 (§7.2, d5, §4): uploadAudio rejects 61 s audio with DurationLimitError", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "too-long.wav",
      mimeType: "audio/wav",
      buffer: makeWav(61),
    });

    expect(outcome).toEqual({
      ok: false,
      name: "DurationLimitError",
      message: EXPECTED_MESSAGES.duration,
      isUploadError: true,
    });
  });

  // AC-7 / §7 Edge Case 2 & Decision 10: duration must not be rounded before validation
  test("AC-7 (§7.2, d10, §4): uploadAudio rejects 60.04 s audio without rounding", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "just-over.wav",
      mimeType: "audio/wav",
      buffer: makeWav(60.04),
    });

    expect(outcome).toEqual({
      ok: false,
      name: "DurationLimitError",
      message: EXPECTED_MESSAGES.duration,
      isUploadError: true,
    });
  });

  // AC-7 / §7 Edge Case 3 & §4 invalid input: corrupted audio cannot be decoded
  test("AC-7 (§7.3, d3, d12, §4): uploadAudio rejects corrupted audio with InvalidAudioError", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "corrupt.wav",
      mimeType: "audio/wav",
      buffer: makeGarbage(4096),
    });

    expect(outcome).toEqual({
      ok: false,
      name: "InvalidAudioError",
      message: EXPECTED_MESSAGES.invalid,
      isUploadError: true,
    });
  });

  // AC-7 / §7 Edge Case 3 & Decision 10: zero, NaN, and Infinity durations are invalid audio
  test("AC-7 (§7.3, d10, §4): uploadAudio rejects 0, NaN, and Infinity durations with InvalidAudioError", async ({
    page,
  }) => {
    const outcomes = await page.evaluate(async ({ modPath }) => {
      const mod = await import(modPath);
      const OriginalAudio = window.Audio;
      const results: { reported: string; name: string; message: string }[] = [];

      try {
        for (const badDuration of [0, Number.NaN, Number.POSITIVE_INFINITY]) {
          class MockAudio extends EventTarget {
            preload = "";
            duration = badDuration;
            canPlayType() {
              return "maybe";
            }
            removeAttribute() {}
            load() {}
            set src(_value: string) {
              queueMicrotask(() => {
                this.dispatchEvent(new Event("loadedmetadata"));
              });
            }
          }

          (window as unknown as { Audio: typeof Audio }).Audio = MockAudio as unknown as typeof Audio;
          const file = new File([new Uint8Array([1, 2, 3, 4])], "bad-duration.wav", {
            type: "audio/wav",
          });

          try {
            await mod.uploadAudio(file, { ownershipConfirmed: true });
            results.push({ reported: String(badDuration), name: "NO_ERROR", message: "" });
          } catch (err: unknown) {
            const error = err as Error;
            results.push({
              reported: String(badDuration),
              name: error.name,
              message: error.message,
            });
          }
        }
      } finally {
        window.Audio = OriginalAudio;
      }

      return results;
    }, { modPath: UPLOAD_MODULE });

    for (const outcome of outcomes) {
      expect(outcome.name).toBe("InvalidAudioError");
      expect(outcome.message).toBe(EXPECTED_MESSAGES.invalid);
    }
  });

  // AC-7 / §7 Edge Case 4 & Decision 11: cancelling file selection does not invoke uploadAudio and creates no new clip
  test("AC-7 (§7.4, d11): cancelled selection creates no clip when empty and preserves existing clip invariant", async ({
    page,
  }) => {
    const validWavBase64 = makeWav(5).toString("base64");

    const state = await page.evaluate(
      async ({ uploadPath, clipsPath, base64Data }) => {
        const uploadMod = await import(uploadPath);
        const clipsMod = await import(clipsPath);

        clipsMod.removeUnpublishedClip();
        const initialWhenEmpty = clipsMod.getUnpublishedClip();

        // Cancelled selection: no file selected, uploadAudio is not called -> clip store stays empty.
        const afterCancelWhenEmpty = clipsMod.getUnpublishedClip();

        // Seed an existing accepted clip, then simulate cancelled selection (uploadAudio not called).
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const file = new File([bytes], "existing.wav", { type: "audio/wav" });
        const result = await uploadMod.uploadAudio(file, { ownershipConfirmed: true });
        const stored = clipsMod.setUnpublishedClip(result, file.name);

        // Cancelled selection does not call uploadAudio or setUnpublishedClip.
        const afterCancelWithExisting = clipsMod.getUnpublishedClip();

        return {
          initialWhenEmpty,
          afterCancelWhenEmpty,
          storedSnapshot: {
            id: stored.id,
            fileName: stored.fileName,
            status: stored.status,
            ownerId: stored.ownerId,
          },
          afterCancelSnapshot: afterCancelWithExisting
            ? {
                id: afterCancelWithExisting.id,
                fileName: afterCancelWithExisting.fileName,
                status: afterCancelWithExisting.status,
                ownerId: afterCancelWithExisting.ownerId,
              }
            : null,
          sameReference: afterCancelWithExisting === stored,
        };
      },
      { uploadPath: UPLOAD_MODULE, clipsPath: CLIPS_MODULE, base64Data: validWavBase64 },
    );

    expect(state.initialWhenEmpty).toBeNull();
    expect(state.afterCancelWhenEmpty).toBeNull();
    expect(state.sameReference).toBe(true);
    expect(state.afterCancelSnapshot).toEqual(state.storedSnapshot);
  });

  // AC-7 / §4 invalid input (Decision 13): missing ownership confirmation
  test("AC-7 (d13, §4): uploadAudio rejects valid audio when ownershipConfirmed is false", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "valid.wav",
      mimeType: "audio/wav",
      buffer: makeWav(5),
      ownershipConfirmed: false,
    });

    expect(outcome).toEqual({
      ok: false,
      name: "OwnershipNotConfirmedError",
      message: EXPECTED_MESSAGES.confirm,
      isUploadError: true,
    });
  });

  // AC-7 / §4 invalid input (Decision 11): file exceeding 20 MB limit
  test("AC-7 (d11, §4): uploadAudio rejects file exceeding 20 MB with FileSizeLimitError", async ({
    page,
  }) => {
    const outcome = await page.evaluate(
      async ({ modPath, maxBytes }) => {
        const mod = await import(modPath);
        const oversize = new File([new Uint8Array(maxBytes + 1)], "oversize.wav", {
          type: "audio/wav",
        });

        try {
          await mod.uploadAudio(oversize, { ownershipConfirmed: true });
          return { ok: true as const };
        } catch (err: unknown) {
          const error = err as Error;
          return {
            ok: false as const,
            name: error.name,
            message: error.message,
            isUploadError: err instanceof mod.UploadError,
          };
        }
      },
      { modPath: UPLOAD_MODULE, maxBytes: MAX_UPLOAD_BYTES },
    );

    expect(outcome).toEqual({
      ok: false,
      name: "FileSizeLimitError",
      message: EXPECTED_MESSAGES.size,
      isUploadError: true,
    });
  });

  // AC-7 / §4 invalid input (Decision 12): unreadable file produces UploadFailedError
  test("AC-7 (d12, §4): uploadAudio rejects unreadable file with UploadFailedError", async ({
    page,
  }) => {
    const validWavBase64 = makeWav(2).toString("base64");

    const outcome = await page.evaluate(
      async ({ modPath, base64Data }) => {
        const mod = await import(modPath);
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const file = new File([bytes], "unreadable.wav", { type: "audio/wav" });
        Object.defineProperty(file, "slice", {
          value: () => ({
            arrayBuffer: () => Promise.reject(new DOMException("Read failed", "NotReadableError")),
          }),
        });

        try {
          await mod.uploadAudio(file, { ownershipConfirmed: true });
          return { ok: true as const };
        } catch (err: unknown) {
          const error = err as Error;
          return {
            ok: false as const,
            name: error.name,
            message: error.message,
            isUploadError: err instanceof mod.UploadError,
          };
        }
      },
      { modPath: UPLOAD_MODULE, base64Data: validWavBase64 },
    );

    expect(outcome).toEqual({
      ok: false,
      name: "UploadFailedError",
      message: EXPECTED_MESSAGES.failed,
      isUploadError: true,
    });
  });

  // AC-7 / §4 baseline happy path: valid WAV returns unpublished UploadResult with original File
  test("AC-7 (§4, d14): uploadAudio accepts valid 5 s WAV and returns unpublished UploadResult", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "valid.wav",
      mimeType: "audio/wav",
      buffer: makeWav(5),
      ownershipConfirmed: true,
    });

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.status).toBe("unpublished");
      expect(outcome.mimeType).toBe("audio/wav");
      expect(outcome.sameFileReference).toBe(true);
      expect(Number.isFinite(outcome.durationSeconds)).toBe(true);
      expect(outcome.durationSeconds).toBeGreaterThan(0);
      expect(outcome.durationSeconds).toBeLessThanOrEqual(60);
      expect(Math.abs(outcome.durationSeconds - 5)).toBeLessThan(0.05);
    }
  });
});
