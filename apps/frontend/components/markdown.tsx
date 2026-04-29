"use client";

import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Mermaid = dynamic(() => import("./mermaid").then((m) => m.Mermaid), {
  ssr: false,
  loading: () => (
    <div className="my-4 border border-hairline bg-slate p-4 text-[12px] italic text-paper-dim">
      Rendering diagram…
    </div>
  ),
});

export function Markdown({ source }: { source: string }) {
  if (!source.trim()) {
    return (
      <p className="text-[13px] italic text-paper-dim">Empty block.</p>
    );
  }
  return (
    <div className="markdown-body space-y-3 text-[14px] leading-relaxed text-paper">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className, children } = props;
            const match = /language-(\w+)/.exec(className || "");
            const lang = match?.[1];
            const isBlock = !!lang;
            const code = String(children ?? "").replace(/\n$/, "");
            if (isBlock && lang === "mermaid") {
              return <Mermaid chart={code} />;
            }
            if (isBlock) {
              return (
                <pre className="overflow-x-auto border border-hairline bg-slate p-3 text-[12px] tabular-nums text-paper">
                  <code className={className}>{children}</code>
                </pre>
              );
            }
            return (
              <code className="rounded-sm bg-slate px-1.5 py-0.5 text-[12px] tabular-nums text-brass">
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="font-serif text-[24px] font-medium tracking-tight text-paper">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-[20px] font-medium tracking-tight text-paper">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-[16px] font-medium text-paper">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="text-[14px] text-paper">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-5 text-[14px] text-paper">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-5 text-[14px] text-paper">
              {children}
            </ol>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-brass underline-offset-4 hover:underline"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="my-2 w-full border-collapse text-[13px]">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-hairline bg-slate px-3 py-2 text-left font-medium text-paper">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-hairline px-3 py-2 text-paper">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-brass/40 pl-3 italic text-paper-soft">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-3 border-hairline" />,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
