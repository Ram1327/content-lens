import { Sparkles, ShieldCheck, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/20 py-8 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary/70" />
          <span className="font-semibold text-foreground">ContentLens</span>
          <span>— Open, free-tier AI content detection.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero text storage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Open self-hosted models</span>
          </div>
          <a
            href="https://github.com/Ram1327/content-lens"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground underline underline-offset-4"
          >
            Source Code
          </a>
        </div>
      </div>
    </footer>
  );
}
