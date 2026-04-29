import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 border-b border-hairline pb-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
          <h1 className="font-serif text-[32px] font-medium leading-[1.1] tracking-tight text-paper">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-paper-soft">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}

export function SectionTitle({
  children,
  className,
  description,
}: {
  children: ReactNode;
  className?: string;
  description?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-[13px] font-medium tracking-tight text-paper">
        {children}
      </h2>
      {description && (
        <p className="mt-1 text-[12px] text-paper-soft">{description}</p>
      )}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="mt-2 text-[14px] leading-relaxed text-paper">
        {children}
      </div>
    </div>
  );
}
