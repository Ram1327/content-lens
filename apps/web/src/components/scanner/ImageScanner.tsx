"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDetectImage } from "@/hooks/useDetectImage";
import { ResultCard } from "@/components/result/ResultCard";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  UploadCloud,
  ImageIcon,
  Trash2,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
  FileImage,
} from "lucide-react";

// Sample presets for quick testing (AI-generated vs authentic photography)
const SAMPLE_PRESETS = [
  {
    id: "sample_ai_portrait",
    name: "Sample AI (Midjourney Art)",
    type: "ai",
    // Clean synthetic neon gradient visual
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><defs><radialGradient id='g1' cx='50%25' cy='50%25' r='50%25'><stop offset='0%25' stop-color='%236366f1'/><stop offset='50%25' stop-color='%23a855f7'/><stop offset='100%25' stop-color='%230f172a'/></radialGradient></defs><rect width='600' height='600' fill='url(%23g1)'/><circle cx='300' cy='250' r='120' fill='%23ec4899' opacity='0.7'/><circle cx='260' cy='230' r='15' fill='%23ffffff'/><circle cx='340' cy='230' r='15' fill='%23ffffff'/><path d='M240 320 Q300 370 360 320' stroke='%23ffffff' stroke-width='6' fill='none' stroke-linecap='round'/><text x='300' y='520' font-family='sans-serif' font-size='22' font-weight='bold' fill='%23ffffff' text-anchor='middle'>Synthetic AI Portrait (Prompt: Cyberpunk)</text></svg>",
  },
  {
    id: "sample_human_photo",
    name: "Sample Photo (DSLR RAW)",
    type: "human",
    // Natural landscape optical visual
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><defs><linearGradient id='sky' x1='0%25' y1='0%25' x2='0%25' y2='100%25'><stop offset='0%25' stop-color='%230284c7'/><stop offset='100%25' stop-color='%23bae6fd'/></linearGradient></defs><rect width='600' height='600' fill='url(%23sky)'/><polygon points='50,450 250,200 450,450' fill='%23475569'/><polygon points='220,450 380,260 550,450' fill='%23334155'/><rect y='450' width='600' height='150' fill='%2315803d'/><text x='300' y='540' font-family='sans-serif' font-size='22' font-weight='bold' fill='%23ffffff' text-anchor='middle'>Authentic Landscape Photo (Sony A7 IV)</text></svg>",
  },
];

export function ImageScanner() {
  const {
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
  } = useDetectImage();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global clipboard paste listener (Ctrl+V / Cmd+V)
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const pastedFile = items[i].getAsFile();
          if (pastedFile) {
            selectFile(pastedFile);
            break;
          }
        }
      }
    },
    [selectFile]
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      selectFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      selectFile(selected);
    }
  };

  const handleSampleSelect = async (sample: (typeof SAMPLE_PRESETS)[0]) => {
    await loadSample(sample.dataUrl, `${sample.id}.png`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isLoading) return;
    await detect();
  };

  // If result is ready, display ResultCard
  if (result) {
    return (
      <div className="space-y-6">
        <ResultCard
          result={{
            ...result,
            type: "image",
          }}
          onReset={() => {
            reset();
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-7 space-y-5 transition-all">
      {/* Header & Presets */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ImageIcon className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Image Detector</h2>
            <p className="text-[11px] text-muted-foreground">
              Scan images for Midjourney, Stable Diffusion, DALL-E, and synthetic artifacts
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-medium text-muted-foreground mr-1">Presets:</span>
          {SAMPLE_PRESETS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSampleSelect(sample)}
              className="cursor-pointer rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-accent hover:border-primary/40 active:scale-95 transition-all"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload / Dropzone Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden native file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isLoading}
        />

        {!previewUrl ? (
          /* Dropzone Container */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border/80 hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-primary mb-3">
              <UploadCloud className="size-7" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                <span className="text-primary">Click to upload</span> or drag and drop image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, or WebP (max 10MB) • Supports <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono">Ctrl+V</kbd> paste
              </p>
            </div>
          </div>
        ) : (
          /* Selected Image Preview Box */
          <div className="relative rounded-2xl border border-border bg-background p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Thumbnail */}
              <div className="relative size-32 sm:size-40 overflow-hidden rounded-xl border border-border bg-muted/40 shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* File Info & Action */}
              <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="size-4" />
                  <span>Image ready for analysis</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {file?.name || "Uploaded Image"}
                </h3>
                {file?.size && (
                  <p className="text-xs font-mono text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "image"}
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <FileImage className="size-3.5" />
                    <span>Change Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message display */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Unable to analyze image</p>
              <p className="text-destructive/90">{error}</p>
            </div>
          </div>
        )}

        {/* Action Bar & Rate Limit info */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
          {/* Rate Limit Info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3.5 text-primary" />
            {rateLimit ? (
              <span>
                <strong className="text-foreground">{rateLimit.remaining}</strong> of{" "}
                {rateLimit.limit} daily free scans remaining
              </span>
            ) : (
              <span>10 free scans per day • No sign-up required</span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!file || isLoading}
            size="lg"
            className="w-full sm:w-auto min-w-[160px] font-semibold gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Scanning visual markers...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Scan Image for AI</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
