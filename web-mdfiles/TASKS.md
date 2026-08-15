# TASKS.md — Web/SD

> Web-side tasks only, organized by the phases in PROJECT.md. A phase with no web
> work is left as an empty header on purpose — don't delete it, and don't fill it
> in unless real planning has happened for it.

## Phase 0 — Setup & Contract
- [x] Create GitHub repo, set up monorepo structure (`apps/web`, `apps/ml-service`, `packages/shared-types`)
- [x] Scaffold Next.js (App Router + TypeScript) app in `apps/web`
- [x] Set up TailwindCSS + shadcn/ui
- [x] Deploy a blank Next.js app to Vercel to confirm the pipeline works
- [x] Agree on the `/detect/text` API contract with the ML side, write it into `PROJECT.md`
- [x] Create Supabase project, connect Prisma, run first migration

## Phase 1 — Text Detection MVP
- [x] Build landing page explaining what the tool does
- [x] Build text input form + "Check" button
- [x] Build API route that forwards text to the ml-service `/detect/text` endpoint
- [x] Build result screen (verdict, confidence score, short explanation)
- [x] Add basic IP-based rate limiting (e.g. 10 checks/day)
- [x] Point at the real ml-service endpoint once it's live (start against a mock/dummy response)
- [x] Deploy and test the full pipeline end-to-end

## Phase 2 — Image Detection
- [ ] Build image upload UI
- [ ] Wire uploads to Supabase Storage
- [ ] Call the `/detect/image` endpoint
- [ ] Show result for image scans (reuse the result screen component if possible)

## Phase 3 — History / Auth (optional)
- [ ] Decide whether scan history is worth the added complexity
- [ ] If yes: add auth (Clerk/NextAuth)
- [ ] Build a scan history page
- [ ] Store scan results per user in the DB

## Phase 4 — Video Detection (stretch)
- [ ] Build video upload UI
- [ ] Handle the async job — queue the request, poll (or subscribe) for the result instead of blocking
- [ ] Show processing progress + final result

## Phase 5 — Chrome Extension (stretch)
- [ ] Scaffold the extension project
- [ ] Build popup UI that reuses the existing API
- [ ] Add "scan selected text on page" feature
- [ ] Test as an unpacked extension

## Phase 6 — Website "vibe-check" (stretch, low priority)
- [ ] (empty — not yet planned)
