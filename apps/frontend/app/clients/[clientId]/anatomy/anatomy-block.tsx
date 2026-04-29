"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Markdown } from "@/components/markdown";
import {
  deleteAnatomyBlock,
  moveAnatomyBlock,
  saveAnatomyBlock,
} from "./actions";
import type { OperationsBlock } from "@/lib/types";

const PLACEHOLDER = `Write markdown here.

Headings, **bold**, lists, links, GFM tables, and \`\`\`mermaid\`\`\` diagrams all render.`;

export function AnatomyBlockCard({
  block,
  clientId,
  isFirst,
  isLast,
}: {
  block: OperationsBlock;
  clientId: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(block.content_md.trim().length === 0);
  const [draft, setDraft] = useState(block.content_md);

  if (editing) {
    return (
      <div className="border border-brass/40 bg-ink p-4">
        <form
          action={async (fd) => {
            await saveAnatomyBlock(fd);
            setEditing(false);
          }}
        >
          <input type="hidden" name="id" value={block.id} />
          <input type="hidden" name="client_id" value={clientId} />
          <textarea
            name="content_md"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={Math.max(6, draft.split("\n").length + 1)}
            className="block w-full resize-y border border-hairline bg-slate px-3 py-2 font-mono text-[13px] leading-relaxed text-paper placeholder:text-paper-dim/70 focus:border-brass focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] text-paper-dim">
              Markdown · GFM tables · ` ```mermaid ` for diagrams
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraft(block.content_md);
                  setEditing(false);
                }}
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-paper"
              >
                Cancel
              </button>
              <SaveButton />
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="group border border-hairline bg-ink/60 p-4 transition-colors hover:border-hairline">
      <Markdown source={block.content_md} />
      <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
        <span className="text-[10px] uppercase tracking-[0.18em] text-paper-dim">
          {new Date(block.updated_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-3">
          <form action={moveAnatomyBlock}>
            <input type="hidden" name="id" value={block.id} />
            <input type="hidden" name="client_id" value={clientId} />
            <input type="hidden" name="direction" value="up" />
            <button
              type="submit"
              disabled={isFirst}
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-paper disabled:opacity-30"
            >
              ↑
            </button>
          </form>
          <form action={moveAnatomyBlock}>
            <input type="hidden" name="id" value={block.id} />
            <input type="hidden" name="client_id" value={clientId} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              disabled={isLast}
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-paper disabled:opacity-30"
            >
              ↓
            </button>
          </form>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass transition-colors hover:text-brass-bright"
          >
            Edit
          </button>
          <form action={deleteAnatomyBlock}>
            <input type="hidden" name="id" value={block.id} />
            <input type="hidden" name="client_id" value={clientId} />
            <button
              type="submit"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-brass-bright"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-brass/40 bg-brass px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:bg-brass-bright disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}
