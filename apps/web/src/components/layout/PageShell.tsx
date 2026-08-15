import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className={cn("flex-1 px-4 py-8 sm:px-6 lg:px-8", className)}>
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
