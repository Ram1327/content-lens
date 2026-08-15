# TASKS.md — ML

> ML-side tasks only, organized by the phases in PROJECT.md. A phase with no ML
> work is left as an empty header on purpose — don't delete it, and don't fill it
> in unless real planning has happened for it.

## Phase 0 — Setup & Contract
- [ ] Scaffold FastAPI service in `apps/ml-service`
- [ ] Deploy a "hello world" endpoint to Render/Railway/Cloud Run to confirm the pipeline works
- [ ] Agree on the `/detect/text` API contract with the web side, write it into `PROJECT.md`
- [ ] Decide on a benchmark/eval dataset plan for text detection

## Phase 1 — Text Detection MVP
- [ ] Research existing open-source text-AI-detection approaches as a baseline (perplexity/burstiness features, existing open models)
- [ ] Build or fine-tune a text classifier
- [ ] Wrap the model in a `POST /detect/text` endpoint matching the agreed contract exactly
- [ ] Evaluate accuracy on a small benchmark set
- [ ] Deploy the real model, replacing the earlier dummy/hardcoded response

## Phase 2 — Image Detection
- [ ] Research pretrained image AI-detection approaches (e.g. CLIP-feature-based classifiers, frequency-artifact analysis)
- [ ] Fine-tune / adapt on a real-vs-AI-generated image dataset
- [ ] Wrap the model in a `POST /detect/image` endpoint matching the contract
- [ ] Evaluate accuracy

## Phase 3 — History / Auth (optional)
- [ ] (empty — no ML work needed for this phase)

## Phase 4 — Video Detection (stretch)
- [ ] Sample frames from uploaded video, run each through the image model
- [ ] Add a temporal-consistency check across frames
- [ ] Wrap in a `POST /detect/video` endpoint (async — this will be slow)

## Phase 5 — Chrome Extension (stretch)
- [ ] (empty — the extension reuses the existing API; no new ML work expected)

## Phase 6 — Website "vibe-check" (stretch, low priority)
- [ ] (empty — not yet planned; no established research backs this feature, treat any approach here as experimental)
