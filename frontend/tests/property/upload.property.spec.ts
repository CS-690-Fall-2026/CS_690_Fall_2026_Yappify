import { expect, test } from "@playwright/test";
import { makeGarbage, makeWav } from "../rules/wav";

/**
 * S-7 / AC-7 property-based tests derived from docs/design/S-7.md §6 ("Rules").
 *
 * Each test uses a deterministic seeded PRNG (Mulberry32) to generate a suite
 * of inputs and checks a universal rule from §6 without recomputing
 * `uploadAudio`'s decision logic.
 */

const UPLOAD_MODULE = "/src/audio/upload.ts";
const CLIPS_MODULE = "/src/data/clips.ts";

const PERMITTED_NORMALIZED_MIMES = ["audio/mpeg", "audio/wav", "audio/mp4"] as const;
const MAX_CLIP_DURATION_SECONDS = 60;

/** Deterministic seeded PRNG (Mulberry32) so property runs are reproducible. */
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

interface GeneratedInput {
  name: string;
  mimeType: string;
  base64Data: string;
  ownershipConfirmed: boolean;
  unreadable?: boolean;
}

const VALID_WAV_DURATIONS = [0.5, 1.25, 2.5, 4.0, 5.0, 60.0] as const;
const OVER_LIMIT_WAV_DURATIONS = [60.04, 61.0, 63.5] as const;
const ALL_EXTENSIONS = [".wav", ".WAV", ".mp3", ".m4a", ".ogg", ".mp4", ".flac", ".txt", ""] as const;
const UNSUPPORTED_EXTENSIONS = [".ogg", ".mp4", ".flac", ".aac", ".webm", ".txt", ""] as const;
const ALL_MIME_TYPES = [
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "application/octet-stream",
  "",
] as const;

function makeBufferForSpec(
  rng: () => number,
  kind: "valid-wav" | "over-wav" | "garbage",
): Buffer {
  if (kind === "valid-wav") return makeWav(pick(rng, VALID_WAV_DURATIONS));
  if (kind === "over-wav") return makeWav(pick(rng, OVER_LIMIT_WAV_DURATIONS));
  const length = 512 + Math.floor(rng() * 4096);
  const garbageSeed = Math.floor(rng() * 0xffffffff);
  return makeGarbage(length, garbageSeed);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("S-7 §6 property-based tests", () => {
  // Rule (docs/design/S-7.md §6, Invariant):
  // "Every accepted uploaded clip must have a permitted format and a duration
  //  less than or equal to MAX_CLIP_DURATION."
  test("§6 Invariant: every accepted upload has a permitted format and finite duration in (0, MAX_CLIP_DURATION]", async ({
    page,
  }) => {
    const rng = createRng(0x57_06_0001);
    const trials: GeneratedInput[] = [];

    for (let i = 0; i < 30; i++) {
      // Mix structured valid candidates with fully randomized candidates so both
      // accepted and rejected paths are exercised without predicting outcomes.
      const structuredValid = i % 3 === 0;
      const ext = structuredValid ? pick(rng, [".wav", ".WAV"]) : pick(rng, ALL_EXTENSIONS);
      const mimeType = structuredValid
        ? pick(rng, ["audio/wav", "audio/x-wav", "audio/wave", ""])
        : pick(rng, ALL_MIME_TYPES);
      const bufferKind = structuredValid
        ? "valid-wav"
        : pick(rng, ["valid-wav", "over-wav", "garbage"] as const);
      const ownershipConfirmed = structuredValid ? true : rng() < 0.75;

      trials.push({
        name: `prop-${i}${ext}`,
        mimeType,
        base64Data: makeBufferForSpec(rng, bufferKind).toString("base64"),
        ownershipConfirmed,
      });
    }

    const summary = await page.evaluate(
      async ({ uploadPath, inputs, permittedMimes, maxDuration }) => {
        const uploadMod = await import(uploadPath);
        let acceptedCount = 0;
        let rejectedCount = 0;
        const violations: string[] = [];

        for (let i = 0; i < inputs.length; i++) {
          const item = inputs[i]!;
          const bin = atob(item.base64Data);
          const bytes = new Uint8Array(bin.length);
          for (let j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
          const file = new File([bytes], item.name, { type: item.mimeType });

          try {
            const res = await uploadMod.uploadAudio(file, {
              ownershipConfirmed: item.ownershipConfirmed,
            });
            acceptedCount++;

            if (!permittedMimes.includes(res.mimeType)) {
              violations.push(`trial ${i}: non-permitted mimeType ${String(res.mimeType)}`);
            }
            if (
              !Number.isFinite(res.durationSeconds) ||
              res.durationSeconds <= 0 ||
              res.durationSeconds > maxDuration
            ) {
              violations.push(`trial ${i}: out-of-bounds duration ${String(res.durationSeconds)}`);
            }
            if (res.status !== "unpublished") {
              violations.push(`trial ${i}: unexpected status ${String(res.status)}`);
            }
            if (res.audio !== file) {
              violations.push(`trial ${i}: audio is not original File reference`);
            }
          } catch (err: unknown) {
            rejectedCount++;
            if (!(err instanceof uploadMod.UploadError)) {
              violations.push(`trial ${i}: threw non-UploadError ${String(err)}`);
            }
          }
        }

        return { acceptedCount, rejectedCount, violations };
      },
      {
        uploadPath: UPLOAD_MODULE,
        inputs: trials,
        permittedMimes: PERMITTED_NORMALIZED_MIMES,
        maxDuration: MAX_CLIP_DURATION_SECONDS,
      },
    );

    expect(summary.violations).toEqual([]);
    expect(summary.acceptedCount).toBeGreaterThan(0);
    expect(summary.rejectedCount).toBeGreaterThan(0);
  });

  // Rules (docs/design/S-7.md §6, Postconditions):
  // - "A rejected file does not produce an accepted clip."
  // - "An accepted file is displayed as a playable, unpublished clip."
  test("§6 Postconditions: rejected uploads never mutate or create a clip in clips.ts across arbitrary sequences", async ({
    page,
  }) => {
    const rng = createRng(0x57_06_0002);
    const steps: GeneratedInput[] = [];

    for (let i = 0; i < 30; i++) {
      const validCandidate = i % 3 === 1;
      const ext = validCandidate ? ".wav" : pick(rng, ALL_EXTENSIONS);
      const mimeType = validCandidate
        ? pick(rng, ["audio/wav", "audio/x-wav", ""])
        : pick(rng, ALL_MIME_TYPES);
      const bufferKind = validCandidate
        ? "valid-wav"
        : pick(rng, ["valid-wav", "over-wav", "garbage"] as const);
      const ownershipConfirmed = validCandidate ? true : rng() < 0.6;

      steps.push({
        name: `seq-${i}${ext}`,
        mimeType,
        base64Data: makeBufferForSpec(rng, bufferKind).toString("base64"),
        ownershipConfirmed,
      });
    }

    const summary = await page.evaluate(
      async ({ uploadPath, clipsPath, sequence }) => {
        const uploadMod = await import(uploadPath);
        const clipsMod = await import(clipsPath);

        clipsMod.removeUnpublishedClip();
        let acceptedCount = 0;
        let rejectedCount = 0;
        const violations: string[] = [];

        for (let i = 0; i < sequence.length; i++) {
          const item = sequence[i]!;
          const bin = atob(item.base64Data);
          const bytes = new Uint8Array(bin.length);
          for (let j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
          const file = new File([bytes], item.name, { type: item.mimeType });

          const beforeClip = clipsMod.getUnpublishedClip();

          try {
            const result = await uploadMod.uploadAudio(file, {
              ownershipConfirmed: item.ownershipConfirmed,
            });
            const stored = clipsMod.setUnpublishedClip(result, file.name);
            acceptedCount++;

            const afterClip = clipsMod.getUnpublishedClip();
            if (afterClip !== stored) {
              violations.push(`step ${i}: stored clip mismatch after acceptance`);
            }
            if (!afterClip || afterClip.status !== "unpublished" || afterClip.audio !== file) {
              violations.push(`step ${i}: accepted clip missing unpublished status or file ref`);
            }
          } catch {
            rejectedCount++;
            const afterClip = clipsMod.getUnpublishedClip();
            if (afterClip !== beforeClip) {
              violations.push(`step ${i}: rejected upload modified stored clip`);
            }
          }
        }

        clipsMod.removeUnpublishedClip();
        return { acceptedCount, rejectedCount, violations };
      },
      { uploadPath: UPLOAD_MODULE, clipsPath: CLIPS_MODULE, sequence: steps },
    );

    expect(summary.violations).toEqual([]);
    expect(summary.acceptedCount).toBeGreaterThan(0);
    expect(summary.rejectedCount).toBeGreaterThan(0);
  });

  // Rules (docs/design/S-7.md §6, Preconditions):
  // - "The user must select a readable audio file."
  // - "The selected file must use a format included in SUPPORTED_AUDIO_FORMATS."
  test("§6 Preconditions: unreadable, undecodable, or non-permitted-format inputs are never accepted", async ({
    page,
  }) => {
    const rng = createRng(0x57_06_0003);
    const invalidInputs: GeneratedInput[] = [];

    for (let i = 0; i < 25; i++) {
      const mode = i % 3;
      if (mode === 0) {
        // Non-permitted format (unsupported extension or conflicting MIME on valid WAV bytes).
        const conflictMime = rng() < 0.35;
        invalidInputs.push({
          name: conflictMime ? `bad-mime-${i}.wav` : `bad-ext-${i}${pick(rng, UNSUPPORTED_EXTENSIONS)}`,
          mimeType: conflictMime ? pick(rng, ["audio/mpeg", "audio/mp4", "audio/ogg"]) : pick(rng, ALL_MIME_TYPES),
          base64Data: makeBufferForSpec(rng, "valid-wav").toString("base64"),
          ownershipConfirmed: true,
        });
      } else if (mode === 1) {
        // Unreadable File with otherwise valid .wav metadata.
        invalidInputs.push({
          name: `unreadable-${i}.wav`,
          mimeType: "audio/wav",
          base64Data: makeBufferForSpec(rng, "valid-wav").toString("base64"),
          ownershipConfirmed: true,
          unreadable: true,
        });
      } else {
        // Undecodable garbage bytes with a permitted .wav extension.
        invalidInputs.push({
          name: `corrupt-${i}.wav`,
          mimeType: pick(rng, ["audio/wav", "audio/x-wav", ""]),
          base64Data: makeBufferForSpec(rng, "garbage").toString("base64"),
          ownershipConfirmed: true,
        });
      }
    }

    const summary = await page.evaluate(
      async ({ uploadPath, inputs }) => {
        const uploadMod = await import(uploadPath);
        let unexpectedAccepts = 0;
        let nonUploadErrors = 0;

        for (const item of inputs) {
          const bin = atob(item.base64Data);
          const bytes = new Uint8Array(bin.length);
          for (let j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
          const file = new File([bytes], item.name, { type: item.mimeType });

          if (item.unreadable) {
            Object.defineProperty(file, "slice", {
              value: () => ({
                arrayBuffer: () =>
                  Promise.reject(new DOMException("Simulated read failure", "NotReadableError")),
              }),
            });
          }

          try {
            await uploadMod.uploadAudio(file, { ownershipConfirmed: item.ownershipConfirmed });
            unexpectedAccepts++;
          } catch (err: unknown) {
            if (!(err instanceof uploadMod.UploadError)) {
              nonUploadErrors++;
            }
          }
        }

        return { total: inputs.length, unexpectedAccepts, nonUploadErrors };
      },
      { uploadPath: UPLOAD_MODULE, inputs: invalidInputs },
    );

    expect(summary.total).toBe(25);
    expect(summary.unexpectedAccepts).toBe(0);
    expect(summary.nonUploadErrors).toBe(0);
  });
});
