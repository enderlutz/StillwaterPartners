"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function SettingsControls({
  initialMock,
  supabaseConfigured,
}: {
  initialMock: boolean;
  supabaseConfigured: boolean;
}) {
  const [useMock, setUseMock] = useState(initialMock);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggle(next: boolean) {
    if (!supabaseConfigured) return; // locked
    setUseMock(next);
    // 6 months. Scoped to site. Cookie readable server-side.
    document.cookie = `client_os_use_mock=${next ? "1" : "0"}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between border border-hairline bg-ink px-4 py-3">
      <div>
        <div className="text-[13px] font-medium text-paper">
          {useMock ? "Mock data" : "Live Supabase"}
        </div>
        <div className="mt-0.5 text-[11px] text-paper-soft">
          {useMock
            ? "Reads the seeded demo dataset."
            : "Reads from your configured Supabase project."}
        </div>
      </div>
      <button
        onClick={() => toggle(!useMock)}
        disabled={!supabaseConfigured || pending}
        role="switch"
        aria-checked={useMock}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
          useMock ? "bg-brass" : "bg-hairline"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform ${
            useMock ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
