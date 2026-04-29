import { notFound } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi";
import { Badge } from "@/components/ui/badge";
import { PageHeader, SectionTitle } from "@/components/ui/section";
import {
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui/table";
import {
  getClient,
  getCommercial,
  getCurrentProfile,
  getImpacts,
  getKpis,
} from "@/lib/db";
import { currency, pct, progressPct } from "@/lib/utils";

export default async function NumbersPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClient(params.clientId);
  if (!client) notFound();

  const [kpis, impacts, commercial, profile] = await Promise.all([
    getKpis(params.clientId),
    getImpacts(params.clientId),
    getCommercial(params.clientId),
    getCurrentProfile(),
  ]);

  const isTeam = profile?.role !== "client";
  const monthly = kpis.filter((k) => k.period_type === "monthly");
  const weekly = kpis.filter((k) => k.period_type === "weekly");
  const latest = monthly[monthly.length - 1] ?? kpis[kpis.length - 1];

  return (
    <Shell clientId={params.clientId}>
      <PageHeader
        eyebrow={`${client.name} · Numbers`}
        title="Numbers"
        description={`Latest period: ${latest?.period_label ?? "—"}`}
        actions={
          client.health && (
            <Badge
              variant={
                client.health === "on_track"
                  ? "success"
                  : client.health === "at_risk"
                    ? "warning"
                    : "danger"
              }
            >
              {client.health.replace("_", " ")}
            </Badge>
          )
        }
      />

      {latest && (
        <section className="mb-10">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiCard
              label="Revenue"
              value={currency(latest.revenue)}
              progress={{ actual: latest.revenue, goal: latest.revenue_goal }}
              trend={
                latest.revenue >= latest.revenue_goal ? "up" : "down"
              }
            />
            <KpiCard
              label="Bookings"
              value={String(latest.bookings)}
              progress={{
                actual: latest.bookings,
                goal: latest.bookings_goal,
              }}
            />
            <KpiCard
              label="Show-up rate"
              value={pct(latest.show_up_rate)}
              sub={`${latest.show_ups} / ${latest.bookings} booked`}
            />
            <KpiCard
              label="Cost per booking"
              value={currency(latest.cost_per_booking)}
              sub={`Ad spend ${currency(latest.ad_spend)}`}
            />
          </div>
        </section>
      )}

      {monthly.length > 0 && (
        <section className="mb-10">
          <SectionTitle>Monthly</SectionTitle>
          <Table>
            <THead>
              <TR>
                <TH>Period</TH>
                <TH>Revenue</TH>
                <TH>Goal</TH>
                <TH>% Goal</TH>
                <TH>Leads</TH>
                <TH>Bookings</TH>
                <TH>Show-ups</TH>
                <TH>Show %</TH>
                <TH>CPB</TH>
                <TH>Profit est.</TH>
              </TR>
            </THead>
            <TBody>
              {monthly.map((k) => (
                <TR key={k.id}>
                  <TD className="font-medium">{k.period_label}</TD>
                  <TD>{currency(k.revenue)}</TD>
                  <TD className="text-paper-soft">
                    {currency(k.revenue_goal)}
                  </TD>
                  <TD>{progressPct(k.revenue, k.revenue_goal)}%</TD>
                  <TD>{k.leads}</TD>
                  <TD>{k.bookings}</TD>
                  <TD>{k.show_ups}</TD>
                  <TD>{pct(k.show_up_rate)}</TD>
                  <TD>{currency(k.cost_per_booking)}</TD>
                  <TD className="font-medium text-brass">
                    {currency(k.profit_estimate)}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </section>
      )}

      {weekly.length > 0 && (
        <section className="mb-10">
          <SectionTitle>Weekly</SectionTitle>
          <Table>
            <THead>
              <TR>
                <TH>Week</TH>
                <TH>Revenue</TH>
                <TH>Leads</TH>
                <TH>Bookings</TH>
                <TH>Show-ups</TH>
                <TH>CPB</TH>
                <TH>Profit est.</TH>
              </TR>
            </THead>
            <TBody>
              {weekly.map((k) => (
                <TR key={k.id}>
                  <TD className="font-medium">{k.period_label}</TD>
                  <TD>{currency(k.revenue)}</TD>
                  <TD>{k.leads}</TD>
                  <TD>{k.bookings}</TD>
                  <TD>{k.show_ups}</TD>
                  <TD>{currency(k.cost_per_booking)}</TD>
                  <TD className="font-medium text-brass">
                    {currency(k.profit_estimate)}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </section>
      )}

      {impacts.length > 0 && (
        <section className="mb-10">
          <SectionTitle
            description="Value delivered — realized and projected."
          >
            Impact
          </SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {impacts.map((i) => (
              <Card key={i.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-paper">
                      {i.name}
                    </div>
                    <div className="mt-1 text-[12px] capitalize text-paper-soft">
                      {i.category.replace(/_/g, " ")} ·{" "}
                      {i.realized_date ? "realized" : "projected"}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[15px] font-medium tabular-nums text-brass">
                      {i.value_label}
                    </div>
                  </div>
                </div>
                {i.notes && (
                  <p className="mt-3 text-[12px] leading-relaxed text-paper-soft">
                    {i.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {isTeam && commercial && (
        <section>
          <SectionTitle description="Internal — commercial terms and burn.">
            Commercial
          </SectionTitle>
          <Card className="p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <div className="text-[14px] font-medium text-paper">
                {commercial.engagement_name}
              </div>
              <Badge variant="brass">
                {commercial.margin_pct}% margin
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <Stat
                label="Budget fee"
                value={currency(commercial.budget_fee)}
              />
              <Stat
                label="Invoiced"
                value={currency(commercial.fee_invoiced)}
              />
              <Stat
                label="Hours budget"
                value={`${commercial.hours_burned} / ${commercial.budget_hours}`}
              />
              <Stat
                label="Term"
                value={`${commercial.start_date.slice(0, 7)} → ${commercial.end_date.slice(0, 7)}`}
              />
            </div>
            {commercial.notes && (
              <p className="mt-5 text-[12px] leading-relaxed text-paper-soft">
                {commercial.notes}
              </p>
            )}
          </Card>
        </section>
      )}
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="mt-1.5 text-[15px] font-medium tabular-nums text-paper">
        {value}
      </div>
    </div>
  );
}
