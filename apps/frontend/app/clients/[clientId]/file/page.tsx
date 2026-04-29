import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Field, SectionTitle } from "@/components/ui/section";
import { getBrief, getClient, getSynthesis } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function FilePage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClient(params.clientId);
  if (!client) notFound();

  const [brief, synthesis] = await Promise.all([
    getBrief(params.clientId),
    getSynthesis(params.clientId),
  ]);

  return (
    <Shell clientId={params.clientId}>
      <PageHeader
        eyebrow={`${client.name} · File`}
        title="File"
        description="The dossier — who they are, the core problem, our framing."
        actions={
          client.engagement_stage && (
            <Badge variant="outline">
              Stage · {client.engagement_stage}
            </Badge>
          )
        }
      />

      {/* Spine */}
      <section className="mb-10">
        <SectionTitle>Spine</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="eyebrow">Industry</div>
            <p className="mt-2 text-[14px] leading-relaxed text-paper">
              {client.industry}
            </p>
          </Card>
          <Card className="p-5">
            <div className="eyebrow">Vertical</div>
            <p className="mt-2 text-[14px] capitalize leading-relaxed text-paper">
              {(client.vertical ?? "other").replace(/_/g, " ")}
            </p>
          </Card>
          <Card className="p-5">
            <div className="eyebrow">Primary lens</div>
            <p className="mt-2 text-[14px] capitalize leading-relaxed text-brass">
              {client.primary_lens ?? "mixed"}
            </p>
          </Card>
        </div>
      </section>

      {/* Synthesis (if present) */}
      {synthesis && (
        <section className="mb-10">
          <SectionTitle
            description={`Updated ${formatDate(synthesis.updated_at)}`}
          >
            Synthesis
          </SectionTitle>
          <Card className="overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-[3px] bg-brass" />
            <CardContent className="pt-6">
              <div className="eyebrow">Headline</div>
              <p className="mt-2 font-serif text-[22px] font-medium leading-snug tracking-tight text-paper">
                {synthesis.headline}
              </p>
            </CardContent>
          </Card>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-5">
              <div className="eyebrow">Situation</div>
              <p className="mt-2 text-[14px] leading-relaxed text-paper">
                {synthesis.situation}
              </p>
            </Card>
            <Card className="p-5">
              <div className="eyebrow">Complication</div>
              <p className="mt-2 text-[14px] leading-relaxed text-paper">
                {synthesis.complication}
              </p>
            </Card>
            <Card className="p-5">
              <div className="eyebrow">Resolution</div>
              <p className="mt-2 text-[14px] leading-relaxed text-paper">
                {synthesis.resolution}
              </p>
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="p-5">
              <Field label="Key findings">
                <ul className="mt-1 space-y-2">
                  {synthesis.key_findings.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-brass">·</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Field>
            </Card>
            <Card className="p-5">
              <Field label="Recommendations">
                <ul className="mt-1 space-y-2">
                  {synthesis.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-brass">→</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Field>
            </Card>
          </div>
        </section>
      )}

      {/* Brief */}
      {brief && (
        <section className="mb-10">
          <SectionTitle description="Shared context.">Brief</SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="p-5">
              <div className="space-y-5">
                <Field label="Business overview">
                  {brief.business_overview}
                </Field>
                <Field label="Target audience">{brief.target_audience}</Field>
                <Field label="Core offer">{brief.core_offer}</Field>
                <Field label="Pricing">{brief.pricing}</Field>
                <Field label="Upsells">{brief.upsells}</Field>
              </div>
            </Card>
            <Card className="p-5">
              <div className="space-y-5">
                <Field label="Competitors">{brief.competitors}</Field>
                <Field label="Marketing channels">
                  {brief.marketing_channels}
                </Field>
                <Field label="Operational constraints">
                  {brief.operational_constraints}
                </Field>
                <Field label="Notes">{brief.notes}</Field>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Goals */}
      <section>
        <SectionTitle>Goals</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="eyebrow">Current status</div>
            <p className="mt-2 text-[14px] leading-relaxed text-paper">
              {client.current_status}
            </p>
          </Card>
          <Card className="p-5">
            <div className="eyebrow">Ninety-day goal</div>
            <p className="mt-2 text-[14px] leading-relaxed text-paper">
              {client.goal_90_day}
            </p>
          </Card>
          <Card className="p-5">
            <div className="eyebrow">Long-term goal</div>
            <p className="mt-2 text-[14px] leading-relaxed text-paper">
              {client.long_term_goal}
            </p>
          </Card>
        </div>
      </section>
    </Shell>
  );
}
