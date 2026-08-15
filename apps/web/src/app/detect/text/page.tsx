import { PageShell } from "@/components/layout/PageShell";
import { TextScanner } from "@/components/scanner/TextScanner";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text AI Detector — ContentLens",
  description:
    "Check articles, essays, blog posts, and comments for AI generation with high-confidence statistical markers.",
};

export default function TextDetectPage() {
  return (
    <PageShell className="space-y-10">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          AI Text Detector
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Paste any text below to evaluate linguistic uniformity, sentence burstiness, and AI probability.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <TextScanner />
      </div>

      <HowItWorks />
    </PageShell>
  );
}
