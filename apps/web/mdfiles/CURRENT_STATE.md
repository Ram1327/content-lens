# CURRENT_STATE.md

> Snapshot of what actually exists right now — not what's planned. An agent should
> trust this file over its own assumptions about what's "probably" already built.
> Update this whenever real progress is made; stale entries are worse than none.

**Last updated:** 2026-08-15
**Overall status:** Phase 0 in progress — scaffolding complete, not yet deployed.

## What exists

- GitHub repo initialized and pushed: https://github.com/Ram1327/content-lens
- Full monorepo folder skeleton (`apps/web`, `apps/ml-service`, `packages/shared-types`, `docs/`)
- Next.js 16 (App Router + TypeScript + Tailwind) scaffolded in `apps/web`
- `packages/shared-types/src/index.ts` — API contract types (DetectTextRequest/Response, Verdict)
- `apps/web/prisma/schema.prisma` — RateLimit model (Phase 1); ScanResult commented out (Phase 3)
- `apps/web/src/lib/utils.ts` — cn(), formatConfidence(), clamp()
- `apps/web/src/lib/prisma.ts` — Prisma singleton
- `apps/web/src/lib/ml-client.ts` — typed fetch wrapper → ML service
- `apps/web/src/app/api/health/route.ts` — GET /api/health
- `apps/web/src/app/layout.tsx` — root layout with metadata
- `apps/web/src/app/page.tsx` — Phase 0 placeholder ("coming soon")
- `apps/web/.env.example` — committed env template
- `.github/workflows/web-ci.yml` and `ml-ci.yml` — CI for both sides
- `pnpm-workspace.yaml` — monorepo workspace config (pnpm 11)
- All deps installed (Next, React, Tailwind, Prisma, clsx, tailwind-merge)
- shadcn/ui initializing

## What's deployed / live

- Nothing deployed yet.

## What's in progress right now

- shadcn/ui init (running)
- `pnpm run dev` sanity check (next)
- Vercel project connection (manual step — Ramsurya does this in browser)
- Supabase project creation + first Prisma migration (manual step — needs DB creds)

## Known-working vs known-broken

- `pnpm install` — ✅ working
- `next dev` — not yet tested

## Environment / accounts set up so far

- [x] GitHub repo created → https://github.com/Ram1327/content-lens
- [ ] Vercel project connected
- [ ] Supabase project created
- [ ] Render/Railway/Cloud Run project for ml-service created

## Notes for the next agent picking this up

- Do NOT re-run `pnpm create next-app` — Next.js is already scaffolded.
- Supabase + Prisma migration cannot run until DATABASE_URL and DIRECT_URL are filled in `.env.local`.
- shadcn components go in `src/components/ui/` — never hand-edit that folder.
- Phase 1 work starts after Vercel deploy is confirmed working.
