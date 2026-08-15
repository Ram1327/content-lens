import type { DetectTextRequest, DetectTextResponse } from "@content-lens/shared-types";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Send text to the ML FastAPI service for AI detection.
 * If the ML service is offline or unreachable during development,
 * returns a simulated response to allow full UI and pipeline verification.
 */
export async function detectText(
  payload: DetectTextRequest
): Promise<DetectTextResponse> {
  const url = `${ML_SERVICE_URL.replace(/\/$/, "")}/detect/text`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // 15-second timeout to handle free-tier cold-starts
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(`ML service returned ${res.status}: ${errorText}`);
    }

    return (await res.json()) as DetectTextResponse;
  } catch (error: unknown) {
    // In development or if ML service is unreachable, fallback to a local mock response
    const isDev = process.env.NODE_ENV !== "production";
    const allowMock = isDev || process.env.ENABLE_ML_FALLBACK === "true";

    if (allowMock) {
      console.warn(
        `[ml-client] ML service at ${url} unreachable. Using contract-compliant development fallback.`
      );
      return generateMockTextDetection(payload.text);
    }

    throw error;
  }
}

/**
 * Heuristic/mock response for offline testing matching the exact API contract.
 */
function generateMockTextDetection(text: string): DetectTextResponse {
  const words = text.trim().split(/\s+/);
  const lower = text.toLowerCase();

  // Simple heuristic indicators for realistic mock testing
  const aiPhrases = [
    "furthermore",
    "moreover",
    "in conclusion",
    "delve",
    "it is important to note",
    "testament to",
    "tapestry",
    "multifaceted",
    "pivotal role",
  ];

  const matchedPhrases = aiPhrases.filter((phrase) => lower.includes(phrase));

  if (matchedPhrases.length >= 2 || (words.length > 50 && matchedPhrases.length >= 1)) {
    return {
      verdict: "ai_generated",
      confidence: 0.88,
      model_version: "text-v1-dev-mock",
    };
  }

  if (words.length < 15 || lower.includes("haha") || lower.includes("ngl") || lower.includes("lol") || lower.includes("idk")) {
    return {
      verdict: "human",
      confidence: 0.82,
      model_version: "text-v1-dev-mock",
    };
  }

  return {
    verdict: "uncertain",
    confidence: 0.54,
    model_version: "text-v1-dev-mock",
  };
}
