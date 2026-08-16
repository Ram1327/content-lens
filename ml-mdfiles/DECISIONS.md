# DECISIONS.md

> A running log of decisions and the reasoning behind them, so no one (human or
> agent) re-litigates a settled question or silently reverses it. Append new
> entries at the bottom with a date. Never delete old entries — if a decision is
> reversed, add a new entry saying so and why.

---

### 2026-08-15 — Scope: build one content type end-to-end before adding the next
**Decision:** Text detection (comments + blogs) ships first, fully deployed, before
image work starts. Video, the extension, and the "website vibe-check" are stretch
goals, attempted only if time remains after text + images work.
**Why:** "Detect AI text, images, video, and websites" is really 4-5 separate ML
problems. Building a dumb but fully-wired pipeline for one content type first avoids
both sides building in isolation for weeks and hitting integration hell at the end.

### 2026-08-15 — Monorepo structure
**Decision:** One GitHub repo, `apps/web` and `apps/ml-service` as separate folders,
`packages/shared-types` for the API contract.
**Why:** Two people, two languages (TS + Python), but still want single source of
truth for the API contract and easy coordination without managing two repos.

### 2026-08-15 — Tech stack
**Decision:** Next.js + TypeScript + Tailwind + shadcn/ui (web, on Vercel), FastAPI
(ml-service, on Render/Railway/Cloud Run), Supabase (Postgres + Storage) + Prisma.
**Why:** Reuses stack already shipped before (PrepPilot), minimizing new tools to
learn while also learning Git/deployment workflow for the first time. Supabase
chosen specifically because already familiar with it.

### 2026-08-15 — No paid third-party AI APIs
**Decision:** ML inference must run on self-hosted/open models. No paid detection
APIs (e.g. OpenAI moderation, commercial AI-detector APIs) unless explicitly
revisited here.
**Why:** Keeps the entire project on $0 free tiers. The only realistic way this
project starts costing money is a paid API call per request — avoid that path.

### 2026-08-15 — No user accounts for MVP
**Decision:** MVP is anonymous, rate-limited by IP. Auth (e.g. Clerk/NextAuth) is
optional, added only in Phase 3 if scan history turns out to be worth it.
**Why:** Cuts scope for the first working version. Accounts are easy to bolt on later.

### 2026-08-15 — Git workflow
**Decision:** `main` is always the deployable version. Every task gets its own
branch (`yourname/task-name`), pushed and merged via a Pull Request. No mandatory
formal review given it's a 2-person team — PRs are mainly a checkpoint, not a gate.
**Why:** Both team members are new to Git; a lightweight version of the standard
workflow avoids breaking `main` while not over-engineering process for a 2-person team.

### 2026-08-15 — Frontend data-fetching: plain fetch, not React Query/SWR (for now)
**Decision:** Phase 0/1 uses a thin custom hook (`useDetectText.ts`) wrapping plain
`fetch` with its own loading/error/data state — no React Query or SWR dependency yet.
**Why:** Only one mutation exists this early (`detect text`); adding a data-fetching
library for that is unjustified overhead. Revisit in Phase 3 if scan history needs
real caching/refetching — the custom hook's shape makes that migration small.

### 2026-08-15 — Package manager: pnpm
**Decision:** pnpm for the whole monorepo (`pnpm-workspace.yaml` at the root).
**Why:** Proper workspace support for a multi-package monorepo (`apps/web`,
`apps/ml-service`, `packages/shared-types`); npm and pnpm lockfiles should never be
mixed, so this is committed to explicitly to avoid drift between the two contributors.

### 2026-08-15 — No Turbo for now
**Decision:** Use plain `pnpm -r <script>` across packages instead of Turborepo for
Phase 0/1.
**Why:** Only 2 apps + 1 shared package right now — a build orchestrator isn't
earning its weight yet. Reconsider at Phase 2+ if cross-package build/watch gets slow.

### 2026-08-15 — ML Hosting Platform
**Decision:** Deploy the `apps/ml-service` to Railway.
**Why:** Quick setup, excellent support for Dockerfile deployments, and handles Python/FastAPI environment resources reliably on free/cheap tiers.

### 2026-08-15 — ML Text Detection Benchmark Dataset
**Decision:** Use a combined subset of the DAIGT V4 and HC3 (Human ChatGPT Comparison Corpus) datasets for model evaluation.
**Why:** This combination provides a diverse baseline covering both short-form responses/Q&A (HC3) and multi-model LLM generation (DAIGT V4 includes outputs from GPT-3.5, GPT-4, Claude, Gemini, LLaMA).

### 2026-08-15 — Model Hosting on Hugging Face Spaces (Hybrid Architecture)
**Decision:** Deploy the core text-detection transformer model (RoBERTa-based) on Hugging Face Spaces (using Gradio or FastAPI) instead of running inference directly inside the Railway container. The Railway-based `apps/ml-service` will serve as an API gateway that handles frontend requests, performs validation/authentication, forwards the payloads to Hugging Face Spaces, and formats the output.
**Why:** Railway's free/hobby tier limits memory to 500MB RAM, which is insufficient for loading and running even lightweight RoBERTa models (which typically require 1.5GB–3GB RAM during model load and active inference). Hugging Face Spaces offers free CPU tiers with 16GB RAM, making it ideal for hosting the model, while Railway is excellent for running a lightweight, responsive API gateway.

### 2026-08-16 — Phase 1 hosting pivot to Lightning.ai
**Decision:** Host the RoBERTa model on Lightning.ai (CPU Studio running FastAPI via the API Builder plugin) rather than Hugging Face Spaces (which is now paid for Gradio and Docker SDKs).
**Why:** Keeps the project 100% on the free tier. Waking up the sleeping CPU Studio on demand acts as a serverless deployment, resolving Railway memory limits on a $0 budget.
