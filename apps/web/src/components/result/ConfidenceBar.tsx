import type { Verdict } from "@content-lens/shared-types";
import { formatConfidence, clamp, cn } from "@/lib/utils";

interface ConfidenceBarProps {
  confidence: number;
  verdict: Verdict;
  className?: string;
}

export function ConfidenceBar({ confidence, verdict, className }: ConfidenceBarProps) {
  const percentage = Math.round(clamp(confidence, 0, 1) * 100);

  const barColors = {
    ai_generated: "bg-gradient-to-r from-rose-500 to-amber-500",
    human: "bg-gradient-to-r from-emerald-400 to-teal-500",
    uncertain: "bg-gradient-to-r from-amber-400 to-zinc-400",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">Model Confidence Level</span>
        <span className="font-semibold tabular-nums text-foreground">
          {formatConfidence(confidence)}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-muted p-0.5 shadow-inner">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            barColors[verdict] || barColors.uncertain
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0% (Low certainty)</span>
        <span>50%</span>
        <span>100% (High certainty)</span>
      </div>
    </div>
  );
}
