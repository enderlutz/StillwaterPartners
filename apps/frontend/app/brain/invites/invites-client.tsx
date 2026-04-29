"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { createInvite } from "./actions";

const initialState = { error: null as string | null, token: null as string | null };

export function InvitesClient({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const [state, formAction] = useFormState(createInvite, initialState);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (state?.token) setCopied(false);
  }, [state?.token]);

  if (state?.token) {
    const url = `${origin}/signup`;
    const message = `You can create your account at:\n${url}\n\nUse this access password: ${state.token}\n\nThe password is one-time-setup — you'll pick your own password right after.`;
    return (
      <div className="space-y-4">
        <div className="border-l-2 border-brass bg-brass/[0.05] px-4 py-3 text-[12px] leading-snug text-brass">
          Invite created. The code is shown <strong>once</strong> — copy it now.
        </div>

        <CopyField label="Signup URL" value={url} />
        <CopyField label="Access password" value={state.token} mono />
        <CopyField
          label="Pre-formatted message"
          value={message}
          multiline
          highlight={!copied}
          onCopied={() => setCopied(true)}
        />

        <div className="pt-2">
          <a
            href="/brain/invites"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass-bright transition-colors hover:text-brass"
          >
            ← Back to all invites
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Client">
          <select
            name="client_id"
            required
            className="block w-full border border-hairline bg-ink px-3 py-2 text-[13px] text-paper focus:border-brass focus:outline-none"
          >
            <option value="">— Pick a client —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Label (optional)">
          <input
            name="label"
            type="text"
            placeholder="e.g. Marketing team"
            className="block w-full border border-hairline bg-ink px-3 py-2 text-[13px] text-paper placeholder:text-paper-dim focus:border-brass focus:outline-none"
          />
        </Field>
        <Field label="Max uses (blank = unlimited)">
          <input
            name="max_uses"
            type="number"
            min="1"
            placeholder="∞"
            className="block w-full border border-hairline bg-ink px-3 py-2 text-[13px] text-paper placeholder:text-paper-dim focus:border-brass focus:outline-none"
          />
        </Field>
      </div>

      {state?.error && (
        <div className="border-l-2 border-brass-bright bg-brass-bright/[0.05] px-3 py-2 text-[12px] leading-snug text-brass-bright">
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-brass/40 bg-brass px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:bg-brass-bright disabled:opacity-60"
    >
      {pending ? "Generating…" : "Generate invite"}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function CopyField({
  label,
  value,
  mono,
  multiline,
  highlight,
  onCopied,
}: {
  label: string;
  value: string;
  mono?: boolean;
  multiline?: boolean;
  highlight?: boolean;
  onCopied?: () => void;
}) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      onCopied?.();
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* noop */
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-brass transition-colors hover:text-brass-bright"
        >
          {done ? "Copied" : "Copy"}
        </button>
      </div>
      <div
        className={`mt-2 border ${highlight ? "border-brass" : "border-hairline"} bg-ink p-3`}
      >
        {multiline ? (
          <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-paper">
            {value}
          </pre>
        ) : (
          <span
            className={`block break-all ${mono ? "font-mono text-[12px] text-brass tabular-nums" : "text-[13px] text-paper"}`}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
