# Yappify

**Yappify** is a short-form audio-sharing application developed for **CS 690**. Similar to a short-form video feed, Yappify focuses on audio: users can publish short recordings and browse clips from other creators without leaving the feed.

## Features

- Upload and publish audio clips with captions and tags.
- Browse a feed and play audio posts directly in the feed.
- Like and unlike posts, with persistent like counts.
- Follow creators and view their audio posts on their profiles.

## Tech stack

| Layer | Technology | Tests |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite | Playwright |
| Backend | Python, FastAPI | pytest |

## Prerequisites

- Node.js and npm (a current Node.js LTS version is recommended)
- git

## Installation

From the repository root:

```bash
# Install frontend packages
cd frontend
npm install
npx playwright install
cd ..
```

## Run the application locally

The app is frontend-only for now; there is no backend to start. Start the frontend:

```bash
cd frontend
npm run dev
```

Vite serves the app at `http://localhost:5173`.

## Try the story

Start the app with `cd frontend && npm run dev`, then open `http://localhost:5173` in Chrome or another Chromium browser. The page has two sections: **Record an Audio Clip** (S-1, AC-1) and **Upload an Audio Clip** (S-7, AC-7). Nothing is saved: reloading the page clears every clip.

On first load, no clip is shown, Stop is disabled, and the ownership box is unchecked ([01-empty-state.png](evidence/screens/01-empty-state.png)).

### AC-1: record a clip (S-1)

1. Click **Record** and allow microphone access when the browser asks. "Recording in progress..." appears and Stop becomes enabled ([02-ac1-recording.png](evidence/screens/02-ac1-recording.png)).
2. Speak for a few seconds, then click **Stop**. A **Playback** section appears with a Play button, an audio player and the clip duration ([03-ac1-playback.png](evidence/screens/03-ac1-playback.png)). Click **Play** to hear the clip.
3. Error state: block microphone access for the site (or decline the prompt) and click **Record**. The page shows "Microphone access is denied." and no recording starts ([04-ac1-mic-denied.png](evidence/screens/04-ac1-mic-denied.png)).

### AC-7: upload an existing audio file (S-7)

1. Tick **I confirm that I own this audio or have permission to upload it**.
2. Click **Choose File** and pick an MP3, WAV or M4A file that is 60 seconds or shorter and 20 MB or smaller. "Checking audio…" appears briefly and the controls are disabled while the file is checked ([05-ac7-checking.png](evidence/screens/05-ac7-checking.png)).
3. The file name, its duration in `m:ss`, a playable audio player, an **Unpublished** label and a **Remove** button appear ([06-ac7-uploaded.png](evidence/screens/06-ac7-uploaded.png)). Press play on the player to hear the clip. Publishing is out of scope for S-7.
4. Error states (each one shows a message and adds no clip):
   - Leave the ownership box unticked and choose a valid file: "Please confirm that you own this audio or have permission to upload it." ([07-ac7-no-ownership.png](evidence/screens/07-ac7-no-ownership.png)).
   - Choose an unsupported file such as `.ogg`: "Unsupported audio format. Please select MP3, WAV, or M4A." ([08-ac7-unsupported-format.png](evidence/screens/08-ac7-unsupported-format.png)).
   - Choose a file longer than 60 seconds: "Audio clips must be 60 seconds or shorter." ([09-ac7-too-long.png](evidence/screens/09-ac7-too-long.png)).

### How the screenshots were made

All nine screenshots under `evidence/screens/` were captured from the running app with Playwright by `frontend/scripts/capture-screens.mjs` (`cd frontend && npm run dev`, then `node scripts/capture-screens.mjs` in a second terminal). The script checks the page shows the claimed state before each capture. No real microphone or person was involved:

| Screenshot | Simulation used |
| --- | --- |
| 02, 03 | Chromium fake microphone streaming `frontend/tests/acceptance/fixtures/tone.wav`, with microphone permission granted by Playwright |
| 04 | Full Chromium build with a fake microphone and the microphone permission set to "denied" through the DevTools protocol (`Browser.setPermission`) |
| 05 | DevTools CPU throttling (50×) so the brief "Checking audio…" state stays on screen long enough to capture |
| 01, 06–09 | None; 06–09 upload WAV files generated in memory (a synthetic 440 Hz tone) |

## Run tests

1. **Frontend:** `npm test` from `frontend/`. Playwright starts the Vite dev server itself and runs every suite in Chromium: the AC-1 and AC-7 acceptance tests plus the S-7 rule, unit, integration and property tests.
2. **Frontend coverage (optional):** `npm run test:coverage` from `frontend/` fails if S-7 line coverage drops below 80%.

## Project goals

- Allow users to load the next audio clip in under one second.
- Target at least **90% uptime** after deployment.

## Team

- **Joshua George** - Backend and authentication integration
- **Ben Shuster** - Frontend, interface design, accessibility, and SEO
- **Luke Hill** - DevOps, CI/CD, deployment, and quality assurance
