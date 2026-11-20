import { expect, test, type Page } from "../coverage-test";
import { makeWav } from "../rules/wav";

/**
 * AC-7 / S-7 mutation-kill unit and boundary tests
 * (docs/design/S-7.md §4, §5, §8 decisions 5, 8, 9, 10, 11, 12, 14, 15).
 */

const UPLOAD_MODULE = "/src/audio/upload.ts";
const CLIPS_MODULE = "/src/data/clips.ts";
const FORMAT_DURATION_MODULE = "/src/utils/formatDuration.ts";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // decision 11

const EXPECTED_INVALID_MESSAGE = "This audio file could not be played or is invalid."; // decision 12

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

test.describe("AC-7 S-7 boundary and mutation-kill unit tests", () => {
  // AC-7 / Decision 9: missing MIME type undergoes extension validation + browser decoding
  test("AC-7 (d9): uploadAudio accepts valid .wav file when file.type is empty string", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "missing-mime.wav",
      mimeType: "",
      buffer: makeWav(2),
    });

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.status).toBe("unpublished");
      expect(outcome.mimeType).toBe("audio/wav");
      expect(outcome.sameFileReference).toBe(true);
      expect(Math.abs(outcome.durationSeconds - 2)).toBeLessThan(0.05);
    }
  });

  // AC-7 / Decisions 5 & 10: exact MAX_CLIP_DURATION (60.00 s) is accepted
  test("AC-7 (d5, d10): uploadAudio accepts exact 60.00 s WAV boundary with unpublished status", async ({
    page,
  }) => {
    const outcome = await runUploadAudio(page, {
      name: "exact-60s.wav",
      mimeType: "audio/wav",
      buffer: makeWav(60),
    });

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.status).toBe("unpublished");
      expect(outcome.mimeType).toBe("audio/wav");
      expect(outcome.sameFileReference).toBe(true);
      expect(outcome.durationSeconds).toBeLessThanOrEqual(60);
      expect(Math.abs(outcome.durationSeconds - 60)).toBeLessThan(0.05);
    }
  });

  // AC-7 / Decision 11: exact MAX_UPLOAD_BYTES (20 MB) is NOT rejected for file size
  test("AC-7 (d11): uploadAudio accepts exact MAX_UPLOAD_BYTES (20 MB) WAV file", async ({
    page,
  }) => {
    const wavBase64 = makeWav(2).toString("base64");

    const outcome = await page.evaluate(
      async ({ modPath, base64Data, maxBytes }): Promise<SerializedUploadOutcome> => {
        const mod = await import(modPath);
        const binary = atob(base64Data);
        const bytes = new Uint8Array(maxBytes);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const file = new File([bytes], "exact-20mb.wav", { type: "audio/wav" });

        try {
          const result = await mod.uploadAudio(file, { ownershipConfirmed: true });
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
      { modPath: UPLOAD_MODULE, base64Data: wavBase64, maxBytes: MAX_UPLOAD_BYTES },
    );

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.status).toBe("unpublished");
      expect(outcome.mimeType).toBe("audio/wav");
      expect(outcome.sameFileReference).toBe(true);
      expect(Math.abs(outcome.durationSeconds - 2)).toBeLessThan(0.05);
    }
  });

  // AC-7 / Decision 9: unsupported codec (canPlayType === "") rejects with InvalidAudioError
  test("AC-7 (d9, d12): uploadAudio rejects with InvalidAudioError when canPlayType returns empty string", async ({
    page,
  }) => {
    const wavBase64 = makeWav(2).toString("base64");

    const outcome = await page.evaluate(
      async ({ modPath, base64Data }) => {
        const mod = await import(modPath);
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const file = new File([bytes], "unsupported-codec.wav", { type: "audio/wav" });

        const originalCanPlayType = Audio.prototype.canPlayType;
        const checkedTypes: string[] = [];
        Audio.prototype.canPlayType = function (type: string): CanPlayTypeResult {
          checkedTypes.push(type);
          return "";
        };

        try {
          await mod.uploadAudio(file, { ownershipConfirmed: true });
          return { ok: true as const, checkedTypes };
        } catch (err: unknown) {
          const error = err as Error;
          return {
            ok: false as const,
            name: error.name,
            message: error.message,
            isUploadError: err instanceof mod.UploadError,
            isInvalidAudioError: err instanceof mod.InvalidAudioError,
            checkedTypes,
          };
        } finally {
          Audio.prototype.canPlayType = originalCanPlayType;
        }
      },
      { modPath: UPLOAD_MODULE, base64Data: wavBase64 },
    );

    expect(outcome).toEqual({
      ok: false,
      name: "InvalidAudioError",
      message: EXPECTED_INVALID_MESSAGE,
      isUploadError: true,
      isInvalidAudioError: true,
      checkedTypes: ["audio/wav"],
    });
  });

  // AC-7 / Decisions 9, 10, 12: metadata timeout rejects with InvalidAudioError and cleans up timer & URL
  test("AC-7 (d10, d12): uploadAudio rejects with InvalidAudioError on metadata timeout and cleans up URL and timer", async ({
    page,
  }) => {
    const wavBase64 = makeWav(2).toString("base64");

    const outcome = await page.evaluate(
      async ({ modPath, base64Data }) => {
        const mod = await import(modPath);
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const file = new File([bytes], "timeout.wav", { type: "audio/wav" });

        const originalAudio = window.Audio;
        const originalSetTimeout = window.setTimeout;
        const originalClearTimeout = window.clearTimeout;
        const originalCreateObjectURL = URL.createObjectURL;
        const originalRevokeObjectURL = URL.revokeObjectURL;

        const createdUrls: string[] = [];
        const revokedUrls: string[] = [];
        const clearedTimerIds: unknown[] = [];
        const timeoutDelays: (number | undefined)[] = [];
        const sentinelTimerId = 987654;

        class HangingAudio extends EventTarget {
          preload = "";
          duration = Number.NaN;
          private _src = "";

          canPlayType(): CanPlayTypeResult {
            return "maybe";
          }
          removeAttribute(attr: string): void {
            if (attr === "src") {
              this._src = "";
            }
          }
          load(): void {}
          get src(): string {
            return this._src;
          }
          set src(value: string) {
            this._src = value;
            // Intentionally never dispatch loadedmetadata or error.
          }
        }

        URL.createObjectURL = (obj: Blob | MediaSource): string => {
          const url = originalCreateObjectURL.call(URL, obj);
          createdUrls.push(url);
          return url;
        };
        URL.revokeObjectURL = (url: string): void => {
          revokedUrls.push(url);
          originalRevokeObjectURL.call(URL, url);
        };
        (window as unknown as { Audio: typeof Audio }).Audio =
          HangingAudio as unknown as typeof Audio;
        (window as unknown as { setTimeout: typeof setTimeout }).setTimeout = ((
          handler: TimerHandler,
          timeout?: number,
        ) => {
          timeoutDelays.push(timeout);
          if (typeof handler === "function") {
            handler();
          }
          return sentinelTimerId;
        }) as unknown as typeof setTimeout;
        window.clearTimeout = ((id?: number) => {
          clearedTimerIds.push(id);
        }) as typeof clearTimeout;

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
            createdUrls,
            revokedUrls,
            clearedTimerIds,
            timeoutDelays,
          };
        } finally {
          window.Audio = originalAudio;
          window.setTimeout = originalSetTimeout;
          window.clearTimeout = originalClearTimeout;
          URL.createObjectURL = originalCreateObjectURL;
          URL.revokeObjectURL = originalRevokeObjectURL;
        }
      },
      { modPath: UPLOAD_MODULE, base64Data: wavBase64 },
    );

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.name).toBe("InvalidAudioError");
      expect(outcome.message).toBe(EXPECTED_INVALID_MESSAGE);
      expect(outcome.isUploadError).toBe(true);
      expect(outcome.timeoutDelays).toEqual([10_000]);
      expect(outcome.createdUrls).toHaveLength(1);
      expect(outcome.revokedUrls).toEqual(outcome.createdUrls);
      expect(outcome.clearedTimerIds).toEqual([987654]);
    }
  });

  // AC-7 / Decision 12: UploadError base class sets name === "UploadError"
  test('AC-7 (d12): UploadError base class sets name to "UploadError"', async ({ page }) => {
    const result = await page.evaluate(async ({ modPath }) => {
      const mod = await import(modPath);
      const err = new mod.UploadError("custom upload failure");
      return {
        isError: err instanceof Error,
        isUploadError: err instanceof mod.UploadError,
        name: err.name,
        message: err.message,
      };
    }, { modPath: UPLOAD_MODULE });

    expect(result).toEqual({
      isError: true,
      isUploadError: true,
      name: "UploadError",
      message: "custom upload failure",
    });
  });

  // AC-7 / Decisions 8 & 11: getCurrentUser copy semantics & strictly increasing clip IDs
  test("AC-7 (d8, d11): getCurrentUser returns a copy and setUnpublishedClip generates strictly increasing clip IDs", async ({
    page,
  }) => {
    const result = await page.evaluate(async ({ clipsPath }) => {
      const clips = await import(clipsPath);
      clips.removeUnpublishedClip();

      const user1 = clips.getCurrentUser();
      user1.displayName = "Mutated Name";
      user1.id = "mutated-id";
      const user2 = clips.getCurrentUser();

      const fakeResult = {
        audio: new Blob([new Uint8Array([1, 2, 3])], { type: "audio/wav" }),
        durationSeconds: 5,
        mimeType: "audio/wav" as const,
        status: "unpublished" as const,
      };

      const clip1 = clips.setUnpublishedClip(fakeResult, "one.wav");
      const clip2 = clips.setUnpublishedClip(fakeResult, "two.wav");
      const clip3 = clips.setUnpublishedClip(fakeResult, "three.wav");
      const current = clips.getUnpublishedClip();
      clips.removeUnpublishedClip();

      return {
        user2,
        ids: [clip1.id, clip2.id, clip3.id],
        ownerIds: [clip1.ownerId, clip2.ownerId, clip3.ownerId],
        currentId: current?.id ?? null,
      };
    }, { clipsPath: CLIPS_MODULE });

    expect(result.user2.id).toBe("user-1");
    expect(result.user2.id.length).toBeGreaterThan(0);
    expect(result.user2.displayName).toBe("Demo User");
    expect(result.user2.displayName.length).toBeGreaterThan(0);

    expect(result.ownerIds).toEqual(["user-1", "user-1", "user-1"]);
    expect(result.currentId).toBe(result.ids[2]);

    const suffixes = result.ids.map((id: string) => {
      const match = /^clip-(\d+)$/.exec(id);
      expect(match).not.toBeNull();
      return Number(match![1]);
    });
    const [n1, n2, n3] = suffixes;
    expect(n1).toBeGreaterThanOrEqual(1);
    expect(n2).toBeGreaterThan(n1);
    expect(n3).toBeGreaterThan(n2);
  });

  // AC-7 / Decision 15: formatDuration formats boundary, non-finite, negative, and m:ss values
  test("AC-7 (d15): formatDuration formats 0, -5, NaN, Infinity as 0:00, 5 as 0:05, and 60 as 1:00", async ({
    page,
  }) => {
    const formatted = await page.evaluate(async ({ modPath }) => {
      const mod = await import(modPath);
      return {
        zero: mod.formatDuration(0),
        negative: mod.formatDuration(-5),
        nan: mod.formatDuration(Number.NaN),
        infinity: mod.formatDuration(Number.POSITIVE_INFINITY),
        five: mod.formatDuration(5),
        fivePointFour: mod.formatDuration(5.4),
        fiftyNinePointSix: mod.formatDuration(59.6),
        sixty: mod.formatDuration(60),
      };
    }, { modPath: FORMAT_DURATION_MODULE });

    expect(formatted).toEqual({
      zero: "0:00",
      negative: "0:00",
      nan: "0:00",
      infinity: "0:00",
      five: "0:05",
      fivePointFour: "0:05",
      fiftyNinePointSix: "1:00",
      sixty: "1:00",
    });
  });
});
