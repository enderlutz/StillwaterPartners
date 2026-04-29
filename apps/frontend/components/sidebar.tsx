"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SURFACES, type Client, type Profile } from "@/lib/types";
import {
  BookOpen,
  Brain,
  CheckSquare,
  Clock,
  FileText,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CLIENT_ICONS: Record<string, typeof LayoutDashboard> = {
  numbers: Target,
  file: FileText,
  plan: Map,
  work: CheckSquare,
  room: Users,
  timeline: Clock,
};

const BRAIN_ICONS: Record<string, typeof LayoutDashboard> = {
  "": Brain,
  pipeline: Inbox,
  practice: BookOpen,
  audit: ShieldCheck,
};

export function Sidebar({
  clients,
  activeClientId,
  profile,
}: {
  clients: Client[];
  activeClientId?: string;
  profile: Profile | null;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const isClientUser = profile?.role === "client";

  // Mode driven by URL — back/forward and deep-links keep the right zone selected.
  const mode: "brain" | "clients" =
    pathname.startsWith("/brain") || pathname === "/settings"
      ? "brain"
      : "clients";

  const current = activeClientId ?? clients[0]?.id ?? "";
  const clientSurfaces = SURFACES.filter(
    (s) => s.zone === "client" && (!isClientUser || s.clientFacing),
  );
  const brainSurfaces = SURFACES.filter((s) => s.zone === "brain");

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="relative flex h-screen w-64 shrink-0 flex-col border-r border-hairline bg-ink">
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center border border-brass/50 bg-transparent">
            <span className="text-[11px] font-medium tracking-[0.1em] text-brass">
              SP
            </span>
          </div>
          <div className="font-serif text-[18px] leading-none tracking-tight text-paper">
            Stillwater Partners
          </div>
        </Link>
      </div>

      {/* Brain ↔ Clients toggle (team only) */}
      {!isClientUser && (
        <div className="px-6">
          <ModeToggle mode={mode} firstClientId={current} />
        </div>
      )}

      {/* Body — depends on mode */}
      <div className="mt-6 flex-1 overflow-y-auto">
        {mode === "brain" && !isClientUser && (
          <BrainNav pathname={pathname} surfaces={brainSurfaces} />
        )}
        {mode === "clients" && (
          <ClientsNav
            clients={clients}
            current={current}
            pathname={pathname}
            isClientUser={isClientUser}
            surfaces={clientSurfaces}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-hairline px-6 py-4">
        <div className="flex flex-col gap-px">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2.5 border-l py-1.5 pl-3 text-[13px] transition-colors",
              pathname.startsWith("/settings")
                ? "border-brass font-medium text-paper"
                : "border-transparent text-paper-soft hover:text-paper",
            )}
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Link>
          {profile && (
            <button
              onClick={signOut}
              className="flex items-center gap-2.5 border-l border-transparent py-1.5 pl-3 text-left text-[13px] text-paper-soft transition-colors hover:text-paper"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          )}
        </div>
        {profile && (
          <div className="mt-3 truncate pl-3 text-[10px] font-medium uppercase tracking-[0.18em] text-paper-dim">
            {profile.full_name} · {profile.role.replace("_", " ")}
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Toggle ────────────────────────────────────────────────────────────────
function ModeToggle({
  mode,
  firstClientId,
}: {
  mode: "brain" | "clients";
  firstClientId: string;
}) {
  const brainHref = "/brain";
  const clientsHref = firstClientId ? `/clients/${firstClientId}/numbers` : "/";
  return (
    <div className="relative inline-flex w-full items-center border border-hairline bg-slate p-0.5 text-[11px] font-medium uppercase tracking-[0.18em]">
      <Link
        href={brainHref}
        className={cn(
          "flex-1 px-3 py-1.5 text-center transition-colors duration-200",
          mode === "brain"
            ? "bg-brass text-ink"
            : "text-paper-soft hover:text-paper",
        )}
      >
        Brain
      </Link>
      <Link
        href={clientsHref}
        className={cn(
          "flex-1 px-3 py-1.5 text-center transition-colors duration-200",
          mode === "clients"
            ? "bg-brass text-ink"
            : "text-paper-soft hover:text-paper",
        )}
      >
        Clients
      </Link>
    </div>
  );
}

// ─── Brain nav ─────────────────────────────────────────────────────────────
function BrainNav({
  pathname,
  surfaces,
}: {
  pathname: string;
  surfaces: ReadonlyArray<(typeof SURFACES)[number]>;
}) {
  return (
    <div className="px-6">
      <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-paper-dim">
        Firm
      </div>
      <nav className="flex flex-col gap-px">
        {surfaces.map((s) => {
          const href = s.slug ? `/brain/${s.slug}` : "/brain";
          const active = s.slug
            ? pathname.startsWith(href)
            : pathname === "/brain";
          const Icon = BRAIN_ICONS[s.slug] ?? Brain;
          return (
            <Link
              key={s.slug || "brain"}
              href={href}
              className={cn(
                "flex items-center gap-2.5 border-l py-1.5 pl-3 text-[13px] transition-all duration-200",
                active
                  ? "border-brass font-medium text-paper"
                  : "border-transparent text-paper-soft hover:border-hairline hover:text-paper",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  active ? "text-brass" : "text-paper-dim",
                )}
              />
              <span>{s.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Clients nav ───────────────────────────────────────────────────────────
function ClientsNav({
  clients,
  current,
  pathname,
  isClientUser,
  surfaces,
}: {
  clients: Client[];
  current: string;
  pathname: string;
  isClientUser: boolean;
  surfaces: ReadonlyArray<(typeof SURFACES)[number]>;
}) {
  return (
    <div className="space-y-7 px-6">
      {/* Client list — team only */}
      {!isClientUser && (
        <div>
          <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-paper-dim">
            Clients
          </div>
          <div className="flex flex-col gap-px">
            {clients.map((c) => {
              const active = c.id === current;
              return (
                <Link
                  key={c.id}
                  href={`/clients/${c.id}/numbers`}
                  className={cn(
                    "flex items-center justify-between border-l py-1.5 pl-3 pr-2 text-[13px] transition-all duration-200",
                    active
                      ? "border-brass font-medium text-paper"
                      : "border-transparent text-paper-soft hover:border-hairline hover:text-paper",
                  )}
                >
                  <span className="truncate">{c.name}</span>
                  {c.health && (
                    <span
                      className={cn(
                        "ml-2 h-1.5 w-1.5 shrink-0 rounded-full",
                        c.health === "on_track" && "bg-brass",
                        c.health === "at_risk" && "bg-brass-dim",
                        c.health === "critical" && "bg-brass-bright",
                      )}
                      aria-label={c.health}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Active client surfaces */}
      {current && (
        <div>
          <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-paper-dim">
            {isClientUser ? "Your file" : "Workspace"}
          </div>
          <nav className="flex flex-col gap-px">
            {surfaces.map((s) => {
              const href = `/clients/${current}/${s.slug}`;
              const active = pathname.startsWith(href);
              const Icon = CLIENT_ICONS[s.slug] ?? FileText;
              return (
                <Link
                  key={s.slug}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 border-l py-1.5 pl-3 text-[13px] transition-all duration-200",
                    active
                      ? "border-brass font-medium text-paper"
                      : "border-transparent text-paper-soft hover:border-hairline hover:text-paper",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5",
                      active ? "text-brass" : "text-paper-dim",
                    )}
                  />
                  <span>{s.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
