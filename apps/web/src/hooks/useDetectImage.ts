"use client";

import { useState, useCallback, useEffect } from "react";
import type { DetectImageResponse } from "@content-lens/shared-types";
import type { RateLimitState } from "./useDetectText";

export interface ExtendedImageResult extends DetectImageResponse {
  previewUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface UseDetectImageResult {
  file: File | null;
  previewUrl: string | null;
  isLoading: boolean;
  error: string | null;
  result: ExtendedImageResult | null;
  rateLimit: RateLimitState | null;
  selectFile: (file: File | null) => void;
  loadSample: (imageUrl: string, fileName: string) => Promise<void>;
  detect: (fileToDetect?: File) => Promise<ExtendedImageResult | null>;
  reset: () => void;
  clearError: () => void;
}

/**
 * Custom hook managing the state, preview lifecycle, and API communication for Image AI detection.
 */
export function useDetectImage(): UseDetectImageResult {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtendedImageResult | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitState | null>(null);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const selectFile = useCallback((newFile: File | null) => {
    setError(null);
    if (!newFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(newFile);
    const objectUrl = URL.createObjectURL(newFile);
    setPreviewUrl(objectUrl);
  }, []);

  const loadSample = useCallback(
    async (imageUrl: string, fileName: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const sampleFile = new File([blob], fileName, { type: blob.type || "image/jpeg" });
        setFile(sampleFile);
        setPreviewUrl(imageUrl);
      } catch {
        setError("Failed to load sample image.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const detect = useCallback(
    async (fileToDetect?: File): Promise<ExtendedImageResult | null> => {
      const targetFile = fileToDetect || file;
      if (!targetFile) {
        setError("Please select or upload an image to analyze.");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("image", targetFile);

        const response = await fetch("/api/detect/image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json().catch(() => ({}));

        if (data.rateLimit) {
          setRateLimit(data.rateLimit);
        }

        if (!response.ok) {
          const errorMessage =
            data.error ||
            (response.status === 429
              ? "Daily scan limit reached. Please try again tomorrow."
              : "Failed to analyze image. Please try again.");
          setError(errorMessage);
          return null;
        }

        const fullResult: ExtendedImageResult = {
          verdict: data.verdict,
          confidence: data.confidence,
          model_version: data.model_version,
          details: data.details,
          previewUrl: previewUrl || (targetFile ? URL.createObjectURL(targetFile) : undefined),
          fileName: targetFile.name,
          fileSize: targetFile.size,
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
    },
    [file, previewUrl]
  );

  return {
    file,
    previewUrl,
    isLoading,
    error,
    result,
    rateLimit,
    selectFile,
    loadSample,
    detect,
    reset,
    clearError,
  };
}
