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
- Python 3.10+ and pip
- git

## Installation

From the repository root:

```bash
# Install frontend packages
cd frontend
npm install
npx playwright install
cd ..

# Create a Python virtual environment
python -m venv .venv

# Activate it (macOS/Linux)
source .venv/bin/activate
# On Windows PowerShell, use: .venv\Scripts\Activate.ps1

# Install backend dependencies (including pytest)
python -m pip install -r backend/requirements.txt
```

## Run the application locally

Start the backend in one terminal (with the virtual environment active):

```bash
cd backend
uvicorn main:app --reload
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

By default, Vite serves the frontend at `http://localhost:5173` and Uvicorn serves the API at `http://localhost:8000`. 

## Run tests

1. **Backend:** `python -m pytest` from `backend/`.
2. **Frontend:** `npx playwright test` from `frontend/`.

The command reports failure if either suite fails. Playwright browser tests may also require the frontend and backend servers to be running, depending on the Playwright configuration; configure Playwright's `webServer` option if you want tests to start the servers automatically.

## Project goals

- Allow users to load the next audio clip in under one second.
- Target at least **90% uptime** after deployment.

## Team

- **Joshua George** - Backend and authentication integration
- **Ben Shuster** - Frontend, interface design, accessibility, and SEO
- **Luke Hill** - DevOps, CI/CD, deployment, and quality assurance
