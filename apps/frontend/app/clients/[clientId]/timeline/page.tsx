import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/section";
import {
  getBuilds,
  getClient,
  getDecisions,
  getDeliverables,
  getKpis,
  getMeetings,
} from "@/lib/db";
import { formatDate, currency } from "@/lib/utils";

type Event = {
  date: string;
  kind: "Meeting" | "Decision" | "KPI" | "Deliverable" | "Build";
  title: string;
  body?: string;
};

export default async function TimelinePage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClient(params.clientId);
  if (!client) notFound();

  const [meetings, decisions, kpis, deliverables, builds] = await Promise.all([
    getMeetings(params.clientId),
    getDecisions(params.clientId),
    getKpis(params.clientId),
    getDeliverables(params.clientId),
    getBuilds(params.clientId),
  ]);

  const events: Event[] = [
    ...meetings.map((m) => ({
      date: m.date,
      kind: "Meeting" as const,
      title: `Meeting · ${m.attendees.join(", ")}`,
      body: m.summary,
    })),
    ...decisions.map((d) => ({
      date: d.date,
      kind: "Decision" as const,
      title: d.decision,
      body: d.reason,
    })),
    ...kpis
      .filter((k) => k.period_type === "monthly")
      .map((k) => ({
        date: kpiSortDate(k.period_label),
        kind: "KPI" as const,
        title: `${k.period_label} · ${currency(k.revenue)} (goal ${currency(k.revenue_goal)})`,
        body: `${k.bookings} bookings · ${k.show_ups} show-ups · CPB ${currency(k.cost_per_booking)}`,
      })),
    ...deliverables
      .filter((d) => d.delivered_date)
      .map((d) => ({
        date: d.delivered_date!,
        kind: "Deliverable" as const,
        title: `Delivered · ${d.name}`,
        body: d.notes,
      })),
    ...builds
      .filter((b) => b.shipped_at)
      .map((b) => ({
        date: b.shipped_at!,
        kind: "Build" as const,
        title: `Shipped · ${b.name}`,
        body: b.problem_solved,
      })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Shell clientId={params.clientId}>
      <PageHeader
        eyebrow={`${client.name} · Timeline`}
        title="Timeline"
        description="Everything in chronological order — meetings, decisions, KPI snapshots, deliveries, builds."
      />

      {events.length === 0 ? (
        <p className="text-[13px] italic text-paper-dim">
          No events yet.
        </p>
      ) : (
        <ol className="relative space-y-6 border-l border-hairline pl-7">
          {events.map((e, i) => (
            <li key={`${e.date}-${i}`} className="relative">
              <span className="absolute -left-[31px] top-2 h-1.5 w-1.5 rounded-full bg-brass" />
              <div className="flex items-baseline justify-between gap-3">
                <Badge variant="outline">{e.kind}</Badge>
                <span className="text-[11px] tabular-nums text-paper-dim">
                  {formatDate(e.date)}
                </span>
              </div>
              <div className="mt-2 text-[14px] font-medium leading-snug text-paper">
                {e.title}
              </div>
              {e.body && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-paper-soft">
                  {e.body}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </Shell>
  );
}

// Best-effort: turn "Mar 2026" / "Apr wk 1" into a sortable date string.
function kpiSortDate(label: string): string {
  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const m = label.match(/(\w{3})\s+(\d{4})/);
  if (m) {
    const month = months[m[1]!] ?? "01";
    return `${m[2]}-${month}-15`;
  }
  return label;
}
