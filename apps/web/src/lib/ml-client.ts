import type { DetectTextRequest, DetectTextResponse } from "@content-lens/shared-types";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

if (!ML_SERVICE_URL) {
  // Warn at module load time so misconfiguration is obvious in logs.
  console.warn("[ml-client] ML_SERVICE_URL is not set — requests will fail.");
}

/**
 * Send text to the ML service for AI detection.
 * Throws if the request fails or the response is not ok.
 */
export async function detectText(
  payload: DetectTextRequest
): Promise<DetectTextResponse> {
  const url = `${ML_SERVICE_URL}/detect/text`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // Abort if the ML service takes longer than 15 s (cold-start on free tier)
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ML service error ${res.status}: ${text}`);
  }

  return res.json() as Promise<DetectTextResponse>;
}
