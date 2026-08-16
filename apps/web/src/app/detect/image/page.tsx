import { PageShell } from "@/components/layout/PageShell";
import { ImageScanner } from "@/components/scanner/ImageScanner";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Image Detector — ContentLens",
  description:
    "Detect synthetic artifacts from Midjourney, Stable Diffusion, DALL-E, and generative AI models with high precision.",
};

export default function ImageDetectPage() {
  return (
    <PageShell className="space-y-10">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          AI Image Detector
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Upload or drop any image to inspect frequency artifacts, synthetic noise patterns, and generative markers.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <ImageScanner />
      </div>

      <HowItWorks />
    </PageShell>
  );
}
