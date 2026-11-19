import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

/**
 * Chromium needs to start playback without a user gesture because this test
 * drives play() directly; the flag is declared here, not in
 * playwright.config.ts, so it applies to this spec only.
 */
test.use({
  launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] },
});

/**
 * AC-7 (story S-7), from docs/design/S-7.md section 9 and docs/backlog.md 4d.
 * Decisions cited: 4 (formats), 5 (duration bound), 13 (ownership
 * confirmation), 14-15 (result shape), 16 (playback must load real metadata).
 *
 * Given the user has an audio file in a format permitted by
 * SUPPORTED_AUDIO_FORMATS and within MAX_CLIP_DURATION, and has confirmed that
 * they own the audio or have permission to upload it,
 * When the user selects that file for upload,
 * Then Yappify displays the uploaded audio as a playable, unpublished clip.
 *
 * Fixture: 5-second 48 kHz PCM WAV, inside decision 5's 60-second bound.
 * RED until the upload flow exists: this must fail because the feature is
 * missing, not because a selector is wrong.
 */
const fixture = fileURLToPath(new URL("./fixtures/tone.wav", import.meta.url));

test("test_ac7_valid_audio_upload_displays_playback", async ({ page }) => {
  await page.goto("/");

  // Decision 13: unchecked by default, required before a file is accepted.
  const confirm = page.getByLabel(
    "I confirm that I own this audio or have permission to upload it",
  );
  await expect(confirm).not.toBeChecked();
  await confirm.check();

  await page.getByLabel(/upload/i).setInputFiles(fixture);

  // Decision 15: accepted clip shows the original filename and its duration.
  await expect(page.getByText("tone.wav")).toBeVisible();
  await expect(page.getByText(/(^|\D)0:05(\D|$)|(^|\D)5\s?(s|sec)/i)).toBeVisible();

  // Decisions 14-15: native audio control playing the selected file.
  const audio = page.locator("audio").first();
  await expect(audio).toBeVisible();
  await expect(audio).toHaveAttribute("src", /^blob:/);

  // Decision 16: real metadata, not just the presence of a player element.
  await page.waitForFunction(() => {
    const el = document.querySelector("audio") as HTMLAudioElement | null;
    return (
      !!el &&
      el.readyState >= HTMLMediaElement.HAVE_METADATA &&
      Number.isFinite(el.duration) &&
      el.duration > 0
    );
  });
  expect(
    await audio.evaluate(async (el: HTMLAudioElement) => {
      await el.play();
      const playing = !el.paused;
      el.pause();
      return playing;
    }),
  ).toBe(true);

  // Decisions 1 and 14: the clip stays unpublished; publishing is out of S-7.
  await expect(page.getByText(/^unpublished$/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /^publish/i })).toHaveCount(0);
});
