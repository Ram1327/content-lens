"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ScanText, ImageIcon, VideoIcon } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isText = pathname === "/" || pathname.startsWith("/detect/text");
  const isImage = pathname.startsWith("/detect/image");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/10 transition-transform group-hover:scale-105">
            <Sparkles className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">ContentLens</span>
            <span className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground">
              AI Content Detector
            </span>
          </div>
        </Link>

        {/* Content Type Nav Badges */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1 text-xs">
          <Link
            href="/detect/text"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors ${
              isText
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ScanText className="size-3.5 text-primary" />
            <span>Text Scan</span>
            <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
              Live
            </span>
          </Link>

          <Link
            href="/detect/image"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors ${
              isImage
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="size-3.5 text-primary" />
            <span>Image Scan</span>
            <span className="rounded-full bg-primary/15 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
              Phase 2
            </span>
          </Link>

          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-muted-foreground opacity-60 cursor-not-allowed"
            title="Video Detection coming in Phase 4"
          >
            <VideoIcon className="size-3.5" />
            <span>Video</span>
            <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-normal">
              Phase 4
            </span>
          </div>
        </nav>

        {/* Right side link */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Ram1327/content-lens"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <GithubIcon className="size-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
