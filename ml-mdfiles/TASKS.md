# TASKS.md — ML

> ML-side tasks only, organized by the phases in PROJECT.md. A phase with no ML
> work is left as an empty header on purpose — don't delete it, and don't fill it
> in unless real planning has happened for it.

## Phase 0 — Setup & Contract
- [x] Scaffold FastAPI service in `apps/ml-service`
- [x] Deploy a "hello world" endpoint to Render/Railway/Cloud Run to confirm the pipeline works
- [x] Agree on the `/detect/text` API contract with the web side, write it into `PROJECT.md`
- [x] Decide on a benchmark/eval dataset plan for text detection

## Phase 1 — Text Detection MVP
- [x] Research existing open-source text-AI-detection approaches and pre-trained RoBERTa-based models (e.g., `roberta-base-openai-detector`)
- [x] Build / adapt a lightweight RoBERTa-based classifier (using `Hello-SimpleAI/chatgpt-detector-roberta`)
- [x] Deploy the model on Lightning.ai (CPU Studio) to handle PyTorch/Transformers RAM requirements (code prepared, awaiting user setup)
- [x] Update `apps/ml-service` on Railway to call the Lightning.ai model API, acting as a gateway and preserving the `/detect/text` contract
- [x] Evaluate model accuracy on the benchmark set (implemented via `app/evaluate.py`)
- [x] Verify the full pipeline: Next.js -> FastAPI (Railway) -> Lightning.ai (Model) (verified via pytest unit tests)

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
