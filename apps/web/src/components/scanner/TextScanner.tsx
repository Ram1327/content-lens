"use client";

import { useState } from "react";
import { useDetectText } from "@/hooks/useDetectText";
import { ResultCard } from "@/components/result/ResultCard";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Clipboard,
  Trash2,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";

const SAMPLES = {
  ai: "Furthermore, the multifaceted nature of artificial intelligence serves as a testament to modern computational advances, playing a pivotal role in transforming digital communication and shaping future workflows.",
  human:
    "Honestly wasn't sure if this would work so well haha! Tried running a couple test runs with my roommate earlier and the results were pretty clean.",
};

export function TextScanner() {
  const [inputText, setInputText] = useState("");
  const { detect, isLoading, error, result, rateLimit, reset, clearError } = useDetectText();

  const handleSampleClick = (type: "ai" | "human") => {
    setInputText(SAMPLES[type]);
    clearError();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        clearError();
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleClear = () => {
    setInputText("");
    clearError();
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    await detect(inputText);
  };

  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const isTooShort = charCount > 0 && charCount < 10;
  const isTooLong = charCount > 25000;
  const canSubmit = charCount >= 10 && !isTooLong && !isLoading;

  // If a result is available, show the ResultCard
  if (result) {
    return (
      <div className="space-y-6">
        <ResultCard
          result={result}
          onReset={() => {
            reset();
            setInputText("");
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
            <Sparkles className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Text Detector</h2>
            <p className="text-[11px] text-muted-foreground">
              Paste articles, blogs, comments, or essays to check for AI generation
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-medium text-muted-foreground mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => handleSampleClick("ai")}
            className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-accent transition-colors"
          >
            Sample AI
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick("human")}
            className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-accent transition-colors"
          >
            Sample Human
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative rounded-xl border border-input bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (error) clearError();
            }}
            placeholder="Paste or type text to analyze (minimum 10 characters)..."
            rows={7}
            className="w-full resize-none bg-transparent p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 outline-none"
            maxLength={25000}
            disabled={isLoading}
          />

          {/* Bottom Bar inside Textarea container */}
          <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-3.5 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="size-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>

              {inputText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 hover:text-destructive transition-colors"
                  title="Clear text"
                >
                  <Trash2 className="size-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>

            {/* Word and Character Count */}
            <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
              <span>{wordCount} words</span>
              <span>•</span>
              <span className={isTooShort ? "text-amber-600 font-medium" : ""}>
                {charCount}/25,000 chars
              </span>
            </div>
          </div>
        </div>

        {/* Warning if too short */}
        {isTooShort && (
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="size-3.5" />
            <span>Please enter at least 10 characters for reliable analysis.</span>
          </p>
        )}

        {/* Error message alert */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Unable to analyze</p>
              <p className="text-destructive/90">{error}</p>
            </div>
          </div>
        )}

        {/* Action Controls & Rate Limit quota info */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
          {/* Rate Limit / Free Tier info */}
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
            disabled={!canSubmit}
            size="lg"
            className="w-full sm:w-auto min-w-[150px] font-semibold gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Analyzing text...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Scan for AI</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
