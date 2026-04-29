import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, SectionTitle } from "@/components/ui/section";
import {
  getClientActions,
  getClients,
  getCurrentProfile,
  getDeliverables,
  getKpis,
  getProspects,
  getTasks,
} from "@/lib/db";
import { currency, formatDate, progressPct } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BrainHome() {
  const profile = await getCurrentProfile();
  // Brain is admin-only. Clients shouldn't be here.
  if (profile?.role === "client" && profile.client_id) {
    redirect(`/clients/${profile.client_id}/numbers`);
  }

  const clients = await getClients();
  const all = await Promise.all(
    clients.map(async (c) => {
      const [kpis, tasks, clientActions, deliverables] = await Promise.all([
        getKpis(c.id),
        getTasks(c.id),
        getClientActions(c.id),
        getDeliverables(c.id),
      ]);
      const monthly = kpis.filter((k) => k.period_type === "monthly");
      const latest = monthly[monthly.length - 1] ?? kpis[kpis.length - 1];
      return {
        client: c,
        latestKpi: latest,
        openTasks: tasks.filter((t) => t.status !== "done").length,
        openClientActions: clientActions.filter((a) => a.status !== "done")
          .length,
        dueDeliverables: deliverables.filter(
          (d) => d.status !== "delivered",
        ).length,
      };
    }),
  );

  const prospects = await getProspects();
  const totalForecast = prospects
    .filter(
      (p) => p.stage !== "closed_lost" && p.stage !== "closed_won",
    )
    .reduce((s, p) => s + p.expected_value, 0);
  const realizedRevenue = all.reduce(
    (s, a) => s + (a.latestKpi?.revenue ?? 0),
    0,
  );
  const totalOpenActions = all.reduce(
    (s, a) => s + a.openClientActions,
    0,
  );
  const totalOpenTasks = all.reduce((s, a) => s + a.openTasks, 0);

  return (
    <Shell>
      <PageHeader
        eyebrow="Brain · Firm"
        title={greeting(profile?.full_name)}
        description="Your firm at a glance — across every active engagement."
      />

      <section className="mb-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat
            label="Active clients"
            value={String(clients.length)}
          />
          <Stat
            label="Latest revenue"
            value={currency(realizedRevenue)}
            sub="across active clients"
          />
          <Stat
            label="Pipeline forecast"
            value={currency(totalForecast)}
            sub={`${prospects.filter((p) => p.stage !== "closed_lost" && p.stage !== "closed_won").length} open prospects`}
          />
          <Stat
            label="Open"
            value={`${totalOpenTasks} / ${totalOpenActions}`}
            sub="our tasks · client owes"
          />
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between">
          <SectionTitle>Engagements</SectionTitle>
          <Link
            href="#"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass hover:underline"
          >
            New client
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {all.map(
            ({
              client,
              latestKpi,
              openTasks,
              openClientActions,
              dueDeliverables,
            }) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}/numbers`}
                className="group block"
              >
                <Card className="p-5 transition-colors group-hover:border-brass/40">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-serif text-[18px] font-medium leading-tight tracking-tight text-paper">
                          {client.name}
                        </div>
                        {client.health && (
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              client.health === "on_track"
                                ? "bg-brass"
                                : client.health === "at_risk"
                                  ? "bg-brass-dim"
                                  : "bg-brass-bright"
                            }`}
                            aria-label={client.health}
                          />
                        )}
                      </div>
                      <div className="mt-1 text-[12px] capitalize text-paper-soft">
                        {(client.vertical ?? "other").replace(/_/g, " ")} ·{" "}
                        {client.primary_lens ?? "mixed"} ·{" "}
                        {client.engagement_stage ?? "—"}
                      </div>
                    </div>
                  </div>
                  {latestKpi && (
                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-hairline pt-4">
                      <Mini
                        label="Revenue"
                        value={currency(latestKpi.revenue)}
                      />
                      <Mini
                        label="vs goal"
                        value={`${progressPct(latestKpi.revenue, latestKpi.revenue_goal)}%`}
                      />
                      <Mini
                        label="CPB"
                        value={currency(latestKpi.cost_per_booking)}
                      />
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] tabular-nums text-paper-dim">
                    <span>{openTasks} open tasks</span>
                    <span>·</span>
                    <span>{openClientActions} on client</span>
                    <span>·</span>
                    <span>{dueDeliverables} deliverables</span>
                  </div>
                </Card>
              </Link>
            ),
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <SectionTitle>Pipeline</SectionTitle>
          <Link
            href="/brain/pipeline"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass hover:underline"
          >
            Full pipeline →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {prospects.slice(0, 6).map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-paper">
                    {p.name}
                  </div>
                  <div className="mt-1 text-[12px] capitalize text-paper-soft">
                    {p.vertical.replace(/_/g, " ")} · {p.stage.replace(/_/g, " ")}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[14px] font-medium tabular-nums text-brass">
                    {currency(p.expected_value)}
                  </div>
                  <div className="mt-0.5 text-[11px] tabular-nums text-paper-dim">
                    {p.expected_close ? formatDate(p.expected_close) : "—"}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </Shell>
  );
}

function greeting(name?: string) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  if (!name) return part;
  const first = name.split(" ")[0];
  return `${part}, ${first}.`;
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="p-5">
      <div className="eyebrow">{label}</div>
      <div className="mt-3 text-[24px] font-medium leading-none tracking-tight tabular-nums text-paper">
        {value}
      </div>
      {sub && (
        <div className="mt-2 text-[11px] tabular-nums text-paper-soft">
          {sub}
        </div>
      )}
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="mt-1 text-[14px] font-medium tabular-nums text-paper">
        {value}
      </div>
    </div>
  );
}
