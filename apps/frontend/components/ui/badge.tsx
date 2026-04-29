import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

// Five-value palette — status hierarchy expressed through luminosity, not hue.
type Variant =
  | "default" //  hot brass — solid, the loudest
  | "muted" //    paper-soft outline — quietest
  | "success" //  brass — solid (good / live / done)
  | "warning" //  brass-dim outline (warn / paused)
  | "danger" //   brass-bright solid (critical / blocked)
  | "info" //     paper-soft outline
  | "outline" //  hairline outline only
  | "brass"; //   brass outline (neutral signal)

const variants: Record<Variant, string> = {
  default: "bg-brass-bright text-ink border border-brass-bright",
  muted: "border border-hairline bg-slate-2 text-paper-soft",
  success: "bg-brass text-ink border border-brass",
  warning: "border border-brass-dim text-brass",
  danger: "bg-brass-bright text-ink border border-brass-bright",
  info: "border border-hairline bg-slate-2 text-paper-soft",
  outline: "border border-hairline text-paper-soft",
  brass: "border border-brass/40 text-brass",
};

export function Badge({
  variant = "muted",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.14em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    not_started: "outline",
    in_progress: "brass",
    blocked: "danger",
    done: "success",
    paused: "warning",
    live: "success",
    draft: "outline",
    ended: "muted",
  };
  const label = status.replace(/_/g, " ");
  return <Badge variant={map[status] ?? "muted"}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, Variant> = {
    low: "outline",
    medium: "brass",
    high: "warning",
    critical: "danger",
  };
  return <Badge variant={map[priority] ?? "muted"}>{priority}</Badge>;
}
