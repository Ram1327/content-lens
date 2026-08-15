# CURRENT_STATE.md

> Snapshot of what actually exists right now — not what's planned. An agent should
> trust this file over its own assumptions about what's "probably" already built.
> Update this whenever real progress is made; stale entries are worse than none.

**Last updated:** 2026-08-15
**Overall status:** Phase 0 complete. FastAPI service scaffolded and verified locally. Ready for deployment.

## What exists
- Git repository initialized.
- FastAPI scaffolding in `apps/ml-service` (including `app/main.py` with mock `GET /` and `POST /detect/text` endpoints).
- Local python virtual environment setup with `fastapi`, `uvicorn`, `pydantic`, and `httpx`.
- Dockerfile for Railway deployment.
- Verification test suite (`apps/ml-service/app/test_app.py`).

## What's deployed / live
- Nothing is deployed anywhere yet.

## What's in progress right now
- Phase 1 research on open-source text-AI-detection baselines.

## Known-working vs known-broken
- **Working**: FastAPI local app with `GET /` and `POST /detect/text` endpoints.
- **Working**: `app/test_app.py` passes all verification checks.

## Environment / accounts set up so far
- [x] GitHub repo created
- [ ] Vercel project connected
- [ ] Supabase project created
- [ ] Render/Railway/Cloud Run project for ml-service created

## Notes for the next agent picking this up
- This is a fresh start. Do not assume any file, route, model, or deployed service
  exists until it's listed above. If you build something, come back and update this
  file so the next session (human or agent) isn't guessing.
