# AGENTS.md - Yappify Coding Agent Instructions

These instructions apply to AI coding assistants working anywhere in the Yappify repository.

## Project and technology

Yappify is a CS 690 short-form audio-sharing application. Its core features are publishing audio clips with captions and tags, playing clips in a feed, liking/unliking posts, and following creators and viewing their profiles. Comments are optional and the first feature to cut if needed. Advanced recommendations, direct messaging, and live streaming are out of scope.

- **Frontend:** React, TypeScript, and Vite (`frontend/`). Use Playwright for frontend/end-to-end tests.
- **Backend:** Python and FastAPI (`backend/`). Use pytest for backend tests.
- Preserve the existing architecture, naming conventions, dependencies, and API contracts. Do not introduce another framework or large dependency without approval.

## Mandatory approval workflow

**Before editing, creating, deleting, renaming, or formatting any file:**

1. Read the relevant code and documentation without modifying files.
2. Show a concise implementation plan identifying the files to change, the intended changes, any risks, and the tests to run.
3. **Stop and wait for explicit user approval.** Do not treat a task request itself as approval to start editing.
4. After approval, make only the approved changes. If the scope changes, present a revised plan and wait for new approval.
5. Report the files changed, tests run, results, and any tests that could not be run. Never claim a test passed unless it was executed successfully.

This requirement applies even to small fixes and documentation edits. Read-only inspection and planning are allowed before approval.

## Tests

To run tests, run `python -m pytest` in `backend/` and `npx playwright test` in `frontend/`. Run it after approved code changes when the environment supports it. If either suite needs running services, use the repository's existing Playwright/server configuration; do not silently reconfigure infrastructure.

## Protected files and directories

**Do not modify, create replacements for, delete, rename, or auto-format these paths unless the user explicitly authorizes the specific change in the approved plan:**

- `AGENTS.md` - standing agent instructions.
- `README.md` - project setup and usage documentation.
- `.github/` - workflows and repository automation.
- `frontend/package-lock.json` and other dependency lockfiles - dependency resolution.
- `.env`, `.env.*`, and any secrets, credentials, or private keys - configuration and sensitive data.
- `.venv/`, `node_modules/`, `dist/`, `build/`, `coverage/`, `playwright-report/`, `test-results/`, and `__pycache__/` - local dependencies and generated artifacts.
- `.gitignore` - files ignored by git

Never print, copy into source code, commit, or disclose secrets. Do not commit generated output or local environment files.

## Coding expectations

- Keep changes small, directly related to the approved task, and compatible with the current frontend/backend interfaces.
- Use typed TypeScript for frontend changes and idiomatic Python/FastAPI for backend changes.
- Add or update appropriate Playwright or pytest tests for behavior changes, within the approved scope.
- Do not remove or weaken tests to obtain a passing result.
- Avoid unrelated refactoring, dependency upgrades, schema changes, and changes to authentication, deployment, or CI unless specifically approved.
- Respect the project scope and prioritize reliable audio playback and persistence.

If these instructions conflict with an explicit user request, present the conflict in the plan and request approval before proceeding.
