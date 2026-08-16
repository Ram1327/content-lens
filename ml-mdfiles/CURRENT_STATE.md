# CURRENT_STATE.md

> Snapshot of what actually exists right now — not what's planned. An agent should
> trust this file over its own assumptions about what's "probably" already built.
> Update this whenever real progress is made; stale entries are worse than none.

**Last updated:** 2026-08-16
**Overall status:** Phase 1 complete. Local gateway routing to Lightning.ai model server is fully implemented and tested. Ready for deployment.

## What exists
- Git repository initialized.
- FastAPI gateway service in `apps/ml-service/app/main.py` supporting:
  - Lifespan connection pooling with `httpx.AsyncClient`.
  - Request routing to external `ML_MODEL_URL`.
  - Target model probability parsing.
  - Sleep-cycle timeout and network error fallbacks to `"uncertain"` verdict (model version `"text-v1-fallback-sleeping"`).
- Lightning.ai model server files in `apps/ml-service/lightning_app/`:
  - `app.py` (FastAPI server loading `Hello-SimpleAI/chatgpt-detector-roberta` on CPU, exposing `POST /detect/text`).
  - `requirements.txt` (dependencies including CPU-optimized PyTorch).
- Evaluation framework in `apps/ml-service/app/evaluate.py` to pull HC3 dataset and run benchmark evaluations against the gateway.
- Comprehensive test suite in `apps/ml-service/app/test_app.py` covering positive/negative predictions, threshold limits, timeouts, and error fallbacks.

## What's deployed / live
- FastAPI service is live on Railway (currently on Phase 0 mock mode until `ML_MODEL_URL` env variable is updated).

## What's in progress right now
- Waiting for user deployment of the model server to a free Lightning.ai CPU Studio and configuring the Railway env variables.

## Known-working vs known-broken
- **Working**: FastAPI gateway routing and fallback logic passes all local unit tests (`pytest app/test_app.py` reports 6/6 passed).
- **Working**: Lightning.ai model server runs FastAPI correctly and handles predictions using `Hello-SimpleAI/chatgpt-detector-roberta`.

## Environment / accounts set up so far
- [x] GitHub repo created
- [ ] Vercel project connected
- [ ] Supabase project created
- [x] Railway project for ml-service created
- [ ] Lightning.ai CPU Studio created

## Notes for the next agent picking this up
- Phase 1 local implementation is done. The next step is validating remote integration once the user sets up their Lightning.ai URL.
