import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, SectionTitle } from "@/components/ui/section";
import { getCurrentProfile, getProspects } from "@/lib/db";
import { currency, formatDate } from "@/lib/utils";
import type { ProspectStage } from "@/lib/types";

const STAGES: Array<{ key: ProspectStage; label: string }> = [
  { key: "lead", label: "Leads" },
  { key: "scoping", label: "Scoping" },
  { key: "proposal", label: "Proposal" },
  { key: "negotiation", label: "Negotiation" },
  { key: "closed_won", label: "Closed — won" },
  { key: "closed_lost", label: "Closed — lost" },
];

const STAGE_VARIANT: Record<
  ProspectStage,
  "outline" | "brass" | "warning" | "success" | "muted"
> = {
  lead: "outline",
  scoping: "brass",
  proposal: "brass",
  negotiation: "warning",
  closed_won: "success",
  closed_lost: "muted",
};

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const profile = await getCurrentProfile();
  if (profile?.role === "client") {
    redirect("/");
  }

  const prospects = await getProspects();
  const totalForecast = prospects
    .filter((p) => p.stage !== "closed_lost" && p.stage !== "closed_won")
    .reduce((s, p) => s + p.expected_value, 0);

  return (
    <Shell>
      <PageHeader
        eyebrow="Brain · Pipeline"
        title="Pipeline"
        description="Prospects in motion."
        actions={
          <Badge variant="brass">{currency(totalForecast)} forecast</Badge>
        }
      />

      <div className="space-y-8">
        {STAGES.map((stage) => {
          const items = prospects.filter((p) => p.stage === stage.key);
          if (items.length === 0) return null;
          return (
            <section key={stage.key}>
              <SectionTitle
                description={`${items.length} ${
                  items.length === 1 ? "prospect" : "prospects"
                } · ${currency(items.reduce((s, p) => s + p.expected_value, 0))} expected value`}
              >
                {stage.label}
              </SectionTitle>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {items.map((p) => (
                  <Card key={p.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-[14px] font-medium text-paper">
                          {p.name}
                        </div>
                        <div className="mt-1 text-[12px] capitalize text-paper-soft">
                          {p.vertical.replace(/_/g, " ")}
                        </div>
                      </div>
                      <Badge variant={STAGE_VARIANT[p.stage]}>
                        {p.stage.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-3">
                      <div>
                        <div className="eyebrow">Expected value</div>
                        <div className="mt-1 text-[16px] font-medium tabular-nums text-brass">
                          {currency(p.expected_value)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="eyebrow">Expected close</div>
                        <div className="mt-1 text-[12px] tabular-nums text-paper-soft">
                          {p.expected_close ? formatDate(p.expected_close) : "—"}
                        </div>
                      </div>
                    </div>
                    {p.notes && (
                      <p className="mt-4 text-[12px] leading-relaxed text-paper-soft">
                        {p.notes}
                      </p>
                    )}
                    <div className="mt-3 text-[11px] tabular-nums text-paper-dim">
                      Owner · {p.owner} · added {formatDate(p.created_at)}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Shell>
  );
}
