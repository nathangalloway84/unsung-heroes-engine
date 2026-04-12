# Contributing to Unsung Heroes Engine

Thank you for your interest in contributing. As an enterprise-grade project governed by strict AI reliability rules, all developers are required to adhere to the formalized pipeline outlined below.

## 1. Local Monorepo Environment Setup
This repository uses an **NPM Workspace** configuration to streamline hot-reloading development across the React UI and Node API without navigating multiple directories.
1. DO NOT enter the `ui/` or `api/` directories to install dependencies.
2. From the root directory, execute:
   ```bash
   npm install
   ```
3. To boot both environments synchronously with Hot-Swapping integration, execute:
   ```bash
   npm run dev
   ```

*(Note: Docker Compose is reserved solely for verifying equivalence to Google Cloud Run containerization locally. Routine feature development must use the Monorepo strategy above).*

## 2. Branching Strategy Mandate
Direct modifications to `main` are strictly forbidden. You must proactively branch *before* beginning any development or refactoring:
* `feat/feature-name`
* `fix/bug-fix-name`
* `chore/dependency-updates`
* `refactor/architectural-shift`

## 3. Conventional Commit Protocol
Every commit MUST align with the Conventional Commits specification.
* **Allowed tags:** `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`.
* Example: `feat: implement telemetry visualizer component with pure css animation`

## 4. Test-Driven Development (TDD)
Before you write feature logic, you MUST write automated Jest/Supertest assertions proving boundaries.
* AI integrations explicitly forbid generating performance guarantees. All prompt and return logic must be mocked and proven via conditional phrasing assertions.
* Do not submit a PR if `npm run test -w api` or `npm run lint` yields warnings.

## 5. Human-in-the-Loop (HITL) Handoff
All feature branches require explicit Review Summaries addressing the 16-point Definition of Done detailed in `.agents/rules/definition-of-done.md`. Automated merges are permanently restricted.
