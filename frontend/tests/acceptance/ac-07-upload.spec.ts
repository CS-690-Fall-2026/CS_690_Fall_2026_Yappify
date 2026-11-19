import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const fixture = fileURLToPath(new URL("./fixtures/tone.wav", import.meta.url));

/**
 * AC-7 (story S-7), from docs/design/S-7.md section 9.
 *
 * AC-7: Given the user has an audio file in a format permitted by
 * SUPPORTED_AUDIO_FORMATS and within MAX_CLIP_DURATION, When the user selects
 * that file for upload, Then Yappify displays the uploaded audio as a
 * playable, unpublished clip.
 *
 * SKIPPED on purpose: S-7 is the story not built in Milestone 1, which handout
 * 6b allows when the reason names the AC ID. The body is kept so it can be
 * un-skipped without rewriting it.
 *
 * Before un-skipping:
 * - docs/design/S-7.md must settle SUPPORTED_AUDIO_FORMATS and
 *   MAX_CLIP_DURATION (open questions 1 and 2). The fixture is a 5-second
 *   48 kHz PCM WAV, so MAX_CLIP_DURATION must be at least 5 for it to be a
 *   valid Given.
 * - "unpublished" must be defined observably. This test assumes a Publish
 *   action is present and no Published state is shown.
 */
test("test_ac7_valid_audio_upload_displays_playback", async ({ page }) => {
  test.skip(
    true,
    "AC-7 skipped: S-7 is the story not built in Milestone 1 (handout 6b)",
  );

  await page.goto("/");

  await page.getByLabel(/upload/i).setInputFiles(fixture);

  const playback = page.getByRole("button", { name: /play/i });
  await expect(playback).toBeVisible();
  await expect(playback).toBeEnabled();

  await expect(page.getByRole("button", { name: /publish/i })).toBeVisible();
  await expect(page.getByText(/^published$/i)).toHaveCount(0);
});
