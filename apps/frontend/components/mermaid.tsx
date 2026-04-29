"use client";

import { useEffect, useRef, useState } from "react";

let initialized = false;

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
              fontFamily: "Inter, ui-sans-serif, system-ui",
              fontSize: "13px",
              primaryColor: "#28241F",
              primaryTextColor: "#EFE8DC",
              primaryBorderColor: "#3A352F",
              lineColor: "#C9A66B",
              secondaryColor: "#3A352F",
              tertiaryColor: "#0F0E0C",
              background: "#0F0E0C",
            },
            securityLevel: "strict",
          });
          initialized = true;
        }
        const { svg } = await mermaid.render(
          `m-${Math.random().toString(36).slice(2, 9)}`,
          chart,
        );
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to render diagram.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-3 border-l-2 border-brass-bright bg-brass-bright/[0.05] px-3 py-2 text-[12px] leading-snug text-brass-bright">
        Diagram failed to render: {error}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-4 overflow-x-auto border border-hairline bg-slate p-4"
    />
  );
}
