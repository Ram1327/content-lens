"use client";

import { useState, useCallback } from "react";
import type { DetectTextResponse } from "@content-lens/shared-types";

export interface RateLimitState {
  remaining: number;
  limit: number;
  resetAt: string;
}

export interface UseDetectTextResult {
  detect: (text: string) => Promise<DetectTextResponse | null>;
  isLoading: boolean;
  error: string | null;
  result: (DetectTextResponse & { analyzedText?: string }) | null;
  rateLimit: RateLimitState | null;
  reset: () => void;
  clearError: () => void;
}

/**
 * Custom hook managing the state and communication for AI text detection.
 */
export function useDetectText(): UseDetectTextResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<(DetectTextResponse & { analyzedText?: string }) | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitState | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const detect = useCallback(async (text: string): Promise<DetectTextResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/detect/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json().catch(() => ({}));

      // Capture rate limit headers if available
      if (data.rateLimit) {
        setRateLimit(data.rateLimit);
      }

      if (!response.ok) {
        const errorMessage =
          data.error ||
          (response.status === 429
            ? "Daily scan limit reached. Please try again tomorrow."
            : "Failed to analyze text. Please try again.");
        setError(errorMessage);
        return null;
      }

      const fullResult = {
        verdict: data.verdict,
        confidence: data.confidence,
        model_version: data.model_version,
        analyzedText: text,
      };

      setResult(fullResult);
      return fullResult;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Network error. Please check your connection.";
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    detect,
    isLoading,
    error,
    result,
    rateLimit,
    reset,
    clearError,
  };
}
