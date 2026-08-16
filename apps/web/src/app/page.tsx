import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/landing/Hero";
import { HomeScannerTabs } from "@/components/scanner/HomeScannerTabs";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ContentTypePicker } from "@/components/landing/ContentTypePicker";

export default function HomePage() {
  return (
    <PageShell className="space-y-12">
      {/* Hero Header */}
      <Hero />

      {/* Main Interactive Scanner Tabs (Text + Image) */}
      <section className="mx-auto max-w-3xl">
        <HomeScannerTabs />
      </section>

      {/* How it works pipeline explainer */}
      <HowItWorks />

      {/* Content types roadmap & picker */}
      <ContentTypePicker />
    </PageShell>
  );
}
