import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { PageHeader, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { getCurrentProfile } from "@/lib/db";
import { listInvites, listClientsForInvite, revokeInvite } from "./actions";
import { InvitesClient } from "./invites-client";

export const metadata = { title: "Invites — Brain — Stillwater Partners" };
export const dynamic = "force-dynamic";

export default async function InvitesPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "team_member") redirect("/");

  const [invites, clients] = await Promise.all([
    listInvites(),
    listClientsForInvite(),
  ]);

  return (
    <Shell>
      <PageHeader
        eyebrow="Brain"
        title="Client invites"
        description="Per-client signup gate codes. The code unlocks /signup for new users and binds their account to one client only."
      />

      <section className="mb-10">
        <SectionTitle description="Pick a client, optionally cap uses, generate a code. Send the URL + code to the client out-of-band.">
          Generate
        </SectionTitle>
        <Card className="p-5">
          <InvitesClient clients={clients} />
        </Card>
      </section>

      <section>
        <SectionTitle
          description={`${invites.length} total — ${invites.filter((i) => i.status === "active").length} active.`}
        >
          All invites
        </SectionTitle>
        {invites.length === 0 ? (
          <Card className="p-8 text-center text-[13px] italic text-paper-dim">
            No invites yet. Generate one above.
          </Card>
        ) : (
          <Card className="p-0">
            <Table>
              <THead>
                <TR>
                  <TH>Client</TH>
                  <TH>Label</TH>
                  <TH>Code prefix</TH>
                  <TH>Uses</TH>
                  <TH>Status</TH>
                  <TH>Created</TH>
                  <TH></TH>
                </TR>
              </THead>
              <TBody>
                {invites.map((inv) => (
                  <TR key={inv.id}>
                    <TD>{inv.client_name}</TD>
                    <TD className="text-paper-soft">{inv.label}</TD>
                    <TD>
                      <code className="text-[11px] tabular-nums text-brass">
                        {inv.token_prefix}…
                      </code>
                    </TD>
                    <TD className="tabular-nums">
                      {inv.use_count}
                      {inv.max_uses ? ` / ${inv.max_uses}` : ""}
                    </TD>
                    <TD>
                      <StatusBadge status={inv.status} />
                    </TD>
                    <TD className="text-[11px] text-paper-dim tabular-nums">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </TD>
                    <TD>
                      {inv.status === "active" && (
                        <form action={revokeInvite}>
                          <input type="hidden" name="id" value={inv.id} />
                          <button
                            type="submit"
                            className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-brass-bright"
                          >
                            Revoke
                          </button>
                        </form>
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        )}
      </section>
    </Shell>
  );
}

function StatusBadge({
  status,
}: {
  status: "active" | "exhausted" | "expired" | "revoked";
}) {
  if (status === "active") return <Badge variant="success">Active</Badge>;
  if (status === "revoked") return <Badge variant="danger">Revoked</Badge>;
  if (status === "expired") return <Badge variant="warning">Expired</Badge>;
  return <Badge variant="muted">Used up</Badge>;
}
