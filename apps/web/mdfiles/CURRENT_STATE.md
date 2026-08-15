# CURRENT_STATE.md

> Snapshot of what actually exists right now — not what's planned. An agent should
> trust this file over its own assumptions about what's "probably" already built.
> Update this whenever real progress is made; stale entries are worse than none.

**Last updated:** 2026-08-15
**Overall status:** Phase 1 (Text Detection MVP) Complete — fully working frontend, API routes, rate-limiting, and UI verified.

## What exists

- GitHub repo initialized and synced: https://github.com/Ram1327/content-lens
- Full monorepo folder skeleton (`apps/web`, `apps/ml-service`, `packages/shared-types`, `docs/`)
- Next.js 16 (App Router + TypeScript + Tailwind v4) scaffolded in `apps/web`
- `packages/shared-types/src/index.ts` — API contract types (`DetectTextRequest`, `DetectTextResponse`, `Verdict`)
- `apps/web/prisma/schema.prisma` — `RateLimit` model active and migrated to Supabase Postgres (`20260815135609_init`)
- `apps/web/src/lib/rate-limit.ts` — 10 checks/day per IP rate-limiting with rolling 24-hour window
- `apps/web/src/lib/ml-client.ts` — typed fetch client forwarding to ML service with robust dev mock fallback
- `apps/web/src/app/api/detect/text/route.ts` — full text detection API endpoint with validation and rate limiting
- `apps/web/src/app/api/health/route.ts` — health check endpoint
- `apps/web/src/hooks/useDetectText.ts` — custom React hook managing text scanning lifecycle, errors, and quota
- `apps/web/src/components/layout/Navbar.tsx`, `Footer.tsx`, `PageShell.tsx`
- `apps/web/src/components/scanner/TextScanner.tsx` — interactive text scanner with presets, counters, and clipboard actions
- `apps/web/src/components/result/ResultCard.tsx`, `VerdictBadge.tsx`, `ConfidenceBar.tsx` — result presentation and explanation
- `apps/web/src/components/landing/Hero.tsx`, `HowItWorks.tsx`, `ContentTypePicker.tsx`
- `apps/web/src/app/page.tsx` — complete interactive landing page
- `apps/web/src/app/detect/text/page.tsx` — dedicated text scanner route
- GitHub Actions CI (`web-ci.yml`) — configured with Node 22 + pnpm 11 + Prisma client generation

## What's deployed / live

- Supabase Database: Live with `RateLimit` table.
- Vercel: Ready to auto-deploy commits from `main`.

## What's in progress right now

- Phase 1 complete and verified. Ready for ML-service integration (Phase 1 ML) and Phase 2 (Image Detection).

## Known-working vs known-broken

- `pnpm install` — ✅ working
- `tsc --noEmit` — ✅ passing with 0 errors
- `eslint` — ✅ passing with 0 warnings
- `next build` — ✅ production build optimized (7/7 routes static/dynamic)
- `next dev` & `POST /api/detect/text` — ✅ verified working with live Supabase DB queries

## Environment / accounts set up so far

- [x] GitHub repo created → https://github.com/Ram1327/content-lens
- [x] Supabase project created & first Prisma migration run
- [ ] Vercel project connected
- [ ] Render/Railway/Cloud Run project for ml-service created

## Notes for the next agent picking this up

- All Phase 1 web components are functional, fully typed, and verified against the API contract.
- When `apps/ml-service` is live, setting `ML_SERVICE_URL` in `.env.local` switches seamlessly from local fallback to the real ML model.
