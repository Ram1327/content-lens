import type { Verdict } from "@content-lens/shared-types";
import { Bot, UserCheck, HelpCircle, Sparkles, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerdictBadgeProps {
  verdict: Verdict;
  type?: "text" | "image";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VerdictBadge({
  verdict,
  type = "text",
  className,
  size = "md",
}: VerdictBadgeProps) {
  const isImage = type === "image";

  const configs = {
    ai_generated: {
      label: isImage ? "AI-Generated Image" : "Likely AI-Generated",
      icon: isImage ? Sparkles : Bot,
      colors:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60",
      dot: "bg-rose-500",
    },
    human: {
      label: isImage ? "Authentic / Non-AI Image" : "Likely Human-Written",
      icon: isImage ? Camera : UserCheck,
      colors:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60",
      dot: "bg-emerald-500",
    },
    uncertain: {
      label: isImage ? "Inconclusive Image Signals" : "Inconclusive / Mixed",
      icon: HelpCircle,
      colors:
        "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60",
      dot: "bg-amber-500",
    },
  };

  const current = configs[verdict] || configs.uncertain;
  const Icon = current.icon;

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1.5",
    md: "px-3.5 py-1 text-sm gap-2",
    lg: "px-4 py-1.5 text-base gap-2.5 font-semibold",
  };

  const iconSizes = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-all shadow-xs",
        current.colors,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{current.label}</span>
      <span className={cn("size-1.5 rounded-full animate-pulse", current.dot)} />
    </span>
  );
}
