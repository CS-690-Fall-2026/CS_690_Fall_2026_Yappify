import { expect, test } from "@playwright/test";
import { makeWav } from "../rules/wav";

/**
 * S-7 / AC-7 integration tests.
 *
 * Exercises the story's upload validation logic (`/src/audio/upload.ts`)
 * together with the real temporary clip store data module (`/src/data/clips.ts`)
 * and duration formatter (`/src/utils/formatDuration.ts`) in Chromium's real
 * DOM/media environment, with no mocks between them.
 */

const UPLOAD_MODULE = "/src/audio/upload.ts";
const CLIPS_MODULE = "/src/data/clips.ts";
const FORMAT_MODULE = "/src/utils/formatDuration.ts";

test.use({
  launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] },
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("S-7 integration: uploadAudio + clips data module", () => {
  test("valid upload passes uploadAudio, stores UnpublishedClip in clips.ts, and loads playable audio", async ({
    page,
  }) => {
    const wavBase64 = makeWav(5).toString("base64");

    const result = await page.evaluate(
      async ({ uploadPath, clipsPath, formatPath, base64Data }) => {
        const uploadMod = await import(uploadPath);
        const clipsMod = await import(clipsPath);
        const formatMod = await import(formatPath);

        clipsMod.removeUnpublishedClip();

        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const file = new File([bytes], "tone-integration.wav", { type: "audio/wav" });

        const uploadResult = await uploadMod.uploadAudio(file, { ownershipConfirmed: true });
        const returnedClip = clipsMod.setUnpublishedClip(uploadResult, file.name);
        const storedClip = clipsMod.getUnpublishedClip();
        const currentUser = clipsMod.getCurrentUser();

        if (!storedClip) {
          throw new Error("Expected storedClip to be present after setUnpublishedClip");
        }

        // Verify the stored File plays cleanly via a real DOM <audio> element and object URL.
        const playbackUrl = URL.createObjectURL(storedClip.audio);
        const audioEl = document.createElement("audio");
        audioEl.src = playbackUrl;
        try {
          await new Promise<void>((resolve, reject) => {
            audioEl.addEventListener("loadedmetadata", () => resolve(), { once: true });
            audioEl.addEventListener("error", () => reject(new Error("Audio playback load failed")), {
              once: true,
            });
          });
          await audioEl.play();
          const startedPlaying = !audioEl.paused;
          audioEl.pause();

          return {
            sameReturnedAndStoredRef: returnedClip === storedClip,
            sameFileRef: storedClip.audio === file,
            id: storedClip.id,
            ownerId: storedClip.ownerId,
            currentUserId: currentUser.id,
            fileName: storedClip.fileName,
            mimeType: storedClip.mimeType,
            status: storedClip.status,
            durationSeconds: storedClip.durationSeconds,
            formattedDuration: formatMod.formatDuration(storedClip.durationSeconds),
            elementDuration: audioEl.duration,
            startedPlaying,
          };
        } finally {
          audioEl.removeAttribute("src");
          audioEl.load();
          URL.revokeObjectURL(playbackUrl);
          clipsMod.removeUnpublishedClip();
        }
      },
      {
        uploadPath: UPLOAD_MODULE,
        clipsPath: CLIPS_MODULE,
        formatPath: FORMAT_MODULE,
        base64Data: wavBase64,
      },
    );

    expect(result.sameReturnedAndStoredRef).toBe(true);
    expect(result.sameFileRef).toBe(true);
    expect(result.id).toMatch(/^clip-\d+$/);
    expect(result.ownerId).toBe(result.currentUserId);
    expect(result.fileName).toBe("tone-integration.wav");
    expect(result.mimeType).toBe("audio/wav");
    expect(result.status).toBe("unpublished");
    expect(Math.abs(result.durationSeconds - 5)).toBeLessThan(0.05);
    expect(Math.abs(result.elementDuration - 5)).toBeLessThan(0.05);
    expect(result.formattedDuration).toBe("0:05");
    expect(result.startedPlaying).toBe(true);
  });

  test("rejected upload preserves stored clip; second valid upload replaces it with new id; remove clears store", async ({
    page,
  }) => {
    const firstBase64 = makeWav(5).toString("base64");
    const secondBase64 = makeWav(3).toString("base64");
    const longBase64 = makeWav(61).toString("base64");

    const outcome = await page.evaluate(
      async ({ uploadPath, clipsPath, firstB64, secondB64, longB64 }) => {
        const uploadMod = await import(uploadPath);
        const clipsMod = await import(clipsPath);

        const toFile = (b64: string, name: string, type: string) => {
          const bin = atob(b64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
          }
          return new File([bytes], name, { type });
        };

        clipsMod.removeUnpublishedClip();

        // 1. Store first valid clip.
        const firstFile = toFile(firstB64, "first.wav", "audio/wav");
        const firstResult = await uploadMod.uploadAudio(firstFile, { ownershipConfirmed: true });
        const firstClip = clipsMod.setUnpublishedClip(firstResult, firstFile.name);

        // 2. Attempt rejected uploads (over-duration and unsupported format); store must stay unchanged.
        const rejectedErrors: string[] = [];
        for (const badFile of [
          toFile(longB64, "too-long.wav", "audio/wav"),
          toFile(firstB64, "bad.ogg", "audio/ogg"),
        ]) {
          try {
            const res = await uploadMod.uploadAudio(badFile, { ownershipConfirmed: true });
            clipsMod.setUnpublishedClip(res, badFile.name);
          } catch (err: unknown) {
            rejectedErrors.push((err as Error).name);
          }
        }

        const afterRejectClip = clipsMod.getUnpublishedClip();

        // 3. Store second valid clip; must replace the first with a distinct id.
        const secondFile = toFile(secondB64, "second.wav", "audio/wav");
        const secondResult = await uploadMod.uploadAudio(secondFile, { ownershipConfirmed: true });
        const secondClip = clipsMod.setUnpublishedClip(secondResult, secondFile.name);
        const afterReplaceClip = clipsMod.getUnpublishedClip();

        // 4. Remove clears the store back to null.
        clipsMod.removeUnpublishedClip();
        const afterRemoveClip = clipsMod.getUnpublishedClip();

        return {
          rejectedErrors,
          preservedSameRefAfterReject: afterRejectClip === firstClip,
          firstId: firstClip.id,
          secondId: secondClip.id,
          replacedSameRef: afterReplaceClip === secondClip,
          replacedFileName: afterReplaceClip?.fileName ?? null,
          replacedDuration: afterReplaceClip?.durationSeconds ?? null,
          afterRemoveClip,
        };
      },
      {
        uploadPath: UPLOAD_MODULE,
        clipsPath: CLIPS_MODULE,
        firstB64: firstBase64,
        secondB64: secondBase64,
        longB64: longBase64,
      },
    );

    expect(outcome.rejectedErrors).toEqual(["DurationLimitError", "UnsupportedFormatError"]);
    expect(outcome.preservedSameRefAfterReject).toBe(true);
    expect(outcome.secondId).not.toBe(outcome.firstId);
    expect(outcome.replacedSameRef).toBe(true);
    expect(outcome.replacedFileName).toBe("second.wav");
    expect(Math.abs((outcome.replacedDuration ?? 0) - 3)).toBeLessThan(0.05);
    expect(outcome.afterRemoveClip).toBeNull();
  });
});
