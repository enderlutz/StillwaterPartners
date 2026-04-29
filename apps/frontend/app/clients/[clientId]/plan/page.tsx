import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { PageHeader, Field, SectionTitle } from "@/components/ui/section";
import {
  getClient,
  getDecisions,
  getHypotheses,
  getInitiatives,
  getOpportunities,
} from "@/lib/db";
import { formatDate } from "@/lib/utils";
import type { Initiative, HypothesisStatus } from "@/lib/types";

const HORIZONS: Array<{
  key: Initiative["horizon"];
  label: string;
  sub: string;
}> = [
  { key: "short", label: "Short-term", sub: "next 90 days" },
  { key: "mid", label: "Mid-term", sub: "90 days – 12 months" },
  { key: "long", label: "Long-term", sub: "12 months+" },
];

const HYPOTHESIS_VARIANT: Record<
  HypothesisStatus,
  "success" | "warning" | "danger" | "muted"
> = {
  confirmed: "success",
  in_progress: "warning",
  rejected: "danger",
  untested: "muted",
};

export default async function PlanPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClient(params.clientId);
  if (!client) notFound();

  const [hypotheses, opportunities, initiatives, decisions] = await Promise.all(
    [
      getHypotheses(params.clientId),
      getOpportunities(params.clientId),
      getInitiatives(params.clientId),
      getDecisions(params.clientId),
    ],
  );

  return (
    <Shell clientId={params.clientId}>
      <PageHeader
        eyebrow={`${client.name} · Plan`}
        title="Plan"
        description="Hypotheses tested → opportunities surfaced → initiatives committed → decisions made."
      />

      {/* Hypotheses */}
      {hypotheses.length > 0 && (
        <section className="mb-10">
          <SectionTitle description="What we're testing.">
            Hypotheses
          </SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {hypotheses.map((h) => (
              <Card key={h.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-medium leading-snug text-paper">
                    {h.statement}
                  </p>
                  <Badge variant={HYPOTHESIS_VARIANT[h.status]}>
                    {h.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="mt-3 space-y-3 text-[12px] leading-relaxed text-paper-soft">
                  {h.evidence && (
                    <div>
                      <span className="eyebrow mr-2">Evidence</span>
                      {h.evidence}
                    </div>
                  )}
                  {h.so_what && (
                    <div>
                      <span className="eyebrow mr-2">So what</span>
                      {h.so_what}
                    </div>
                  )}
                  {h.owner && (
                    <div className="text-paper-dim">Owner · {h.owner}</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <section className="mb-10">
          <SectionTitle description="What's worth doing — sized and ranked.">
            Opportunities
          </SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {opportunities.map((o) => (
              <Card key={o.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-medium leading-snug text-paper">
                    {o.name}
                  </p>
                  <PriorityBadge priority={o.priority} />
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-paper-soft">
                  {o.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] tabular-nums text-paper-dim">
                  <StatusBadge status={o.status} />
                  <span>· {o.estimated_impact}</span>
                  <span>· difficulty {o.difficulty}</span>
                </div>
                {o.next_step && (
                  <div className="mt-3 border-l border-brass pl-3 text-[12px] leading-relaxed text-paper">
                    {o.next_step}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Roadmap (initiatives) */}
      {initiatives.length > 0 && (
        <section className="mb-10">
          <SectionTitle description="Committed initiatives by horizon.">
            Roadmap
          </SectionTitle>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {HORIZONS.map((h) => {
              const items = initiatives.filter((i) => i.horizon === h.key);
              return (
                <div key={h.key}>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h3 className="text-[13px] font-medium text-paper">
                      {h.label}
                    </h3>
                    <span className="text-[11px] text-paper-dim">{h.sub}</span>
                  </div>
                  <div className="space-y-3">
                    {items.length === 0 && (
                      <Card className="p-4 text-[12px] italic text-paper-dim">
                        No initiatives in this horizon.
                      </Card>
                    )}
                    {items.map((i) => (
                      <Card key={i.id} className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-medium leading-snug text-paper">
                            {i.title}
                          </p>
                          <PriorityBadge priority={i.priority} />
                        </div>
                        <p className="mt-2 text-[12px] leading-relaxed text-paper-soft">
                          {i.description}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] tabular-nums text-paper-dim">
                          <StatusBadge status={i.status} />
                          <span>· {i.owner}</span>
                          <span>· due {formatDate(i.due_date)}</span>
                        </div>
                        <div className="mt-3 border-l border-brass pl-3 text-[12px] leading-relaxed text-paper">
                          Impact · {i.expected_impact}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Decisions */}
      {decisions.length > 0 && (
        <section>
          <SectionTitle description="What's been resolved, and why.">
            Decisions
          </SectionTitle>
          <div className="space-y-3">
            {decisions
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((d) => (
                <Card key={d.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[14px] font-medium leading-snug text-paper">
                        {d.decision}
                      </p>
                      <p className="mt-2 text-[12px] leading-relaxed text-paper-soft">
                        {d.reason}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-paper-dim">
                      {formatDate(d.date)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-paper-dim">
                    <span>Owner · {d.owner}</span>
                    {d.related && <span>· {d.related}</span>}
                  </div>
                </Card>
              ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
