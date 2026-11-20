○ Thought for 1m 2s (Examining the design document, section 6 outlines preconditions, postconditions, and an invariant fo...)
● Ran 2 commands (ls -la docs/design frontend/tests · ls -la frontend/tests/acceptance)
● Explored 2 files (S-7.md, ac-07-upload.spec.ts)
… 8 more actions (3 reads, 5 commands: 1 failed) …
● Ran (grep -n -C 5 "AC-7" docs/backlog.md)
● Spawned 1 subagent (ctrl+o to expand)

▸ Thought for 3s, 137 tokens
  I have invoked the test-writer subagent to audit frontend/tests/acceptance (specifically frontend/tests/acceptance/ac-07-
  upload.spec.ts) against AC-7 and sections 6 and 7 of docs/design/S-7.md. Standing by for its audit findings and drafted
  tests.

▸ Thought for 15s
  The test-writer subagent has completed an audit of frontend/tests/acceptance (specifically
  frontend/tests/acceptance/ac-07-upload.spec.ts) against AC-7, Sections 6 (Rules), 7 (Edge Cases), 8 (Settled Decisions),
  and 9 (Acceptance Tests) of docs/design/S-7.md.
  ──────
   Audit Findings

  ## 1. Criteria Without a Test

  The current test suite contains only one test: test_ac7_valid_audio_upload_displays_playback. The following criteria
  defined in AC-7, Section 6, Section 7, and Section 8 have no test:

  ### Section 7 Edge Cases & Section 9 Proposed Tests
  1. Edge Case 1 / Section 9 / Decisions 4, 9, 12 — Reject Unsupported Audio Formats:
      • Criterion: If the user selects an unsupported format (e.g., .ogg, .flac, .txt, or audio-only .mp4), Yappify must
      reject the file, display user-facing error "Unsupported audio format. Please select MP3, WAV, or M4A." in an
      accessible live region, and not produce an accepted clip.
      • Status: Untested.
  2. Edge Case 2 / Section 9 / Decisions 5, 10, 12 — Reject Audio Exceeding MAX_CLIP_DURATION:
      • Criterion: If the user selects an audio file exceeding 60 seconds (e.g., 65s or 60.04s), Yappify must reject the
      file, display user-facing error "Audio clips must be 60 seconds or shorter.", and not produce an accepted clip.
      • Status: Untested.
  3. Edge Case 3 / Section 9 / Decisions 3, 10, 12 — Reject Corrupted / Undecodable Audio:
      • Criterion: If the user selects a corrupted audio file that cannot be decoded, Yappify must reject the file, display
      user-facing error "This audio file could not be played or is invalid.", and not produce an accepted clip.
      • Status: Untested.
  4. Edge Case 4 / Section 9 / Decision 11 — Canceling File Selection:
      • Criterion: When the user cancels file selection, no new clip is created, uploadAudio is not called, and any
      existing valid clip remains displayed.
      • Status: Untested.

  ### Section 6 Rules & Invariants
  5. Postcondition: "A rejected file does not produce an accepted clip":
      • Criterion: Any rejected file must never mount an <audio> player or show an accepted unpublished clip.
      • Status: Untested across all failure modes.
  6. Postcondition & Decision 11 — Rejected Upload Leaves Existing Clip Unchanged:
      • Criterion: "A rejected file will not replace an existing valid clip." If a valid clip is already displayed, a
      subsequent rejected upload must leave the previous valid clip intact.
      • Status: Untested.
  7. Postcondition & Decision 11 — Successful New Upload Replaces Previous Clip:
      • Criterion: "Only one unpublished uploaded clip will be displayed. A successful new upload replaces the previous
      clip."
      • Status: Untested.
  8. Invariant & Decision 10 — Positive and Finite Duration Boundary:
      • Criterion: "Accepted clips must have a finite duration greater than 0 seconds and less than or equal to 60 seconds.
      NaN, Infinity, and zero-second durations will be treated as invalid audio."
      • Status: Untested (0-second audio files).
  ### Section 8 Decisions & Section 9 Additional Tests
  9. Decision 6, 13 & Section 9 — Reject Upload Without Copyright Confirmation:
      • Criterion: "Users must confirm that they own the uploaded audio or have permission to upload it... If the user does
      not confirm, the file will not be accepted." The current test only tests the happy path with confirmation checked;
      there is no negative test verifying that unconfirmed uploads are blocked.
      • Status: Untested.
  10. Decision 11 & Section 9 — Reject Files Exceeding Maximum File Size (20 MB):
      • Criterion: "The maximum file size will be 20 MB." Files > 20 MB must be rejected.
      • Status: Untested.
  11. Decision 14, 15 — Remove Button Clears Clip:
      • Criterion: "An accepted clip will display: ... A button to remove the uploaded clip." Clicking it removes the clip
      from display and revokes its object URL.
      • Status: Untested.

  ──────
  ## 2. Expected Values That Do Not Follow From Their Criterion
  1. Line 72 in ac-07-upload.spec.ts:
    await expect(page.getByRole("button", { name: /^publish/i })).toHaveCount(0);
      • Discrepancy: Does not follow from criteria.
      • Reasoning: S-7 §3 Non-goals, §8 Decision 1 ("Uploading and publishing are separate actions. An uploaded audio file
      remains unpublished until the user explicitly chooses to publish it"), §8 Decision 14, and AC-7 establish that
      uploading leaves the clip unpublished and publishing is out of scope for S-7. Nowhere do the criteria state that a
      button named "Publish" must not exist on the page. Asserting that no button matching /^publish/i exists anywhere on
      the page is an ungrounded negative DOM assertion that overspecifies future or adjacent UI (such as S-8 / backlog).
  2. Line 44 in ac-07-upload.spec.ts:
    await expect(page.getByText(/(^|\D)0:05(\D|$)|(^|\D)5\s?(s|sec)/i)).toBeVisible();
      • Discrepancy: Regex alternatives (0:05, 5s, 5 sec) do not follow from a written format specification.
      • Reasoning: S-7 §8 Decisions 14 and 15 require displaying "The audio duration", but unlike S-6 in the backlog (which
      specifies "minutes and seconds"), S-7 specifies no canonical string format. Asserting regex variations without an
      approved formatting rule is an implementation assumption.
  3. Line 40 in ac-07-upload.spec.ts:
    await page.getByLabel(/upload/i).setInputFiles(fixture);

      • Discrepancy: Requires the label to match /upload/i.
      • Reasoning: S-7 §8 Decision 15 requires accessible labels. S-7 user story is "Allow users to select an existing
      audio file from their device". An accessible label such as "Select audio file" or "Choose audio file" is valid under
      the specification but would fail this regex.
  4. Line 49 in ac-07-upload.spec.ts:
    await expect(audio).toHaveAttribute("src", /^blob:/);
      • Discrepancy: Requires src directly on <audio>.
      • Reasoning: Decision 14 specifies creating an object URL for playback. HTML5 allows specifying audio sources via
      <audio src="blob:..."> or <audio><source src="blob:..."></audio>. Expecting the attribute directly on <audio> assumes
      an internal DOM implementation detail.
  ──────
  ## 3. Asserts That Only Check a Type or Length

  1. Lines 56–59 in ac-07-upload.spec.ts (waitForFunction):
    await page.waitForFunction(() => {
      const el = document.querySelector("audio") as HTMLAudioElement | null;
      return (
        !!el &&
        el.readyState >= HTMLMediaElement.HAVE_METADATA &&
        Number.isFinite(el.duration) &&
        el.duration > 0
      );
    });
      • Finding:
          • Number.isFinite(el.duration) only checks that duration is of numeric type.
          • el.duration > 0 only checks that duration is positive.
          • Neither check asserts the expected value of the fixture's duration. The fixture tone.wav is known to be exactly
          5.0 seconds. Any arbitrary positive duration (e.g., 0.001s or 59.9s) passes. Under Decision 10 ("The application
          will measure audio duration using HTML audio metadata..."), a strict test should verify Math.abs(el.duration - 5)
          < 0.25.
  2. Line 72 in ac-07-upload.spec.ts:
    await expect(page.getByRole("button", { name: /^publish/i })).toHaveCount(0);

      • Finding: toHaveCount(0) only checks the length/count of matching elements as a proxy for an ungrounded non-
      existence criterion.
  ──────
  ## 4. Tests Written for Each Missing Criterion
  The following Playwright test implementations were prepared by the test-writer subagent to cover all missing criteria.
  Synthetic WAV buffers are constructed in-memory so test fixtures are self-contained and reproducible.
    import { expect, test } from "@playwright/test";

    test.use({
      launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] },
    });

    /**
     * Constructs a valid PCM WAV buffer with the specified duration.
     */
    function createWavBuffer(durationSeconds: number, sampleRate = 8000): Buffer {
      const numChannels = 1;
      const bitsPerSample = 16;
      const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
      const blockAlign = (numChannels * bitsPerSample) / 8;
      const numSamples = Math.floor(sampleRate * durationSeconds);
      const dataSize = numSamples * blockAlign;
      const buffer = Buffer.alloc(44 + dataSize);

      // RIFF header
      buffer.write("RIFF", 0);
      buffer.writeUInt32LE(36 + dataSize, 4);
      buffer.write("WAVE", 8);

      // "fmt " sub-chunk
      buffer.write("fmt ", 12);
      buffer.writeUInt32LE(16, 16);
      buffer.writeUInt16LE(1, 20); // PCM
      buffer.writeUInt16LE(numChannels, 22);
      buffer.writeUInt32LE(sampleRate, 24);
      buffer.writeUInt32LE(byteRate, 28);
      buffer.writeUInt16LE(blockAlign, 32);
      buffer.writeUInt16LE(bitsPerSample, 34);

      // "data" sub-chunk
      buffer.write("data", 36);
      buffer.writeUInt32LE(dataSize, 40);

      return buffer;
    }

    /**
     * AC-7 / S-7 §7 Edge Case 1 & §8 Decisions 4, 9, 12, 15
     * Reject unsupported audio formats.
     */
    test("test_ac7_reject_unsupported_audio_format", async ({ page }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "unsupported.ogg",
        mimeType: "audio/ogg",
        buffer: createWavBuffer(2),
      });

      const expectedError =
        "Unsupported audio format. Please select MP3, WAV, or M4A.";
      await expect(page.getByText(expectedError)).toBeVisible();

      const liveRegion = page.locator("[aria-live], [role='alert']");
      await expect(liveRegion.filter({ hasText: expectedError })).toBeVisible();

      await expect(page.locator("audio")).toHaveCount(0);
      await expect(page.getByText(/^unpublished$/i)).toHaveCount(0);
    });

    /**
     * AC-7 / S-7 §7 Edge Case 2 & §8 Decisions 5, 10, 12
     * Reject audio exceeding MAX_CLIP_DURATION (60 seconds).
     */
    test("test_ac7_reject_audio_exceeding_max_clip_duration", async ({ page }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "toolong.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(65),
      });

      const expectedError = "Audio clips must be 60 seconds or shorter.";
      await expect(page.getByText(expectedError)).toBeVisible();
      await expect(page.locator("audio")).toHaveCount(0);
      await expect(page.getByText(/^unpublished$/i)).toHaveCount(0);
    });

    /**
     * AC-7 / S-7 §7 Edge Case 3 & §8 Decisions 3, 10, 12
     * Reject corrupted audio file that cannot be decoded.
     */
    test("test_ac7_reject_corrupted_audio_file", async ({ page }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      const corruptAudio = Buffer.from("RIFF1234WAVEcorruptdataheaderinvalidcontent");
      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "corrupt.wav",
        mimeType: "audio/wav",
        buffer: corruptAudio,
      });

      const expectedError = "This audio file could not be played or is invalid.";
      await expect(page.getByText(expectedError)).toBeVisible();
      await expect(page.locator("audio")).toHaveCount(0);
      await expect(page.getByText(/^unpublished$/i)).toHaveCount(0);
    });

    /**
     * AC-7 / S-7 §8 Decision 10
     * Reject zero-second duration audio files.
     */
    test("test_ac7_reject_zero_duration_audio", async ({ page }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "zero.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(0),
      });

      const expectedError = "This audio file could not be played or is invalid.";
      await expect(page.getByText(expectedError)).toBeVisible();
      await expect(page.locator("audio")).toHaveCount(0);
    });

    /**
     * AC-7 / S-7 §8 Decisions 6, 13 & §9 Additional Tests
     * Reject upload without copyright confirmation.
     */
    test("test_ac7_reject_upload_without_copyright_confirmation", async ({
      page,
    }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await expect(confirm).not.toBeChecked();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "sample.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(5),
      });

      await expect(page.locator("audio")).toHaveCount(0);
      await expect(page.getByText(/^unpublished$/i)).toHaveCount(0);
    });

    /**
     * AC-7 / S-7 §8 Decision 11 & §9 Additional Tests
     * Reject files exceeding maximum file size of 20 MB.
     */
    test("test_ac7_reject_file_exceeding_max_file_size", async ({ page }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      const oversizedBuffer = Buffer.alloc(21 * 1024 * 1024);
      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "oversized.wav",
        mimeType: "audio/wav",
        buffer: oversizedBuffer,
      });

      await expect(page.locator("audio")).toHaveCount(0);
      await expect(page.getByText(/^unpublished$/i)).toHaveCount(0);
    });

    /**
     * AC-7 / S-7 §7 Edge Case 4 & §8 Decision 11
     * Canceling file selection preserves existing valid clip.
     */
    test("test_ac7_cancel_file_selection_preserves_existing_clip", async ({
      page,
    }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "clip1.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(5),
      });
      await expect(page.getByText("clip1.wav")).toBeVisible();
      await expect(page.locator("audio")).toBeVisible();

      await page.getByLabel(/upload|select audio/i).setInputFiles([]);

      await expect(page.getByText("clip1.wav")).toBeVisible();
      await expect(page.locator("audio")).toBeVisible();
    });

    /**
     * AC-7 / S-7 §6 Postconditions & §8 Decisions 11, 12
     * A rejected upload leaves previous valid clip unchanged.
     */
    test("test_ac7_rejected_upload_leaves_previous_valid_clip_unchanged", async ({
      page,
    }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "valid-first.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(4),
      });
      await expect(page.getByText("valid-first.wav")).toBeVisible();
      const audio = page.locator("audio").first();
      await expect(audio).toBeVisible();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "invalid-second.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(65),
      });

      await expect(
        page.getByText("Audio clips must be 60 seconds or shorter."),
      ).toBeVisible();

      await expect(page.getByText("valid-first.wav")).toBeVisible();
      await expect(page.getByText("invalid-second.wav")).toHaveCount(0);
      await expect(audio).toBeVisible();
    });

    /**
     * AC-7 / S-7 §8 Decision 11
     * Successful new upload replaces previous clip.
     */
    test("test_ac7_successful_new_upload_replaces_previous_clip", async ({
      page,
    }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "first.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(3),
      });
      await expect(page.getByText("first.wav")).toBeVisible();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "second.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(5),
      });

      await expect(page.getByText("second.wav")).toBeVisible();
      await expect(page.getByText("first.wav")).toHaveCount(0);
      await expect(page.locator("audio")).toHaveCount(1);
    });

    /**
     * AC-7 / S-7 §8 Decisions 14, 15
     * Remove button removes uploaded clip.
     */
    test("test_ac7_remove_button_clears_uploaded_clip", async ({ page }) => {
      await page.goto("/");

      const confirm = page.getByLabel(
        "I confirm that I own this audio or have permission to upload it",
      );
      await confirm.check();

      await page.getByLabel(/upload|select audio/i).setInputFiles({
        name: "to-remove.wav",
        mimeType: "audio/wav",
        buffer: createWavBuffer(4),
      });
      await expect(page.getByText("to-remove.wav")).toBeVisible();
      await expect(page.locator("audio")).toBeVisible();

      const removeBtn = page.getByRole("button", { name: /remove|delete|discard/i });
      await expect(removeBtn).toBeVisible();
      await removeBtn.click();

      await expect(page.getByText("to-remove.wav")).toHaveCount(0);
      await expect(page.locator("audio")).toHaveCount(0);
      await expect(page.getByText(/^unpublished$/i)).toHaveCount(0);
    });
  ──────
  ## Plan to Append Tests to Acceptance Test Suite

  Per AGENTS.md rules:

  • Protected Files & Immutability: frontend/tests/ac-*.spec.ts are protected files. We will not edit, delete, skip, or
  weaken existing assertions in frontend/tests/acceptance/ac-07-upload.spec.ts. We will only append the new test cases.
  • Mandatory Approval Workflow: Before modifying frontend/tests/acceptance/ac-07-upload.spec.ts, we must present this plan
  and wait for explicit user approval.
  • No Production Code Changes: In accordance with your scope ("report findings as text and add tests only. Do not modify
  production source"), production source files in frontend/src/ will remain completely untouched.
  • Expected Test Execution Result: Because upload functionality is not yet implemented in production code, newly added
  tests will execute and fail as expected (RED) until the feature implementation task is executed.

  ### Planned Changes

  • File to Modify: frontend/tests/acceptance/ac-07-upload.spec.ts
  • Change: Append the 10 acceptance test cases and helper function above to the file, leaving the existing
  test_ac7_valid_audio_upload_displays_playback unmodified.
  • Verification Command: cd frontend && npm test
  • Risks: The new tests will be RED until the feature is implemented; no production code will be altered.

  Please confirm whether you approve appending these tests to frontend/tests/acceptance/ac-07-upload.spec.ts.
