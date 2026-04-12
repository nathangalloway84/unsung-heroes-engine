# Unsung Heroes Engine

The Unsung Heroes Engine is an enterprise-grade web application built to surface the "Hidden Grind" of non-mainstream Olympic and Paralympic sports. Developed as part of a high-stakes hackathon, the platform utilizes Google Cloud's official Gemini Generative AI SDK governed by a strict zero-trust evaluation pipeline.

## Architectural Overview

* **The Dossier Noir Dashboard (Frontend):** A Next.js 15, React 19 application styled natively via Tailwind v4's CSS mapping configuration. It adheres to strict Semantic HTML primitives and Mobile-First responsive boundaries. 
* **The Telemetry Engine (Backend):** A Node.js Express server decoupling logical formatting and Google Cloud security provisioning from the client-side browser.
* **The Monorepo Engine Layer:** Orchestrated seamlessly via a root `package.json` leveraging `concurrently` and `npm workspaces` for high-velocity local "hot swappable" compilation pipelines.
* **Serverless Containerization (Cloud Run):** Decoupled Dockerfile schemas mapped strictly targeting the Root Context for autonomous Google Cloud Run deployment mirroring.

## Strict Generative AI Governance
This repository has implemented programmatic constraints upon the usage of Neural networking parameters:
1. **Name, Image, and Likeness (NIL) Nullification:** Total prohibition of evaluating or outputting distinct athlete identities.
2. **Conditional Phrasing Compliance:** Rigid restriction on deterministic performance guarantees (requiring words such as "could lead to").

## Getting Started

Review the strict workflow protocols located inside `CONTRIBUTING.md` prior to branching.

**Boot Sequence:**
1. Supply environment variable `.env` configs (refer to `.env.example`).
2. Install Monorepo Dependencies:
   ```bash
   npm install
   ```
3. Run Local Dashboard & Telemetry Server Parallelly:
   ```bash
   npm run dev
   ```

## Documentation
- Component / UI Schema Standards: `.agents/rules/`
- SDLC Automated Checklists: `.agents/workflows/`
- API Payload Architecture: `api/README.md`
