import { ScanText, ImageIcon, VideoIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ContentTypePicker() {
  const contentTypes = [
    {
      title: "Text Detection",
      phase: "Phase 1 • Live",
      description: "Analyze comments, blogs, essays, and long-form articles.",
      icon: ScanText,
      status: "active",
      href: "/detect/text",
    },
    {
      title: "AI Image Detection",
      phase: "Phase 2 • Up Next",
      description: "Detect synthetic artifacts from Midjourney, Stable Diffusion, and DALL-E.",
      icon: ImageIcon,
      status: "upcoming",
    },
    {
      title: "Deepfake & Video",
      phase: "Phase 4 • Stretch Goal",
      description: "Frame-by-frame temporal consistency checks for generated video clips.",
      icon: VideoIcon,
      status: "upcoming",
    },
  ];

  return (
    <section className="space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Content Detection Suite</h3>
          <p className="text-xs text-muted-foreground">Multi-modal roadmap and scanner features</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {contentTypes.map((item) => {
          const Icon = item.icon;
          const isActive = item.status === "active";

          const CardContent = (
            <div
              className={`rounded-2xl border p-4 transition-all ${
                isActive
                  ? "border-primary/40 bg-card hover:border-primary/60 hover:shadow-xs cursor-pointer"
                  : "border-border/60 bg-muted/20 opacity-70 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.phase}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                {isActive && <ArrowUpRight className="size-3.5 text-muted-foreground" />}
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          );

          if (isActive && item.href) {
            return (
              <Link key={item.title} href={item.href}>
                {CardContent}
              </Link>
            );
          }

          return <div key={item.title}>{CardContent}</div>;
        })}
      </div>
    </section>
  );
}
