// Deliverable 4f: captures evidence/screens/*.png from the running app.
//
// Usage (from frontend/, with `npm run dev` already serving :5173):
//   node scripts/capture-screens.mjs
//
// Every screenshot is taken from the real, unmodified app. Before each capture
// the script asserts the DOM shows the claimed state, so a screenshot is only
// written if the state is actually on screen. Simulation used, per shot:
//   02, 03  Chromium fake microphone (--use-fake-device-for-media-stream,
//           --use-fake-ui-for-media-stream, --use-file-for-fake-audio-capture
//           = tests/acceptance/fixtures/tone.wav) and the microphone permission
//           granted by Playwright.
//   04      Full Chromium build (channel "chromium"; the headless shell reports
//           "Not supported" instead of a denial), fake microphone device, and
//           the microphone permission set to "denied" for the page origin via
//           DevTools Browser.setPermission, so getUserMedia is denied.
//   05      DevTools CPU throttling (Emulation.setCPUThrottlingRate) so the
//           transient "Checking audio…" state lasts long enough to capture.
//   06–09   Generated in-memory WAV files (same synthetic 440 Hz tone format as
//           tests/rules/wav.ts); no microphone or permission settings.
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import { chromium, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";
const OUT = fileURLToPath(new URL("../../evidence/screens/", import.meta.url));
const TONE = fileURLToPath(new URL("../tests/acceptance/fixtures/tone.wav", import.meta.url));
const CONFIRM_LABEL = "I confirm that I own this audio or have permission to upload it";
const FILE_LABEL = "Choose audio file";

mkdirSync(OUT, { recursive: true });

/** Mono 16-bit PCM WAV, 8 kHz, 440 Hz tone, `seconds` long. */
function makeWav(seconds) {
  const rate = 8000;
  const n = Math.round(seconds * rate);
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVEfmt ", 8, "ascii");
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(0.2 * 32767 * Math.sin((2 * Math.PI * 440 * i) / rate)), 44 + i * 2);
  }
  return buf;
}

const wav = (name, seconds) => ({ name, mimeType: "audio/wav", buffer: makeWav(seconds) });
const shot = (page, name) => page.screenshot({ path: `${OUT}${name}`, fullPage: true });

async function freshPage(browser, contextOptions = {}) {
  const context = await browser.newContext({ viewport: { width: 1000, height: 800 }, ...contextOptions });
  const page = await context.newPage();
  await page.goto(BASE_URL);
  await expect(page.getByRole("heading", { name: "Upload an Audio Clip" })).toBeVisible();
  return { context, page };
}

const fakeMicArgs = [
  "--use-fake-device-for-media-stream",
  "--use-fake-ui-for-media-stream",
  `--use-file-for-fake-audio-capture=${TONE}`,
];

// --- Browser A: fake microphone, permission granted (01–03) ---------------
{
  const browser = await chromium.launch({ args: fakeMicArgs });
  const { context, page } = await freshPage(browser, { permissions: ["microphone"] });

  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByLabel(CONFIRM_LABEL)).not.toBeChecked();
  await shot(page, "01-empty-state.png");

  await page.getByRole("button", { name: "Record" }).click();
  await expect(page.getByText("Recording in progress...")).toBeVisible();
  await page.waitForTimeout(2000);
  await expect(page.getByText("Recording in progress...")).toBeVisible();
  await shot(page, "02-ac1-recording.png");

  await page.getByRole("button", { name: "Stop" }).click();
  await expect(page.getByRole("heading", { name: "Playback" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play" })).toBeEnabled();
  await expect(page.locator("audio").first()).toHaveAttribute("src", /^blob:/);
  await expect(page.getByText(/^Duration: \d+\.\ds$/)).toBeVisible();
  await shot(page, "03-ac1-playback.png");

  await context.close();
  await browser.close();
}

// --- Browser B: fake microphone device, permission set to "denied" (04) ---
{
  const browser = await chromium.launch({
    channel: "chromium",
    args: ["--use-fake-device-for-media-stream", `--use-file-for-fake-audio-capture=${TONE}`],
  });
  const { context, page } = await freshPage(browser, { permissions: [] });
  const cdp = await browser.newBrowserCDPSession();
  const { targetInfos } = await cdp.send("Target.getTargets");
  const target = targetInfos.find((t) => t.type === "page" && t.url.startsWith(BASE_URL));
  await cdp.send("Browser.setPermission", {
    permission: { name: "microphone" },
    setting: "denied",
    origin: new URL(BASE_URL).origin,
    browserContextId: target.browserContextId,
  });
  await page.getByRole("button", { name: "Record" }).click();
  await expect(page.getByRole("alert")).toHaveText("Microphone access is denied.");
  await expect(page.getByText("Recording in progress...")).toHaveCount(0);
  await shot(page, "04-ac1-mic-denied.png");
  await context.close();
  await browser.close();
}

// --- Browser C: uploads, no microphone (05–09) ----------------------------
{
  const browser = await chromium.launch();

  // 05: checking state, CPU throttled so the transient state is capturable.
  {
    const { context, page } = await freshPage(browser);
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 50 });
    await page.getByLabel(CONFIRM_LABEL).check();
    await page.getByLabel(FILE_LABEL).setInputFiles(wav("tone.wav", 59));
    await expect(page.getByText("Checking audio…")).toBeVisible({ timeout: 5000 });
    await shot(page, "05-ac7-checking.png");
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    await context.close();
  }

  // 06: AC-7 success.
  {
    const { context, page } = await freshPage(browser);
    await page.getByLabel(CONFIRM_LABEL).check();
    await page.getByLabel(FILE_LABEL).setInputFiles({ name: "tone.wav", mimeType: "audio/wav", buffer: makeWav(5) });
    await expect(page.getByText("tone.wav")).toBeVisible();
    await expect(page.getByText("0:05")).toBeVisible();
    await expect(page.getByText(/^unpublished$/i)).toBeVisible();
    await expect(page.locator("audio")).toHaveCount(1);
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect
      .poll(() => page.locator("audio").evaluate((a) => a.readyState))
      .toBeGreaterThanOrEqual(1);
    await shot(page, "06-ac7-uploaded.png");
    await context.close();
  }

  // 07–09: rejections.
  const rejections = [
    ["07-ac7-no-ownership.png", wav("tone.wav", 5), false,
      "Please confirm that you own this audio or have permission to upload it."],
    ["08-ac7-unsupported-format.png", { name: "clip.ogg", mimeType: "audio/ogg", buffer: makeWav(2) }, true,
      "Unsupported audio format. Please select MP3, WAV, or M4A."],
    ["09-ac7-too-long.png", wav("long.wav", 61), true,
      "Audio clips must be 60 seconds or shorter."],
  ];
  for (const [name, file, confirm, message] of rejections) {
    const { context, page } = await freshPage(browser);
    if (confirm) await page.getByLabel(CONFIRM_LABEL).check();
    await page.getByLabel(FILE_LABEL).setInputFiles(file);
    await expect(page.getByRole("alert")).toHaveText(message);
    await expect(page.locator("audio")).toHaveCount(0);
    await shot(page, name);
    await context.close();
  }

  await browser.close();
}

console.log(`Wrote 9 screenshots to ${OUT}`);
