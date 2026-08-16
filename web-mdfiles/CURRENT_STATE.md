# CURRENT_STATE.md

> Snapshot of what actually exists right now — not what's planned. An agent should
> trust this file over its own assumptions about what's "probably" already built.
> Update this whenever real progress is made; stale entries are worse than none.

**Last updated:** 2026-08-16
**Overall status:** Phase 2 (Image Detection) & Walter AI Failover Complete — fully working Text and Image detection pipelines, API routes, client hooks, failover resiliency, and verified production build.

## What exists

- GitHub repo initialized and synced: https://github.com/Ram1327/content-lens
- Full monorepo folder skeleton (`apps/web`, `apps/ml-service`, `packages/shared-types`, `docs/`)
- Next.js 16 (App Router + TypeScript + Tailwind v4) in `apps/web`
- `packages/shared-types/src/index.ts` — API contract types (`DetectTextRequest`, `DetectTextResponse`, `DetectImageResponse`, `Verdict`)
- `docs/api-contract.md` — Complete specification for `/detect/text` and `/detect/image`
- `apps/web/prisma/schema.prisma` — `RateLimit` model active on Supabase Postgres (`20260815135609_init`)
- `apps/web/src/lib/rate-limit.ts` — 10 checks/day per IP rate-limiting with rolling 24-hour window
- `apps/web/src/lib/ml-client.ts` — Multimodal client with automatic 3-tier failover (Primary FastAPI ML -> Walter AI API -> Contract-compliant dev mock)
- `apps/web/src/app/api/detect/text/route.ts` — Text detection API endpoint with validation and rate limiting
- `apps/web/src/app/api/detect/image/route.ts` — Image detection API endpoint with multipart file validation and rate limiting
- `apps/web/src/app/api/health/route.ts` — health check endpoint
- `apps/web/src/hooks/useDetectText.ts` & `useDetectImage.ts` — custom React hooks managing scan lifecycles and quotas
- `apps/web/src/components/layout/Navbar.tsx` (dynamic active link switcher + dark/light ThemeToggle), `Footer.tsx`, `PageShell.tsx`
- `apps/web/src/components/theme/ThemeToggle.tsx` — persistent zero-flash dark/light mode toggle
- `apps/web/src/components/scanner/TextScanner.tsx` & `ImageScanner.tsx` — interactive scanners with drag-and-drop, clipboard paste, and presets
- `apps/web/src/components/scanner/HomeScannerTabs.tsx` — dual scanner tabs on landing page
- `apps/web/src/components/result/ResultCard.tsx` — unified multimodal result card with confidence bar and preview
- `apps/web/src/app/page.tsx` — landing page with dual scanner tabs
- `apps/web/src/app/detect/text/page.tsx` & `apps/web/src/app/detect/image/page.tsx` — dedicated scan routes
- GitHub Actions CI (`web-ci.yml`) — configured with Node 22 + pnpm 11 + Prisma client generation

## What's deployed / live

- Supabase Database: Live with `RateLimit` table.
- Vercel: Configured to auto-deploy commits from `main`.

## What's in progress right now

- Phase 2 complete and verified on web side. Ready for ML-service image model training (`apps/ml-service`) and Phase 3 planning.

## Known-working vs known-broken

- `pnpm install` — ✅ working
- `tsc --noEmit` — ✅ passing with 0 errors
- `eslint` — ✅ passing with 0 warnings
- `next build` — ✅ production build optimized (9/9 routes static/dynamic)
- `POST /api/detect/text` & `POST /api/detect/image` — ✅ verified working with live Supabase DB queries and failover

## Environment / accounts set up so far

- [x] GitHub repo created → https://github.com/Ram1327/content-lens
- [x] Supabase project created & first Prisma migration run
- [x] Walter AI API key configured for failover resilience
- [ ] Vercel project connected
- [ ] Render/Railway/Cloud Run project for ml-service created

## Notes for the next agent picking this up

- All Phase 1 and Phase 2 web components are functional, fully typed, and verified against the API contract.
- When `apps/ml-service` is live with `/detect/image`, setting `ML_SERVICE_URL` in `.env.local` switches seamlessly from Walter AI / local fallback to the real ML model.
