import { expect, test, type Page } from "@playwright/test";
import { makeGarbage, makeWav } from "./wav";

/**
 * S-7 rule tests (Task 4.3), derived from docs/design/S-7.md §7 (edge cases),
 * §8 decisions 3, 5, 10–13, 15 and §9 "Additional Tests", and from the
 * approved plan docs/plans/S-7-plan.md ("Rule-test cases (4.3)").
 *
 * Values are written out here, not imported from src/, so the tests check the
 * design rather than echo the implementation.
 *
 * Written RED before the upload feature exists: each test must fail because
 * the upload UI is missing, not because of a bad selector.
 *
 * `@controls` goes green with Task 4.6 (upload controls);
 * `@display` goes green with Task 4.7 (uploaded-audio display).
 */

const CONFIRM_LABEL = "I confirm that I own this audio or have permission to upload it"; // d13
const FILE_LABEL = "Choose audio file"; // plan, UI integration (d15)
const CHECKING = "Checking audio…"; // plan open item 4 (d11)
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // d11

const MSG = {
  format: "Unsupported audio format. Please select MP3, WAV, or M4A.", // d12
  duration: "Audio clips must be 60 seconds or shorter.", // d12
  invalid: "This audio file could not be played or is invalid.", // d12
  size: "Audio files must be 20 MB or smaller.", // plan open item 2
  confirm: "Please confirm that you own this audio or have permission to upload it.", // plan open item 1
} as const;

interface Fixture {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

const wav = (name: string, seconds: number): Fixture => ({
  name,
  mimeType: "audio/wav",
  buffer: makeWav(seconds),
});

async function select(page: Page, file: Fixture, { confirm = true } = {}) {
  if (confirm) await page.getByLabel(CONFIRM_LABEL).check();
  await page.getByLabel(FILE_LABEL).setInputFiles(file);
}

async function expectRejected(page: Page, message: string) {
  await expect(page.getByRole("alert")).toHaveText(message);
  await expect(page.locator("audio")).toHaveCount(0);
}

async function expectClip(page: Page, name: string, duration: string) {
  await expect(page.getByText(name)).toBeVisible();
  await expect(page.getByText(duration)).toBeVisible();
  await expect(page.getByText(/^unpublished$/i)).toBeVisible();
  await expect(page.locator("audio")).toHaveCount(1);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("controls", { tag: "@controls" }, () => {
  test("unsupported .ogg is rejected (d4, d9)", async ({ page }) => {
    await select(page, { name: "clip.ogg", mimeType: "audio/ogg", buffer: makeWav(2) });
    await expectRejected(page, MSG.format);
  });

  test("audio-only .mp4 is rejected (d9)", async ({ page }) => {
    await select(page, { name: "clip.mp4", mimeType: "audio/mp4", buffer: makeWav(2) });
    await expectRejected(page, MSG.format);
  });

  test(".wav with conflicting MIME audio/mpeg is rejected (d9)", async ({ page }) => {
    await select(page, { name: "clip.wav", mimeType: "audio/mpeg", buffer: makeWav(2) });
    await expectRejected(page, MSG.format);
  });

  test("file over 20 MB is rejected (d11)", async ({ page }) => {
    await select(page, {
      name: "big.wav",
      mimeType: "audio/wav",
      buffer: Buffer.alloc(MAX_UPLOAD_BYTES + 1),
    });
    await expectRejected(page, MSG.size);
  });

  test("undecodable .wav is rejected as invalid audio (d3, d12)", async ({ page }) => {
    await select(page, { name: "noise.wav", mimeType: "audio/wav", buffer: makeGarbage(4096) });
    await expectRejected(page, MSG.invalid);
  });

  test("61 s WAV is rejected (d5, d10)", async ({ page }) => {
    await select(page, wav("long.wav", 61));
    await expectRejected(page, MSG.duration);
  });

  test("60.04 s WAV is rejected; duration is not rounded (d10)", async ({ page }) => {
    await select(page, wav("edge.wav", 60.04));
    await expectRejected(page, MSG.duration);
  });

  test("valid file without ownership confirmation is rejected (d13)", async ({ page }) => {
    await select(page, wav("tone.wav", 5), { confirm: false });
    await expectRejected(page, MSG.confirm);
  });

  test("confirmation unchecked on load and file input labelled (d13, d15)", async ({ page }) => {
    await expect(page.getByLabel(CONFIRM_LABEL)).not.toBeChecked();
    const input = page.getByLabel(FILE_LABEL);
    await expect(input).toHaveAttribute("type", "file");
    await expect(input).toHaveAccessibleName(FILE_LABEL);
  });

  test("controls are disabled while checking audio (d11)", async ({ page }) => {
    const box = page.getByLabel(CONFIRM_LABEL);
    const input = page.getByLabel(FILE_LABEL);
    await expect(box).toBeEnabled();
    await expect(input).toBeEnabled();

    // Validation can finish within a frame, so record the control state on
    // every DOM change while the loading text is present.
    await page.evaluate((checking) => {
      const seen: { input: boolean; box: boolean }[] = [];
      (window as unknown as { __checking: typeof seen }).__checking = seen;
      new MutationObserver(() => {
        if (!document.body.textContent?.includes(checking)) return;
        const file = document.querySelector<HTMLInputElement>('input[type="file"]');
        const confirm = document.querySelector<HTMLInputElement>('input[type="checkbox"]');
        seen.push({ input: !!file?.disabled, box: !!confirm?.disabled });
      }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true });
    }, CHECKING);

    await select(page, wav("tone.wav", 5));

    const states = () =>
      page.evaluate(() => (window as unknown as { __checking: { input: boolean; box: boolean }[] }).__checking);
    await expect.poll(async () => (await states()).length).toBeGreaterThan(0);
    await expect(page.getByText(CHECKING)).toHaveCount(0);
    expect((await states()).every((s) => s.input && s.box)).toBe(true);
    await expect(box).toBeEnabled();
    await expect(input).toBeEnabled();
  });
});

test.describe("display", { tag: "@display" }, () => {
  test("60.00 s WAV is accepted and shows 1:00 (d5, d10, d15)", async ({ page }) => {
    await select(page, wav("minute.wav", 60));
    await expectClip(page, "minute.wav", "1:00");
    await expect(page.getByRole("alert")).toHaveCount(0);
  });

  test("rejected file leaves the previous clip in place (d11, d12)", async ({ page }) => {
    await select(page, wav("good.wav", 5));
    await expectClip(page, "good.wav", "0:05");

    await select(page, { name: "bad.ogg", mimeType: "audio/ogg", buffer: makeWav(2) });
    await expect(page.getByRole("alert")).toHaveText(MSG.format);
    await expectClip(page, "good.wav", "0:05");
  });

  test("second valid upload replaces the first (d11)", async ({ page }) => {
    await select(page, wav("first.wav", 5));
    await expectClip(page, "first.wav", "0:05");

    await select(page, wav("second.wav", 10));
    await expectClip(page, "second.wav", "0:10");
    await expect(page.getByText("first.wav")).toHaveCount(0);
  });

  test("cancelled selection leaves the clip unchanged (d11, §7 case 4)", async ({ page }) => {
    await select(page, wav("keep.wav", 5));
    await expectClip(page, "keep.wav", "0:05");

    await page.getByLabel(FILE_LABEL).setInputFiles([]);
    await expectClip(page, "keep.wav", "0:05");
    await expect(page.getByRole("alert")).toHaveCount(0);
  });

  test("Remove clears the clip and its audio element (d15)", async ({ page }) => {
    await select(page, wav("gone.wav", 5));
    await expectClip(page, "gone.wav", "0:05");

    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("gone.wav")).toHaveCount(0);
    await expect(page.getByText(/^unpublished$/i)).toHaveCount(0);
    await expect(page.locator("audio")).toHaveCount(0);
  });
});
