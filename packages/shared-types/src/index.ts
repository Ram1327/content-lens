// ── API Contract — single source of truth ─────────────────────────────────
// Do NOT change these shapes without updating PROJECT.md and notifying
// the ML side — the FastAPI schemas must mirror these exactly.

// ── Shared verdict type ────────────────────────────────────────────────────
export type Verdict = "ai_generated" | "human" | "uncertain";

// ── POST /detect/text ──────────────────────────────────────────────────────
export interface DetectTextRequest {
  text: string;
}

export interface DetectTextResponse {
  verdict: Verdict;
  /** Probability score in range 0.0 – 1.0 */
  confidence: number;
  model_version: string;
}

// ── POST /detect/image  (Phase 2 — shape TBD, do not add unilaterally) ────
// export interface DetectImageRequest { ... }
// export interface DetectImageResponse { ... }

// ── POST /detect/video  (Phase 4 — async job, shape TBD) ──────────────────
// export interface DetectVideoRequest { ... }
// export interface DetectVideoResponse { ... }
