"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  createPat,
  revokePat,
  type PatRow,
} from "./actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TokensClient({
  initialTokens,
  supabaseConfigured,
}: {
  initialTokens: PatRow[];
  supabaseConfigured: boolean;
}) {
  const [tokens, setTokens] = useState<PatRow[]>(initialTokens);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState<{
    plaintext: string;
    name: string;
  } | null>(null);

  function onCreate(form: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createPat(form);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setTokens((prev) => [res.row, ...prev]);
      setJustCreated({ plaintext: res.plaintext, name: res.row.name });
      setName("");
    });
  }

  function onRevoke(id: string) {
    if (!confirm("Revoke this token? Any device using it will lose access immediately.")) return;
    startTransition(async () => {
      const res = await revokePat(id);
      if (!res.ok) {
        setError(res.error ?? "Failed to revoke.");
        return;
      }
      setTokens((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, revoked_at: new Date().toISOString() } : t,
        ),
      );
    });
  }

  return (
    <div className="space-y-6">
      {/* Just-created — show plaintext ONCE */}
      {justCreated && (
        <Card className="border-brass/50 bg-brass/[0.04] p-5">
          <div className="eyebrow-brass">New token</div>
          <p className="mt-2 text-[14px] text-paper">
            Copy this token now — it won&apos;t be shown again.
          </p>
          <div className="mt-3 rounded-sm border border-brass/40 bg-ink p-3 font-mono text-[12px] tracking-tight text-brass break-all">
            {justCreated.plaintext}
          </div>
          <div className="mt-3 text-[12px] text-paper-soft">
            Add it to a device with:
          </div>
          <pre className="mt-2 overflow-auto rounded-sm border border-hairline bg-ink p-3 font-mono text-[11px] leading-relaxed text-paper">
            {`claude mcp add --transport sse client-os \\
  https://<your-railway-url>/mcp \\
  --header "Authorization: Bearer ${justCreated.plaintext}"`}
          </pre>
          <button
            onClick={() => setJustCreated(null)}
            className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-brass hover:underline"
          >
            I&apos;ve copied it · close
          </button>
        </Card>
      )}

      {/* Create form */}
      <Card className="p-5">
        <div className="text-[14px] font-medium text-paper">
          Create a new token
        </div>
        <p className="mt-1 text-[12px] text-paper-soft">
          Each device gets its own token (laptop, school laptop, desktop).
          Revoke instantly if a device is lost.
        </p>
        <form
          action={onCreate}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="block flex-1">
            <span className="eyebrow">Token name</span>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="MacBook · personal"
              required
              className="mt-2 block w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-[14px] text-paper placeholder:text-paper-dim/70 transition-colors focus:border-brass focus:outline-none focus:ring-0"
            />
          </label>
          <button
            type="submit"
            disabled={pending || !supabaseConfigured}
            className="border border-brass/40 bg-brass px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-all duration-300 hover:bg-brass-bright disabled:opacity-50"
          >
            {pending ? "Creating…" : "Create token"}
          </button>
        </form>
        {!supabaseConfigured && (
          <div className="mt-4 border-l-2 border-brass-bright bg-brass-bright/[0.05] px-3 py-2 text-[12px] leading-snug text-brass-bright">
            Supabase isn&apos;t configured. PAT creation needs a real database — set the env vars and restart.
          </div>
        )}
        {error && (
          <div className="mt-4 border-l-2 border-brass-bright bg-brass-bright/[0.05] px-3 py-2 text-[12px] leading-snug text-brass-bright">
            {error}
          </div>
        )}
      </Card>

      {/* Existing tokens */}
      <div>
        <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-paper-dim">
          Your tokens
        </div>
        {tokens.length === 0 ? (
          <Card className="p-5">
            <p className="text-[13px] italic text-paper-dim">
              No tokens yet. Create one above to start chatting with Claude
              from the terminal.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {tokens.map((t) => (
              <Card key={t.id} className="flex items-center justify-between gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[14px] font-medium text-paper">
                      {t.name}
                    </span>
                    {t.revoked_at && <Badge variant="muted">revoked</Badge>}
                    {!t.revoked_at && t.last_used_at && (
                      <Badge variant="success">active</Badge>
                    )}
                    {!t.revoked_at && !t.last_used_at && (
                      <Badge variant="outline">unused</Badge>
                    )}
                  </div>
                  <div className="mt-1 text-[11px] tabular-nums text-paper-dim">
                    Created {formatDate(t.created_at)}
                    {t.last_used_at && ` · Last used ${formatDate(t.last_used_at)}`}
                    {t.revoked_at && ` · Revoked ${formatDate(t.revoked_at)}`}
                  </div>
                </div>
                {!t.revoked_at && (
                  <button
                    onClick={() => onRevoke(t.id)}
                    disabled={pending}
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper-soft transition-colors hover:text-brass-bright disabled:opacity-50"
                  >
                    Revoke
                  </button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
