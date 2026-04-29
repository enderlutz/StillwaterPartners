import { cn, progressPct } from "@/lib/utils";
import { Card } from "./card";

type Props = {
  label: string;
  value: string;
  sub?: string;
  progress?: { actual: number; goal: number };
  trend?: "up" | "down" | "flat";
  className?: string;
};

export function KpiCard({
  label,
  value,
  sub,
  progress,
  trend,
  className,
}: Props) {
  const pct = progress
    ? progressPct(progress.actual, progress.goal)
    : undefined;
  const trendColor =
    trend === "up"
      ? "text-brass"
      : trend === "down"
        ? "text-brass-bright"
        : "text-paper-dim";
  const trendChar = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="eyebrow">{label}</div>
        {trend && (
          <span className={cn("text-[10px] tabular-nums", trendColor)}>
            {trendChar}
          </span>
        )}
      </div>
      <div className="mt-3 text-[28px] font-medium leading-none tracking-tight tabular-nums text-paper">
        {value}
      </div>
      {sub && (
        <div className="mt-2 text-[11px] tabular-nums text-paper-soft">
          {sub}
        </div>
      )}
      {pct !== undefined && (
        <div className="mt-4">
          <div className="relative h-px w-full bg-hairline">
            <div
              className="absolute -top-px left-0 h-[1.5px] bg-brass transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex items-baseline justify-between text-[10px] tabular-nums text-paper-soft">
            <span>{pct}%</span>
            <span className="eyebrow">of goal</span>
          </div>
        </div>
      )}
    </Card>
  );
}
