import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

/**
 * Chromium records from tests/fixtures/tone.wav instead of a physical
 * microphone. The fixture is the recording input for this test only:
 * `launchOptions` is a browser-level setting, so it is declared here rather
 * than in playwright.config.ts, where it would silently apply to every test.
 *
 * Recording length is Record-to-Stop, not the fixture length: the file is the
 * audio source the fake device keeps streaming. The 5-second fixture means the
 * stream never runs dry inside a normal test.
 */
const recordingInput = fileURLToPath(
  new URL("./fixtures/tone.wav", import.meta.url),
);

test.use({
  permissions: ["microphone"],
  launchOptions: {
    args: [
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      `--use-file-for-fake-audio-capture=${recordingInput}`,
    ],
  },
});

/**
 * AC-1 (story S-1), from docs/design/S-1.md section 9.
 *
 * AC-1: Given the user has granted microphone permission and is on the
 * recording screen, When the user presses Record and then Stop, Then Yappify
 * displays a completed recording with an available playback control.
 *
 * RED until the recording screen exists: this test must fail because the
 * application is not there yet, not because a selector or a typo is wrong.
 */
test("test_ac1_record_and_stop_displays_playback", async ({ page }) => {
  test
    .info()
    .annotations.push({ type: "mock-audio", description: recordingInput });

  await page.goto("/");

  await page.getByRole("button", { name: /^record/i }).click();

  const stop = page.getByRole("button", { name: /^stop/i });
  await expect(stop).toBeEnabled();
  await stop.click();

  const playback = page.getByRole("button", { name: /play/i });
  await expect(playback).toBeVisible();
  await expect(playback).toBeEnabled();

  await expect(page.locator("audio").first()).toHaveAttribute(
    "src",
    /^blob:/,
  );
});
