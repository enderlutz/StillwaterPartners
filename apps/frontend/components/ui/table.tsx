import { cn } from "@/lib/utils";
import type {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

// Tabular Wealth — broadsheet-style table. Top + bottom hairlines,
// no row dividers (let tabular nums do the alignment), brass total rule
// available via `<TBody totalRule>` for ledger-style summaries.
export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto border-y border-hairline">
      <table
        className={cn(
          "w-full text-sm tabular-nums [font-variant-numeric:tabular-nums_lining-nums]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="border-b border-hairline" {...props} />;
}

export function TBody({
  totalRule = false,
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & { totalRule?: boolean }) {
  return (
    <tbody
      className={cn(
        "divide-y divide-hairline/60",
        totalRule && "[&>tr:last-child]:border-t [&>tr:last-child]:border-brass [&>tr:last-child]:bg-brass/[0.04]",
        className,
      )}
      {...props}
    />
  );
}

export function TR({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors duration-200 hover:bg-slate-2/60",
        className,
      )}
      {...props}
    />
  );
}

export function TH({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.16em] text-paper-soft",
        className,
      )}
      {...props}
    />
  );
}

export function TD({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-5 py-4 align-top text-[14px] text-paper", className)}
      {...props}
    />
  );
}
