# Yappify — Provenance Ledger

Scope: Milestone 1 (Deliverables 5–9). Entries 1–4 record the 6b test-harness work and its evidence; entries 5–6 record the S-1 plan and the S-1 frontend implementation contributed by teammates. Format per handout Deliverable 8: artifact, tool, prompts, review, checks, evidence, risk.

## Entry 1

artifact: `CS690_Milestone1_Handout.docx` — the Milestone 1 handout, as a local copy, a Google
  Drive copy, and a Canvas attachment (`/home/TacticalTaco/tmp/CS690_Milestone1_Handout.docx`).

tool: omp agent session, model `bifrost/opencode-go/deepseek-v4.1-flash`, used 2026-11-08.

prompts: One prompt, saved verbatim at `prompts/01-operator-request.md`: use the class
  materials, lecture transcripts, slides, recordings and the team Google Drive to determine how
  the teacher wants tests built for Milestone 1 part 6b — how reviewed or agentic, and whether
  every line must be explicable.

review: Accepted the Canvas attachment as authoritative after the sha256 match with the local
  copy; rejected nothing. The Google Drive copy was found to add team annotations (a Todo list,
  the Yappify backlog with S-1..S-10 and AC-1..AC-10, and assignment notes) but leaves the
  Deliverable 6b text unchanged. Reason for treating Canvas as authoritative: it is the file the
  assignment attaches; no version marker exists to distinguish revisions.

checks: sha256 of the local copy and of the Canvas copy, both
  `d88cc12cbff815401fa54cfbbe72672799b472605b0d8bc6ddcf237adb39d8ec`. Canvas handout file id
  10511941, last updated `2026-10-25T17:23:29Z`. Both hash values and both identifiers are as
  supplied to this session; the commands were not re-run by the provenance-scribe agent.

evidence: Deliverable 6b (Tests first) and Deliverable 6e (Finish line).

risk: The handout carries no version marker, so the local, Drive, and Canvas copies cannot be
  distinguished by revision; only the sha256 match establishes that the local and Canvas
  copies are the same bytes, and the Drive copy was not hashed.

## Entry 2

artifact: `Testing.pptx` — Canvas file id 10622688, last updated `2026-11-07T15:11:50Z`,
  79 slides, Week 10 deck titled "Testing with AI: TDD and Test Quality".

tool: omp agent session, model `bifrost/opencode-go/deepseek-v4.1-flash`, used 2026-11-08,
  plus `python3` with the stdlib `zipfile` module to extract the OOXML slide XML and text.

prompts: One prompt block, saved verbatim at `prompts/02-canvas-testing-slides.md` (both
  messages, in order): log in to Canvas and show the Testing slide; is it about a specific
  strategy or the project; which two design-doc stories; what "the agent then builds the green"
  means; build the test harness, name the language and the test-writing basics and the library
  functions the ACs need, pull the existing git repo before harness writing, and start a
  provenance agent first.

review: Rejected the initial `canvas.njit.edu` host because it served a login portal, and switched
  to `njit.instructure.com` (the account's actual Canvas host). Extracted all 79 slides and read
  the speaker notes for the cited slides; changed nothing in the deck. Verified slides 27, 28, 29,
  33, 44, 73, and 74 against the 2026-11-03 lecture transcript; no contradiction found. Rejected
  nothing else.

checks: Extracted all 79 slides of text from the deck (file id 10622688), retrieved from
  `njit.instructure.com` after `canvas.njit.edu` was rejected for serving a login portal. Slide
  count, file id, and update timestamp are as supplied to this session; the extraction was not
  re-run by the provenance-scribe agent.

evidence: 6b method — the test-first expectations the deck states.

risk: The lecture deck is guidance, not a grading rubric; Canvas assignment 766809 has no
  rubric, so no statement taken from these slides is a scored requirement.

## Entry 3

artifact: project repository (Deliverable 6a) — org `https://github.com/CS-690-Fall-2026`,
  repo `https://github.com/CS-690-Fall-2026/CS_690_Fall_2026_Yappify` (public, updated
  `2026-11-07T20:33:38Z`), cloned to
  `/home/TacticalTaco/school/CS690/group-project` at HEAD
  `a57fa391505a2928782873feda30c808527fa827`, commit message "Update S-1 and S-7 design docs",
  commit time `2026-11-07T15:33:28-05:00`.

tool: `git` (clone), the `gh` CLI, filesystem `find`, Canvas API reads, and Google Drive search.

prompts: One prompt. Summary: operator request to pull the existing git repo before harness
  writing. Path: `prompts/04-harness-and-repo.md` (Message A supplies the org URL); the earlier
  summary is also kept at `prompts/03-repo-discovery.md`.

review: The repository was found. The earlier search was a negative result and was incomplete
  because the course org name was unknown; `gh repo list CS-690-Fall-2026 --limit 100` returned
  exactly one repository, `CS_690_Fall_2026_Yappify`. The earlier negative search had looked
  locally under `~`, on the user's GitHub account, in course org `md685-njit`, in the team Drive
  folder, and in Canvas conversations.

checks: As supplied, and not re-run by the provenance-scribe agent:
  - `gh repo list CS-690-Fall-2026 --limit 100` — exactly one repo, `CS_690_Fall_2026_Yappify`
  - `git clone` to `/home/TacticalTaco/school/CS690/group-project` — HEAD `a57fa391505a2928
    782873feda30c808527fa827`
  - Earlier, superseded search: `find ~ ...` — no yappify repo; `gh repo list --limit 100` — no
    candidate; `gh repo list md685-njit` — only assignment and lecture repositories;
    `gh api user/repository_invitations` — empty; Drive search for `github.com` — empty; Canvas
    conversations — only a Discord invite, `https://discord.gg/yBYW6h7rW`

evidence: Deliverable 6a (repository: `README.md`, `AGENTS.md`, `docs/design/`,
  `docs/plans/`, ledger).

risk: The earlier negative result was wrong, so the other negative results from that same search
  session (invitations, Drive search, Canvas conversations) are not evidence of absence. The
  clone is at `a57fa39`; that commit's time (`2026-11-07T15:33:28-05:00`, i.e. 20:33:28Z) is ten
  seconds before the repo's recorded update `2026-11-07T20:33:38Z`. The remote was checked on
  2026-11-08: `git ls-remote origin HEAD refs/heads/*` returned `a57fa391505a2928782873feda30c
  808527fa827` for both `HEAD` and `refs/heads/main`, so the remote has not advanced past the
  clone.

## Entry 4

artifact: 6b test harness — committed at `945971ee137873230ba2029856f757f5990f4a84`
  ("add tests for AC-1 and AC-7", 2026-11-08 15:08:27 -05:00), under
  `/home/TacticalTaco/school/CS690/group-project/frontend`: `.gitignore` (new, 5 lines),
  `package-lock.json`, `package.json`, `playwright.config.ts`, `tests/ac-01-record.spec.ts`,
  `tests/ac-07-upload.spec.ts`, and `tests/fixtures/tone.wav` — 5.000 s, 48 kHz, mono, PCM
  s16le, 480,044 bytes, generated on 2026-11-08 with the Python stdlib `wave` module (arpeggio
  C-major / A-minor / F-major / G-major, no third-party audio). `tests/helpers/wav.ts` was
  deleted as dead code; it is not in the commit.
  `playwright.config.ts` no longer passes the fake-media flags or `permissions`; it keeps only
  `baseURL` and `trace`. `tests/ac-01-record.spec.ts` declares them itself with
  `test.use({ permissions: ["microphone"], launchOptions: { args: [--use-fake-ui-for-media-stream,
  --use-fake-device-for-media-stream, --use-file-for-fake-audio-capture=<abs tone.wav>] } })`,
  the path computed with `fileURLToPath(new URL("./fixtures/tone.wav", import.meta.url))`; the
  test also pushes a `mock-audio` annotation carrying the fixture path.
  `tests/ac-07-upload.spec.ts` calls `setInputFiles(fixture)` on that same path instead of
  building an in-memory WAV.

tool: omp agent session, model `bifrost/opencode-go/deepseek-v4.1-flash`, used 2026-11-08;
  npm 11.20.0; `@playwright/test` ^1.56.

prompts: One prompt block: build the 6b test harness after pulling the repo. Path:
  `prompts/04-harness-and-repo.md` — Message A (org URL), Message B ("Do you think we should use
  ts effect?"), and the earlier operator request from this session, all verbatim.

review: Read `README.md`, `AGENTS.md`, `docs/design/S-1.md`, `docs/design/S-7.md`,
  `docs/design/S-1-gap-check.md`, `docs/design/S-7-gap-check.md`. Used the proposed test names
  from section 9 of both design docs. Skipped AC-7 because S-7 is the story not built in
  Milestone 1 (handout 6b). Did not modify `AGENTS.md`, `README.md`, `docs/design/`, or the
  repository-root `.gitignore`. Rejected a Vitest+jsdom harness built before the repository was
  known, because `AGENTS.md` mandates Playwright for frontend tests. Replaced the in-memory
  1-second silent WAV
  with a committed 5-second music-like fixture so the same file serves both the Chromium fake
  microphone (AC-1) and the upload input (AC-7). Rejected keeping two audio sources (generated
  buffer plus fixture) because the fake-capture flag needs a real file path and one fixture keeps
  the two tests on identical media. Scoped the recording mock to the test that needs it instead
  of the whole suite: `launchOptions` is a browser-level setting, so a global capture file would
  silently become the microphone for every future test in `frontend/tests`.

checks: `npm install --no-audit --no-fund` in `frontend` (3 packages); `npx playwright install
  chromium` (Chromium headless shell 1254, 125.9 MiB); `npx playwright test` → 1 failed, 1
  skipped. Failure: `page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/` in
  `test_ac1_record_and_stop_displays_playback`. Skipped:
  `test_ac7_valid_audio_upload_displays_playback`, reason "AC-7 skipped: S-7 is the story not
  built in Milestone 1 (handout 6b)". Committed as `945971ee137873230ba2029856f757f5990f4a84`,
  2026-11-08 15:08:27 -05:00, subject "add tests for AC-1 and AC-7", on top of `a57fa39`, with
  seven files: `frontend/.gitignore` (new, 5 lines), `frontend/package-lock.json`,
  `frontend/package.json`, `frontend/playwright.config.ts`,
  `frontend/tests/ac-01-record.spec.ts`, `frontend/tests/ac-07-upload.spec.ts`,
  `frontend/tests/fixtures/tone.wav` (480,044 bytes). HEAD is now `945971e`. Fixture checks, run
  2026-11-08 and not re-run by the provenance-scribe agent:
  - `ffprobe` → `pcm_s16le`, 48000 Hz, 1 channel, duration 1.000000 before regeneration and
    5.000000 after.
  - Throwaway Playwright script against `http://127.0.0.1:8099/` with the same launch flags →
    fixture decoded, `audio.duration = 5`, `canPlayType("audio/wav") = "maybe"`; `getUserMedia` +
    `MediaRecorder` for 700 ms produced one data chunk of 10,608 bytes.
  - `npm test` in `frontend` → still 1 failed, 1 skipped: `test_ac1_record_and_stop_displays_
    playback` fails at `page.goto` with `net::ERR_CONNECTION_REFUSED at http://localhost:5173/`;
    `test_ac7_valid_audio_upload_displays_playback` skipped with its AC-7 reason.
  - `DEBUG=pw:browser npx playwright test tests/ac-01-record.spec.ts` → launch args contain
    `use-file-for-fake-audio-capture=/home/TacticalTaco/school/CS690/group-project/frontend/tests/
    fixtures/tone.wav`, confirming the per-file override reaches Chromium; `npm test` → still
    1 failed, 1 skipped, AC-1 failing at `page.goto` with `net::ERR_CONNECTION_REFUSED at
    http://localhost:5173/` and AC-7 still skipped.

evidence: AC-1 (story S-1), AC-7 (story S-7); handout Deliverables 6b and 6e; commit
  `945971ee137873230ba2029856f757f5990f4a84` (Deliverable 8 requires the SHA of every
  AI-assisted commit).

risk: No frontend application exists, so the suite is red by design and is not passing. AC-7's
  `SUPPORTED_AUDIO_FORMATS` and `MAX_CLIP_DURATION` are unresolved open questions, and its
  "unpublished" assertion is provisional. `MAX_CLIP_DURATION` must be at least 5 seconds when S-7
  open question 2 is settled, otherwise the fixture is not a valid AC-7 Given; the fixture is WAV
  only, so a final `SUPPORTED_AUDIO_FORMATS` that excludes WAV would also invalidate it; the
  469 KiB fixture is no longer at risk of being dropped as generated output, since it is committed
  in `945971e`. `frontend/.gitignore` now exists and covers `node_modules/`, `dist/`, `coverage/`,
  `playwright-report/`, `test-results/`. The root `README.md` currently gives two test commands,
  not the single command Deliverable 6a asks for. Recorded clip length is Record-to-Stop, not the
  5-second fixture length, so no duration assertion is possible; the fixture only guarantees the
  fake device has audio to stream.

## Entry 5

artifact: `docs/plans/S-1-plan.md`

tool: Claude, Sonnet 5.5, November 8, 2026

prompts: I asked Claude to create an implementation plan for S-1 using the design document and AC-1. I asked it to explain which files would need to be created or modified, how the recording data would be stored, and what tasks would be needed to implement the feature. The full prompt is saved in `prompts/S-1-plan.txt`.

review: I reviewed the plan and compared it to the S-1 design document to make sure it followed the requirements. The original plan placed the acceptance test after the implementation tasks, so I moved it earlier to follow the tests-first approach required for the assignment. I also checked that the plan focused on recording audio and did not include unrelated features like publishing, editing, or transcription. The proposed file paths still need to be verified against the repository.

checks: I compared the proposed tasks with S-1 and AC-1. I did not run any implementation tests since this was only the planning stage.

evidence: S-1, AC-1, E-12, E-13

risk: The maximum recording duration, recording format, and handling of interrupted recordings are still unresolved. The proposed file paths also need to be confirmed before implementation begins.

## Entry 6

artifact: contents of frontend/src, frontend/docs, and frontend/dev-server.mjs, at commit ccced50b6427c707bd818bf09b3c27a0ebadf634
tool: Antigravity, Gemini 3.8 Flash, 11/9/26
prompts: prompts/S-01.md
review: Read the prompts for cmd access in antigravity, and verify that the commands executed match the expected outcomes.
checks: ran the tests in frontend/tests and validated the tests for the changes made pass and the remaining tests were skipped
evidence: docs/design/S-1.md, frontend/tests/ac-01-record.spec.ts
risk: Frontend will need additional updates once the backend is implemented.

## Entry 7

artifact: frontend/index.html, frontend/vite.config.ts, frontend/package.json, frontend/playwright.config.ts, frontend/package-lock.json — uncommitted working tree at 2026-11-09.

tool: omp agent session, model bifrost/opencode-go/deepseek-v4.1-flash, 2026-11-09; npm 11.20.0; Vite 8, @vitejs/plugin-react 6, React 19.

prompts: No operator prompt for the remediation itself; the operator asked where the ledger was stored, and the pull exposed a wiring defect. The action taken was to wire the stack already declared in README.md and AGENTS.md (React, TypeScript, Vite). Prompt record: `prompts/05-vite-wiring.md`.

review: Inspected the pulled S-1 implementation. Found `index.html` loading `/main.js`, which the static `dev-server.mjs` answered with `index.html` (200, `text/html`), so no module executed and the recorder never mounted; the AC-1 test timed out waiting for the Record button. Chose to use the declared React/Vite stack rather than the vanilla `main.ts`/`AudioRecorderVanilla.ts` path, because README.md and AGENTS.md both name React, TypeScript and Vite. Changed the entry script to `/src/main.tsx`, added `vite.config.ts` with the React plugin, added `dev`/`build`/`preview` scripts, and added a Playwright `webServer` so one command starts the app. Did not modify `src/audio/recorder.ts` or the React component logic.

checks: Before the fix, with `node dev-server.mjs` running: `curl -I /main.js` returned 200 `text/html`; `npx playwright test` failed with `locator.click: Test timeout of 30000ms exceeded` waiting for `/^record/i`. After the fix: `npm test` → 1 passed, 1 skipped; `test_ac1_record_and_stop_displays_playback` passed in 349 ms, `test_ac7_valid_audio_upload_displays_playback` skipped with its AC-7 reason.

evidence: AC-1 (story S-1); handout Deliverables 6b, 6e, 6a (single test command).

risk: Not committed at the time of writing, so no SHA can be named yet; `npm run build` and a type check were not run; `src/main.ts` and `src/components/AudioRecorderVanilla.ts` are now dead code; dependency versions resolved by npm are not pinned beyond the lockfile; the suite is green only for AC-1, and AC-7 remains skipped.

## Entry 8

artifact: Interview 2
prompts: Look at interview 2 and number the paragraphs in each set of notes P01, P02
review: used an online diff tool to check only the paragraph numbering changes.
checks: manual review
evidence: Interview 2
risk: None

## Entry 9

artifact: Interview 1
prompts: Look at interview 1 and number the paragraphs in each set of notes P01, P02
review: used an online diff tool to check only the paragraph numbering changes.
checks: manual review
evidence: Interview 1
risk: None


## Entry 10

artifact: AGENTS.md
prompts: Make a AGENTS.md
Include standing instructions for your AI coding tool. At a minimum: the language and framework, the test command, the files and folders the agent must not change, and the rule that it shows a plan and waits for approval before editing.
review: reviewed AGENTS.md to verify it included the required standing instructions.
checks: manual review
evidence: Milestone 1 step 6A
risk: None

## Entry 11

artifact: README.md
prompts: prompts/readme.md
Include standing instructions for your AI coding tool. At a minimum: the language and framework, the test command, the files and folders the agent must not change, and the rule that it shows a plan and waits for approval before editing.
review: reviewed README.md to verify it included the required standing instructions.
checks: manual review
evidence: README.md
risk: None
