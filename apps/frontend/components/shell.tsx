import { getClients, getCurrentProfile } from "@/lib/db";
import { Sidebar } from "./sidebar";
import type { ReactNode } from "react";

export async function Shell({
  clientId,
  children,
}: {
  clientId?: string;
  children: ReactNode;
}) {
  const [clients, profile] = await Promise.all([
    getClients(),
    getCurrentProfile(),
  ]);

  const visible =
    profile?.role === "client" && profile.client_id
      ? clients.filter((c) => c.id === profile.client_id)
      : clients;

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar clients={visible} activeClientId={clientId} profile={profile} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-6xl px-10 py-10 animate-fade">
          {children}
        </div>
      </main>
    </div>
  );
}
