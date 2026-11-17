# AGENTS.md - Yappify Coding Agent Instructions

These instructions apply to AI coding assistants working anywhere in the Yappify repository.
## Project and technology
Yappify is a CS 690 short-form audio-sharing application. Core features: publishing audio clips with captions and tags, feed playback, likes/unlikes, following creators, and creator profiles. Comments are optional and first to cut. Advanced recommendations, messaging, and live streaming are out of scope.
- **Frontend:** React 19, TypeScript, Vite (`frontend/`); Playwright for acceptance tests.
- **Backend:** Python, FastAPI (`backend/`, once scaffolded); pytest for backend tests.
- Preserve existing architecture, conventions, dependencies, and API contracts. No new frameworks or large dependencies without approval.
## Repository layout
```text
CS_690_Fall_2026_Yappify/
├── AGENTS.md                 # Agent instructions
├── LEDGER.md                 # Task execution and verification log
├── README.md                 # Setup and usage
├── docs/
│   ├── backlog.md            # Prioritized backlog
│   ├── traceability.md       # Stories, ACs, plans, tests
│   ├── design/               # Sprint specifications
│   ├── evidence/             # Interviews and decisions
│   ├── plans/                # Approved implementation plans
│   └── submission/           # Course deliverables
├── frontend/
│   ├── docs/                 # Frontend AC specifications
│   ├── src/
│   │   ├── audio/            # Recording and playback
│   │   ├── components/       # UI components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/                 # Playwright tests and fixtures
│   ├── dev-server.mjs
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.ts
│   └── vite.config.ts
├── prompts/                  # Agent prompt templates
└── tests/
```
## Exact commands (fresh clone)
Execute and verify each documented command on a fresh clone before claiming it works. Record failures and missing prerequisites. Re-verify affected commands whenever dependencies or setup change.
**Frontend (`frontend/`):**
1. Install: `cd frontend && npm ci && npx playwright install chromium`
2. Run app: `cd frontend && npm run dev`
3. Production: `cd frontend && npm run build && npm run preview`
4. Tests: `cd frontend && npm test`
`npm test` runs Playwright via `package.json`. **Coverage:** No coverage script currently exists in `frontend/package.json`. Do not run or claim frontend coverage until a runner/script is added, documented, and verified on a fresh clone.
**Backend (`backend/`, once scaffolded):**

1. Install: `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
2. Run app: `cd backend && uvicorn app.main:app --reload`
3. Tests: `cd backend && python -m pytest`
4. Coverage: `cd backend && python -m pytest --cov=app --cov-report=term-missing`
Backend commands are provisional until scaffolding exists. Verify each on a fresh clone before claiming success.
## Mandatory approval workflow
**Before editing, creating, deleting, renaming, or formatting any file:**
1. Read relevant code and documentation, especially `docs/design/`, `docs/plans/`, `docs/traceability.md`, and `LEDGER.md`, without modifying files.
2. Present a concise plan listing files, changes, risks, and tests.
3. **Stop and wait for explicit user approval.** A task request alone is not approval.
4. Make only approved changes. Obtain new approval if scope changes.
5. Report files changed, exact tests run, results, and unexecuted tests. Never claim unexecuted tests passed.
This applies to small fixes and documentation edits. Read-only inspection and planning require no approval.
## Testing rules
- **Source of truth:** Derive tests from acceptance criteria in `docs/design/`, `docs/traceability.md`, and `frontend/docs/`, not existing implementation code.
- **Acceptance-test immutability:** Never edit, delete, skip (`test.skip` / `.only`), or weaken tests/assertions in `frontend/tests/ac-*.spec.ts` to make them pass. Fix application code instead.
- **Completion gate:** Run `cd frontend && npm test` and, once backend exists, `cd backend && python -m pytest`. Confirm all tests pass before reporting completion.
## Git and ledger rules
- **One task per commit:** Exactly one atomic git commit per task; do not combine or split unrelated work.
- **Commit format:** Include task number and AC ID, e.g., `Task 4 (AC-02): add feed audio playback controls`.
- **Ledger:** Append exactly one `LEDGER.md` entry per completed task with task number, AC ID, summary, exact test/coverage commands and results, and commit hash/message.
## Protected files and directories
**Do not modify, replace, delete, rename, or auto-format these paths without explicit authorization for the specific change in the approved plan:**
- `AGENTS.md`, `README.md` — agent instructions and documentation.
- `frontend/tests/ac-*.spec.ts` — acceptance tests.
- `.github/`, `.gitignore` — automation and Git configuration.
- `frontend/package-lock.json` and other lockfiles — dependency resolution.
- `.env`, `.env.*`, secrets, credentials, and private keys — sensitive configuration.
- `.venv/`, `node_modules/`, `dist/`, `build/`, `coverage/`, `playwright-report/`, `test-results/`, `__pycache__/` — generated artifacts.

Never disclose or commit secrets, generated output, or local environment files.
## Coding expectations
- Keep changes minimal, approved, and compatible with current interfaces.
- Use typed TypeScript and idiomatic Python/FastAPI.
- Add/update unit or integration tests for behavior changes without altering acceptance tests.
- Avoid unrelated refactoring, upgrades, schema, authentication, deployment, or CI changes.
- Prioritize reliable audio playback and persistence.
- If instructions conflict with a user request, identify the conflict in the plan and obtain approval.
