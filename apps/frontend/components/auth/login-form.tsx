"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError(
        "Supabase isn't configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart.",
      );
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const next = params.get("next") || "/";
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <Underlined label="Email">
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@firm.com"
          className="block w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-[15px] text-paper placeholder:text-paper-dim/70 transition-colors focus:border-brass focus:outline-none focus:ring-0"
          required
        />
      </Underlined>
      <Underlined label="Password">
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="block w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-[15px] text-paper placeholder:text-paper-dim/70 transition-colors focus:border-brass focus:outline-none focus:ring-0"
          required
        />
      </Underlined>

      {error && (
        <div className="border-l-2 border-brass-bright bg-brass-bright/[0.05] px-3 py-2 text-[12px] leading-snug text-brass-bright">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative block w-full overflow-hidden border border-brass/40 bg-brass py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-all duration-300 hover:bg-brass-bright disabled:opacity-60"
      >
        <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-paper transition-transform duration-500 ease-out group-hover:scale-x-100" />
        <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-paper transition-transform duration-500 ease-out group-hover:scale-x-100" />
        {loading ? "Entering…" : "Enter"}
      </button>
    </form>
  );
}

function Underlined({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
