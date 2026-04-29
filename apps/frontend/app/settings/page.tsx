import Link from "next/link";
import { Shell } from "@/components/shell";
import { PageHeader, Field, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { SettingsControls } from "@/components/settings-controls";
import { getCurrentProfile } from "@/lib/db";
import { getUseMockServer } from "@/lib/settings";

export const metadata = { title: "Settings — Client OS" };

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  const isMock = getUseMockServer();
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <Shell>
      <PageHeader
        title="Settings"
        description="Workspace preferences, account, and access tokens."
      />

      {/* Tokens — entry point */}
      <section className="mb-10">
        <SectionTitle description="Generate one per device. Used by the MCP server.">
          Personal access tokens
        </SectionTitle>
        <Link href="/settings/tokens" className="block">
          <Card className="flex items-center justify-between p-5 transition-colors hover:border-brass/40">
            <div>
              <div className="text-[14px] font-medium text-paper">
                Manage tokens
              </div>
              <p className="mt-1 text-[12px] text-paper-soft">
                Create, list, and revoke tokens — your terminal Claude
                authenticates with these.
              </p>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass">
              Open →
            </span>
          </Card>
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="text-[14px] font-medium text-paper">Data source</div>
          <p className="mt-2 text-[12px] leading-relaxed text-paper-soft">
            Toggle off to read live data from Supabase. Toggle on to see seeded
            mock data — useful for demos and local dev.
          </p>
          <div className="mt-4">
            <SettingsControls
              initialMock={isMock}
              supabaseConfigured={supabaseConfigured}
            />
          </div>
          {!supabaseConfigured && (
            <div className="mt-4 border-l-2 border-brass-bright bg-brass-bright/[0.05] px-3 py-2 text-[12px] leading-snug text-brass-bright">
              Supabase env vars are not set. Mock mode is forced on until{" "}
              <code className="text-brass">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="text-brass">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              are added to <code>.env.local</code> and the server restarts.
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="text-[14px] font-medium text-paper">Account</div>
          <div className="mt-4 space-y-4">
            {profile ? (
              <>
                <Field label="Name">{profile.full_name || "—"}</Field>
                <Field label="Role">
                  <span className="capitalize">
                    {profile.role.replace("_", " ")}
                  </span>
                </Field>
                {profile.client_id && (
                  <Field label="Scoped client">{profile.client_id}</Field>
                )}
              </>
            ) : (
              <p className="text-[13px] italic text-paper-dim">
                Not signed in (mock mode).
              </p>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
