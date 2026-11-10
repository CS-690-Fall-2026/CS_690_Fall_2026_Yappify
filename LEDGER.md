# Yappify — Provenance Ledger

Scope: Milestone 1 (Deliverables 2–9). Entries 1–4 record the 6b test-harness work and its evidence; entries 5–6 the S-1 plan and frontend implementation; entries 7–11 the Vite wiring, interview, AGENTS.md and README changes; entry 12 the backlog; entries 13–15 the interview-derived work (2d list, evidence log, transcript) from sessions `01a1a9b4` and `01a1a334`. Format per handout Deliverable 8: artifact, tool, prompts, review, checks, evidence, risk.

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
`2f5af108ba38e123d9aa5df25df64e2c481e4d09`, commit message "Update S-1 and S-7 design docs",
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
- `git clone` to `/home/TacticalTaco/school/CS690/group-project` — HEAD `2f5af101505a2928
782873feda30c808527fa827`
- Earlier, superseded search: `find ~ ...` — no yappify repo; `gh repo list --limit 100` — no
  candidate; `gh repo list md685-njit` — only assignment and lecture repositories;
  `gh api user/repository_invitations` — empty; Drive search for `github.com` — empty; Canvas
  conversations — only a Discord invite, `https://discord.gg/yBYW6h7rW`

evidence: Deliverable 6a (repository: `README.md`, `AGENTS.md`, `docs/design/`,
`docs/plans/`, ledger).

risk: The earlier negative result was wrong, so the other negative results from that same search
session (invitations, Drive search, Canvas conversations) are not evidence of absence. The
clone is at `2f5af10`; that commit's time (`2026-11-07T15:33:28-05:00`, i.e. 20:33:28Z) is ten
seconds before the repo's recorded update `2026-11-07T20:33:38Z`. The remote was checked on
2026-11-08: `git ls-remote origin HEAD refs/heads/*` returned `2f5af108ba38e123d9aa5df25df64e2c481e4d09` for both `HEAD` and `refs/heads/main`, so the remote has not advanced past the
clone.

## Entry 4

artifact: 6b test harness — committed at `e84089ca56e3091fa91bca4cdbc2de5e9e40ec16`
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
built in Milestone 1 (handout 6b)". Committed as `e84089ca56e3091fa91bca4cdbc2de5e9e40ec16`,
2026-11-08 15:08:27 -05:00, subject "add tests for AC-1 and AC-7", on top of `2f5af10`, with
seven files: `frontend/.gitignore` (new, 5 lines), `frontend/package-lock.json`,
`frontend/package.json`, `frontend/playwright.config.ts`,
`frontend/tests/ac-01-record.spec.ts`, `frontend/tests/ac-07-upload.spec.ts`,
`frontend/tests/fixtures/tone.wav` (480,044 bytes). HEAD is now `e84089c`. Fixture checks, run
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
`e84089ca56e3091fa91bca4cdbc2de5e9e40ec16` (Deliverable 8 requires the SHA of every
AI-assisted commit).

risk: No frontend application exists, so the suite is red by design and is not passing. AC-7's
`SUPPORTED_AUDIO_FORMATS` and `MAX_CLIP_DURATION` are unresolved open questions, and its
"unpublished" assertion is provisional. `MAX_CLIP_DURATION` must be at least 5 seconds when S-7
open question 2 is settled, otherwise the fixture is not a valid AC-7 Given; the fixture is WAV
only, so a final `SUPPORTED_AUDIO_FORMATS` that excludes WAV would also invalidate it; the
469 KiB fixture is no longer at risk of being dropped as generated output, since it is committed
in `e84089c`. `frontend/.gitignore` now exists and covers `node_modules/`, `dist/`, `coverage/`,
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

artifact: contents of frontend/src, frontend/docs, and frontend/dev-server.mjs, at commit 7611e754f7ea3ed80c2b2b6ad17de8e43ba8bf56
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

## Entry 12

artifact: Backlog
prompts: prompts/backlog.md
context: Project proposal, interviews
review: reviewed Backlog to verify it matched the project proposal.
checks: manual review of contents
evidence: Backlog in doc
risk: misinterpretation of the project proposal

## Entry 13

artifact: `docs/evidence/compliments-and-predictions.md` (5,085 B) — Deliverable 2d: 1 compliment row (C-1, `INT-01:P65`) and 7 prediction rows (PR-1…PR-7, `INT-01:P21`, `P29`, `P33`, `P55`, `P57`, `P67`, `P68`), plus an exclusion section and the "why the compliment section has one row" explanation. Rulings it is generated from: `docs/evidence/DECISIONS.md` (D-001…D-010, closed); the file was later uploaded to Drive (`20:24:08`, file id `14dsx-NDF9xlWe7IXbfHto-1aV3hElgKG`).

tool: omp assistant session `01a1a9b4-b289-756a-9cda-2695ca3ead41`, provider bifrost, model id `bifrost/opencode-go/deepseek-v4.1-flash`; date of use 2026-11-05 (review loop `03:25:18` → `19:36:51Z`).

prompts: `prompts/prompt-06-handout-and-2d-and-ledger.txt` and `prompts/prompt-07-own-interview.txt`. The per-item questions were `ask` items, not model prompts; their text, options and answers are in `docs/evidence/DECISIONS.md` D-001…D-010 and `docs/evidence/PROVENANCE-TOOLS.md` §5 rows 3-6…3-23.

review: Ten items were presented one at a time, each with its source paragraph quoted verbatim and a recommended option; option A was ruled on every one — D-001 citation scheme, D-002 `INT-01:P21`, D-003 `P29`, D-004 `P33`, D-005 `P55`, D-006 `P57`, D-007 `P65`, D-008 `P67`, D-009 `P68`, D-010 bulk exclusion. The P21 item was asked at `18:55:54.169`, cancelled at `18:58:29.498`, re-asked at `18:59:47.738` and answered A at `19:02:56.566`; the cancelled attempt carried no content and only the re-asked answer is recorded. Across the ten items nothing was corrected and nothing was rejected: every ruling is A, and `docs/evidence/DECISIONS.md` contains no rejected draft and no change of mind. The file was generated from those rulings rather than written independently, and each quotation was checked back against the cited paragraph.

checks: `write` -> `Successfully wrote 5085 bytes to CS690-M1/compliments-and-predictions.md` (19:35:26). Quote verification (`eval`, 19:35:52) against `docs/evidence/INT-04-paragraph-map.md` (69 turns): `rows: 8 | all quotes verbatim in cited paragraph: True | unique sources: 8`, `compliments: 1 predictions: 7`; every row `found=True` — C-1 P65 13:43, PR-1 P21 03:57, PR-2 P29 06:46, PR-3 P33 07:16, PR-4 P55 11:10, PR-5 P57 11:45, PR-6 P67 13:52, PR-7 P68 14:02. Upload verified at `20:24:36`: file id `14dsx-NDF9xlWe7IXbfHto-1aV3hElgKG`, `Markdown compliments-and-predictions.md … 5 KB`.

evidence: INT-01:P21, P29, P33, P55, P57, P65, P67, P68 — all eight marked NOT EVIDENCE in the deliverable, so the list traces to paragraphs but supplies no evidence ID.

risk: Speaker attribution for the male turns rests on question/answer structure, not voice biometrics, so a sentence attributed to Participant A could belong to Luke; the one visibly misattributed row, `P45`, was left uncorrected by ruling D-010 and is unused here, but the same defect may exist in a used row undetected, because nothing in the verification checks who spoke. Completeness of the eight-row set is also unverified: the log proves quote fidelity and unique sources, not that the exclusion set missed nothing.

## Entry 14

artifact: `docs/evidence/evidence-log.md` (5,909 B) — Deliverable 3: 18 `E` entries (`E-1`…`E-18`), 4 `A` entries (`A-1`…`A-4`), 3 `Q` entries (`Q-1`…`Q-3`), over four interviews (`INT-01` and `INT-02` Ben, `INT-03` Joshua, `INT-04` Luke). Supporting maps: `docs/evidence/INT-04-paragraph-map.md` (69 rows), `docs/evidence/INT-03-paragraph-map.md` (12 rows), `docs/evidence/drive/INT-01-ben-notes.txt` (27 paragraphs), `docs/evidence/drive/INT-02-ben-notes.txt` (112 paragraphs). Rulings: `docs/evidence/DECISIONS.md` D-012…D-033, closed.

tool: omp assistant session `01a1a9b4-b289-756a-9cda-2695ca3ead41`, provider bifrost, model id `bifrost/opencode-go/deepseek-v4.1-flash`; `browser-harness` (Brave CDP daemon) for the Drive reads; date of use 2026-11-05 (loop `20:25:25` → `22:23:08`).

prompts: `prompts/prompt-06-handout-and-2d-and-ledger.txt` (the human-in-the-loop method), `prompts/prompt-09-drive-and-evidence-log.txt` (the instruction that started this deliverable, user turn at `19:58:02`), and `prompts/prompt-10-upload-evidence-log.txt` (the Drive upload).

review: 26 items were ruled across D-012–D-033. Option A was taken on every item except two, where the student corrected the content instead of choosing: D-030 (the proposed Q-2 was withdrawn and recorded as `E-18`, from the student's own words "This evidence shows that people send messages to both group chats and one-to-one") and D-031 (the proposed Q-3 was withdrawn and recorded as `A-4`, carrying the student's own scope definition "Except when specified, audio clips is not referring to full songs but can refer to short clips of music"). Nothing was rejected. D-011 settled the interview ID before the loop opened: the student's own interview is `INT-04`, because a teammate's notes already hold `INT-01`. Each entry was presented with its source paragraphs quoted, and the log was generated from the rulings rather than written independently.

checks: Generation (`bash`, `22:21:59`) wrote `evidence/evidence-log.md` (5,909 B on disk). Counts (`awk`, `22:23:08`) -> `A 4`, `Q 3`, `E 18`; owners `Luke 5 / Joshua 2 / Ben 18`. Citation verification ran twice: pass 1 (`22:22:17`) resolved `INT-02` 99, `INT-03` 12, `INT-04` 69 but `INT-01` 0 — E-1…E-6 reported `MISSING paragraph INT-01 P04…P20` because the INT-01 map had been renamed to INT-04; E-7…E-18 `OK`. Pass 2 (`22:22:28`) reparsed from the downloaded notes — `INT-01 paras 27 ['P01'…'P27']`, `INT-02 paras 99` with `missing ['P100'…'P112']` — and printed matching quote fragments for `E-1 P04 OK` … `E-6 P20 OK` plus `Q1a P14 OK`, `Q2a P10 OK`. Every cited paragraph in the log resolves: INT-01 27, INT-02 99 of 112, INT-03 12, INT-04 69.

evidence: E-1…E-18, A-1…A-4, Q-1…Q-3 (`evidence/evidence-log.md`); the paragraph sources are INT-01:P04/P06/P14/P16/P18/P20, INT-02:P13/P15/P19/P40/P42/P48/P52/P58–P63/P65/P89, INT-03:P05/P08/P11, INT-04:P18/P21/P46/P56.

risk: INT-02 paragraphs `P100`–`P112` did not parse in the verification pass — a formatting problem, not missing text — and no entry cites them, so the coverage claim rests on 99 of 112 paragraphs. `E-12` cites the range `INT-02:P58–P63` and `E-18` cites two interviews (`INT-02:P63`; `INT-03:P08`), so neither satisfies the one-paragraph rule used elsewhere; both are deliberate and recorded in D-021 and D-030. Attribution of the male turns in INT-04 is structural (question/answer order), not voice-based, so `INT-04:P21` and `P56` inherit that uncertainty. Fragment matching is substring-based against the transcript text: pass 1 verified quoted fragments for `E-7`…`E-18` against their cited paragraphs and returned OK for all twelve, and pass 2 verified `E-1`…`E-6` after repairing the parser that had keyed on the renamed map, so a claim whose quote is correct but whose paraphrase adds an unsupported clause still passes. The `19:58:02` instruction is saved as `prompts/prompt-09-drive-and-evidence-log.txt`, and the later upload instruction as `prompts/prompt-10-upload-evidence-log.txt`, so the handout's prompts-file requirement is met for this entry.

## Entry 15

artifact: `docs/evidence/transcript/interview_transcript.md` (8,872 B, 83 lines, 69 timed turns) plus the raw machine output `docs/evidence/transcript/tx_small/*.{json,tsv,srt,txt,vtt}`. Supporting audio decodes (`full16k.wav`, `win_out/win.srt`, `~/tmp/diar2.json`, `~/tmp/turns.json`) remain outside the repository.

tool: omp assistant session `01a1a334-5974-700e-bcf1-a3a821db7205`, provider bifrost, model id `bifrost/opencode-go/deepseek-v4.1-flash` (upstream release version not recorded); tools driven from it: `openai-whisper` CLI (`large-v3`, then `small.en`), `ffmpeg`/`ffprobe`, `sherpa-onnx` in `~/tmp/.venv-diar`, `tailscale file get`. Date of use 2026-11-03.

prompts: `prompts/prompt-01-taildrop-audio-check.txt` and `prompts/prompt-03-transcribe-interview.txt` (the two that direct this artifact); `prompts/prompt-02-taildrop-time-window.txt` narrowed the search that located the audio.

review: Human-in-the-loop review, described by the student: the agent submitted evidence recommendations for each part of the transcript with the cited transcript text quoted, and the student reviewed the full content and made the final choices. The resulting rulings are recorded in `docs/evidence/DECISIONS.md`.

checks: `tailscale file get .` -> rc=0, file `2026_10_31_17_39_59_1_yappify_interview.mp3` 13,815,235 B; `ffprobe …` -> `duration=863.452188`, `bit_rate=127999`; `whisper …mp3 --model large-v3 …` -> killed at the 3600 s ceiling, `tx/` empty; `whisper …mp3 --model small.en --language en --fp16 False --output_dir tx_small` -> completed in ~5.5 min, 5 output files on disk; `grep -cE '^[0-9]{2}:[0-9]{2} ' interview_transcript.md` -> 69.

evidence: Deliverable 2c (raw notes with interview and paragraph IDs). The transcript now backs INT-04 in the evidence log, which cites `INT-04:P18`, `P21`, `P46`, `P56`.

risk: Speaker labels are heuristic (per-turn F0 bands plus question/answer structure), not voice biometrics; the male turns (Luke vs Participant A) are the weakest and the file itself marks unverifiable wording with `[?]`. Whether `small.en` mis-transcribed any word that a later evidence entry depends on is unverified — no audio spot-check against `large-v3` exists for the full recording, only for the 00:45–01:35 window (`win_out/win.srt`).

## Entry 16

artifact: docs/design/S-7.md
tool: ChatGPT, 11/8/26
prompts: prompts/S-7-design.txt
review: I reviewed the S-7 design document to make sure it followed the assignment requirements. I checked that it included the problem, scope, non-goals, interface, data, rules, edge cases, decisions, open questions, and acceptance test. I also checked that the requirements matched the S-7 user story about uploading an existing audio file.
checks: Manually reviewed the design document against the assignment instructions and AC-7. No implementation tests were run during the design stage.
evidence: S-7, AC-7, E-8, E-16, A-4
risk: The supported audio formats, maximum clip duration, and rules for uploading copyrighted audio are still unresolved.

## Entry 17

artifact: docs/design/S-1-gap-check.md
tool: Claude, Sonnet 5.5, 11/8/26
prompts: prompts/S-1-gap-check.txt
review: I reviewed the 28 questions Claude generated and compared them with the S-1 design document. I classified the questions as real gaps, separating those that were partially answered from those that were unanswered. I also identified which sections of the design document addressed parts of the questions and what decisions still needed clarification.
checks: Manually reviewed the 28 questions against docs/design/S-1.md. No implementation tests were run for this review.
evidence: S-1, AC-1, E-12, E-13
risk: The maximum recording duration, interrupted recording behavior, recording format, and storage requirements are still unresolved.

## Entry 18

artifact: docs/design/S-7-gap-check.md
tool: Claude, Sonnet 5.5, 11/8/26
prompts: prompts/S-7-gap-check.txt
review: I reviewed the 29 questions Claude generated and compared them with the S-7 design document. I identified which questions were partially answered and which were unanswered. I also checked which sections provided partial answers and documented the decisions or open questions that still need clarification.
checks: Manually reviewed the 29 questions against docs/design/S-7.md. No implementation tests were run for this review.
evidence: S-7, AC-7, E-8, E-16, A-4
risk: Supported audio formats, maximum clip duration, upload validation, and music licensing requirements are still unresolved.

