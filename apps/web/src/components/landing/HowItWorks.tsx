import { AlignLeft, Cpu, BarChart3 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Input Text",
      description:
        "Paste any excerpt — from social comments to full articles. Requires at least 10 characters for reliable pattern detection.",
      icon: AlignLeft,
    },
    {
      step: "02",
      title: "Statistical & Pattern Analysis",
      description:
        "Our detection engine evaluates sentence perplexity, burstiness, and structural uniformity characteristic of LLM outputs.",
      icon: Cpu,
    },
    {
      step: "03",
      title: "Confidence Breakdown",
      description:
        "Receive an immediate verdict with confidence probability (0–100%) and model metadata without saving your content.",
      icon: BarChart3,
    },
  ];

  return (
    <section className="space-y-6 pt-8 border-t border-border/60">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          How ContentLens Works
        </h3>
        <p className="text-xs text-muted-foreground">
          Clear, deterministic pipeline designed for maximum transparency
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="group relative rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </div>
                <span className="font-mono text-xs font-semibold text-muted-foreground/60">
                  {item.step}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
