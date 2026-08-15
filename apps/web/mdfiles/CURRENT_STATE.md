# CURRENT_STATE.md

> Snapshot of what actually exists right now — not what's planned. An agent should
> trust this file over its own assumptions about what's "probably" already built.
> Update this whenever real progress is made; stale entries are worse than none.

**Last updated:** 2026-08-15
**Overall status:** Phase 0 setup complete (code, DB migrations, build verified) — ready for Vercel deployment & Phase 1.

## What exists

- GitHub repo initialized and pushed: https://github.com/Ram1327/content-lens
- Full monorepo folder skeleton (`apps/web`, `apps/ml-service`, `packages/shared-types`, `docs/`)
- Next.js 16 (App Router + TypeScript + Tailwind v4) scaffolded in `apps/web`
- `packages/shared-types/src/index.ts` — API contract types (DetectTextRequest/Response, Verdict)
- `apps/web/prisma/schema.prisma` — RateLimit model (Phase 1); ScanResult commented out (Phase 3)
- `apps/web/prisma/migrations/20260815135609_init` — first migration applied to Supabase database
- `apps/web/src/lib/utils.ts` — cn(), formatConfidence(), clamp()
- `apps/web/src/lib/prisma.ts` — Prisma singleton
- `apps/web/src/lib/ml-client.ts` — typed fetch wrapper → ML service
- `apps/web/src/app/api/health/route.ts` — GET /api/health
- `apps/web/src/app/layout.tsx` — root layout with metadata
- `apps/web/src/app/page.tsx` — Phase 0 placeholder ("coming soon")
- `apps/web/.env.example` — committed env template
- `apps/web/.env` and `.env.local` — configured with Supabase connection strings (IPv4 compatible session pooler for migrations)
- `.github/workflows/web-ci.yml` and `ml-ci.yml` — CI for both sides
- `pnpm-workspace.yaml` — monorepo workspace config (pnpm 11)
- All deps installed (Next, React, Tailwind, Prisma, clsx, tailwind-merge)
- shadcn/ui initialized (`button.tsx` generated, `globals.css` updated)

## What's deployed / live

- Supabase Database: Migration `20260815135609_init` applied (`RateLimit` table active).
- Web frontend: Pending Vercel project link.

## What's in progress right now

- Vercel project connection (manual step — import repo, set root directory to `apps/web`)

## Known-working vs known-broken

- `pnpm install` — ✅ working
- `next dev` — ✅ verified (boots at localhost:3000 in 5.8s)
- `prisma migrate dev` — ✅ working (migration applied to Supabase Postgres)

## Environment / accounts set up so far

- [x] GitHub repo created → https://github.com/Ram1327/content-lens
- [ ] Vercel project connected
- [x] Supabase project created & first Prisma migration run
- [ ] Render/Railway/Cloud Run project for ml-service created

## Notes for the next agent picking this up

- Next.js and Prisma migrations are verified and working against Supabase.
- When deploying to Vercel, set root directory to `apps/web` and configure environment variables from `.env.example` (including `DATABASE_URL` and `DIRECT_URL`).
- Phase 1 work (Landing page + text scanner UI + Next API route) can begin immediately.
