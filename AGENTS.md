# AGENTS.md - Yappify Coding Agent Instructions

These instructions apply to AI coding assistants working anywhere in the Yappify repository.

## Project and technology

Yappify is a CS 690 short-form audio-sharing application. Its core features are publishing audio clips with captions and tags, playing clips in a feed, liking/unliking posts, and following creators and viewing their profiles. Comments are optional and the first feature to cut if needed. Advanced recommendations, direct messaging, and live streaming are out of scope.

- **Frontend:** React 19, TypeScript, and Vite (`frontend/`). Use Playwright for end-to-end/acceptance tests.
- **Backend:** Python and FastAPI (`backend/`, when scaffolded). Use `pytest` for backend tests.
- Preserve the existing architecture, naming conventions, dependencies, and API contracts. Do not introduce another framework or large dependency without approval.

## Repository layout

```text
CS_690_Fall_2026_Yappify/
├── AGENTS.md                  # Coding agent rules and workflow (this file)
├── LEDGER.md                  # Task-by-task execution and verification log (1 entry per task)
├── README.md                  # Project setup and usage documentation
├── docs/
│   ├── backlog.md             # Prioritized task and story backlog
│   ├── traceability.md        # Mapping between user stories, acceptance criteria, plans, and tests
│   ├── design/                # Sprint specs, architecture, and gap-check docs (e.g., S-1.md, S-7.md)
│   ├── evidence/              # Interview notes, transcripts, decisions, and provenance logs
│   ├── plans/                 # Approved task/sprint implementation plans (e.g., S-1-plan.md)
│   └── submission/            # Course submission deliverables
├── frontend/
│   ├── docs/                  # Frontend AC specifications (e.g., AC-01-RECORD.md)
│   ├── src/
│   │   ├── audio/             # Audio recording, encoding, and playback modules
│   │   ├── components/        # UI components
│   │   ├── App.tsx            # Root application component
│   │   └── main.tsx           # Application entry point
│   ├── tests/                 # Existing frontend Playwright specs & fixtures (e.g., ac-01-record.spec.ts)
│   ├── dev-server.mjs         # Custom local dev server helper
│   ├── package.json           # Frontend scripts and dependencies
│   ├── package-lock.json      # Locked frontend dependency tree
│   ├── playwright.config.ts   # Playwright test configuration
│   └── vite.config.ts         # Vite build/dev configuration
├── prompts/                   # Reusable prompt templates for agent workflows
└── tests/
    └── acceptance/            # Canonical acceptance test suites derived from ACs
```

## Exact commands (fresh clone)

Every command below is intended to work from a clean clone of the repository. Whenever setup scripts or dependencies change, re-verify all four steps on a fresh clone before marking the setup task complete.

### Frontend (`frontend/`)

1. **Install dependencies and Playwright browser:**
   ```bash
   cd frontend && npm ci && npx playwright install chromium
   ```
2. **Run the app:**
   ```bash
   cd frontend && npm run dev
   ```
   *(Production build & preview: `cd frontend && npm run build && npm run preview`)*
3. **Run the tests:**
   ```bash
   cd frontend && npm test
   ```
   *(Executes `playwright test` via `package.json`.)*
4. **Run coverage:**
   ```bash
   cd frontend && npm run coverage
   ```
   > **Note:** `frontend/package.json` does not currently define a `"coverage"` script or coverage runner. Before claiming coverage works on a fresh clone, add a `"coverage"` script (e.g., Vitest with `@vitest/coverage-v8` or Playwright V8 coverage collection) and verify `npm run coverage` from a clean install.

### Backend (`backend/` — once scaffolded)

1. **Install dependencies:**
   ```bash
   cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
   ```
2. **Run the app:**
   ```bash
   cd backend && uvicorn app.main:app --reload
   ```
3. **Run the tests:**
   ```bash
   cd backend && python -m pytest
   ```
4. **Run coverage:**
   ```bash
   cd backend && python -m pytest --cov=app --cov-report=term-missing
   ```

## Mandatory approval workflow

**Before editing, creating, deleting, renaming, or formatting any file:**

1. Read the relevant code and documentation without modifying files (check `docs/design/`, `docs/plans/`, `docs/traceability.md`, and `LEDGER.md` first).
2. Show a concise implementation plan identifying the files to change, the intended changes, any risks, and the tests to run.
3. **Stop and wait for explicit user approval.** Do not treat a task request itself as approval to start editing.
4. After approval, make only the approved changes. If the scope changes, present a revised plan and wait for new approval.
5. Report the files changed, tests run, results, and any tests that could not be run. Never claim a test passed unless it was executed successfully.

This requirement applies even to small fixes and documentation edits. Read-only inspection and planning are allowed before approval.

## Testing rules

- **Source of truth:** Tests come from the acceptance criteria (`docs/design/`, `docs/traceability.md`, `frontend/docs/`), **not** from reading or mirroring existing implementation code.
- **Immutability of acceptance tests:** **Never** edit, delete, skip (`test.skip` / `.only`), or weaken a test or assertion in `tests/acceptance/` (or `frontend/tests/ac-*.spec.ts`) to make a test pass. If an acceptance test fails, fix the application code—not the test.
- **Completion gate:** Always run the full test command (`cd frontend && npm test`, plus `cd backend && python -m pytest` once `backend/` exists) and confirm all tests pass **before** reporting any task as done.

## Git and ledger rules

- **One task per commit:** Make exactly one atomic git commit per task. Do not bundle multiple tasks into one commit or split a single task across unrelated commits.
- **Commit message format:** Every commit message must include both the **task number** and the **AC ID** (e.g., `Task 4 (AC-02): add feed audio playback controls`).
- **One ledger entry per task:** Append exactly one entry to `LEDGER.md` per completed task, recording the task number, AC ID, summary of changes, exact test/coverage commands run and their results, and the commit hash/message.

## Protected files and directories

**Do not modify, create replacements for, delete, rename, or auto-format these paths unless the user explicitly authorizes the specific change in the approved plan:**

- `AGENTS.md` — standing agent instructions.
- `README.md` — project setup and usage documentation.
- `tests/acceptance/` and `frontend/tests/ac-*.spec.ts` — acceptance tests derived from ACs.
- `.github/` — workflows and repository automation.
- `frontend/package-lock.json` and other dependency lockfiles — dependency resolution.
- `.env`, `.env.*`, and any secrets, credentials, or private keys — configuration and sensitive data.
- `.venv/`, `node_modules/`, `dist/`, `build/`, `coverage/`, `playwright-report/`, `test-results/`, and `__pycache__/` — local dependencies and generated artifacts.
- `.gitignore` — files ignored by git.

Never print, copy into source code, commit, or disclose secrets. Do not commit generated output or local environment files.

## Coding expectations

- Keep changes small, directly related to the approved task, and compatible with the current frontend/backend interfaces.
- Use typed TypeScript for frontend changes and idiomatic Python/FastAPI for backend changes.
- Add or update unit/integration tests for behavior changes within the approved scope without altering acceptance tests.
- Avoid unrelated refactoring, dependency upgrades, schema changes, and changes to authentication, deployment, or CI unless specifically approved.
- Respect the project scope and prioritize reliable audio playback and persistence.

If these instructions conflict with an explicit user request, present the conflict in the plan and request approval before proceeding.