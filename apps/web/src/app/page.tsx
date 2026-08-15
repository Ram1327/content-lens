import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/landing/Hero";
import { TextScanner } from "@/components/scanner/TextScanner";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ContentTypePicker } from "@/components/landing/ContentTypePicker";

export default function HomePage() {
  return (
    <PageShell className="space-y-12">
      {/* Hero Header */}
      <Hero />

      {/* Main Interactive Scanner */}
      <section className="mx-auto max-w-3xl">
        <TextScanner />
      </section>

      {/* How it works pipeline explainer */}
      <HowItWorks />

      {/* Content types roadmap & picker */}
      <ContentTypePicker />
    </PageShell>
  );
}
