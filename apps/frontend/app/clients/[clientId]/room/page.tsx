import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, SectionTitle } from "@/components/ui/section";
import {
  getClient,
  getCurrentProfile,
  getDataRoom,
  getRisks,
  getStakeholders,
} from "@/lib/db";
import { formatDate } from "@/lib/utils";

const POSTURE_VARIANT: Record<
  string,
  "success" | "warning" | "danger" | "muted" | "brass"
> = {
  champion: "success",
  supportive: "brass",
  neutral: "muted",
  skeptical: "warning",
  blocker: "danger",
};

export default async function RoomPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClient(params.clientId);
  if (!client) notFound();

  const [stakeholders, risks, dataRoom, profile] = await Promise.all([
    getStakeholders(params.clientId),
    getRisks(params.clientId),
    getDataRoom(params.clientId),
    getCurrentProfile(),
  ]);

  const isTeam = profile?.role !== "client";
  const openRisks = risks.filter((r) => r.status !== "closed");

  return (
    <Shell clientId={params.clientId}>
      <PageHeader
        eyebrow={`${client.name} · Room`}
        title="Room"
        description="Who's involved, what could go wrong, what files we have."
      />

      {/* Stakeholders */}
      {stakeholders.length > 0 && (
        <section className="mb-10">
          <SectionTitle description="The people in the engagement.">
            Stakeholders
          </SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {stakeholders.map((s) => (
              <Card key={s.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-paper">
                      {s.name}
                    </div>
                    <div className="mt-1 text-[12px] text-paper-soft">
                      {s.role}
                    </div>
                  </div>
                  <Badge variant={POSTURE_VARIANT[s.posture] ?? "muted"}>
                    {s.posture}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] tabular-nums text-paper-dim">
                  <span>Influence · {s.influence}</span>
                  {s.last_contact && (
                    <span>· Last contact {formatDate(s.last_contact)}</span>
                  )}
                  {s.email && (
                    <a
                      href={`mailto:${s.email}`}
                      className="text-brass hover:underline"
                    >
                      {s.email}
                    </a>
                  )}
                </div>
                {s.notes && (
                  <p className="mt-3 text-[12px] leading-relaxed text-paper-soft">
                    {s.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Risks — internal only */}
      {isTeam && openRisks.length > 0 && (
        <section className="mb-10">
          <SectionTitle description="Internal — what could go wrong, and how we're handling it.">
            Risks
          </SectionTitle>
          <div className="space-y-3">
            {openRisks.map((r) => (
              <Card key={r.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-medium text-paper">
                    {r.title}
                  </p>
                  <Badge variant={r.status === "open" ? "danger" : "warning"}>
                    {r.status}
                  </Badge>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-paper-soft">
                  {r.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] tabular-nums text-paper-dim">
                  <span>Likelihood · {r.likelihood}</span>
                  <span>· Impact · {r.impact}</span>
                  <span>· Owner · {r.owner}</span>
                </div>
                {r.mitigation && (
                  <div className="mt-3 border-l border-brass pl-3 text-[12px] leading-relaxed text-paper">
                    {r.mitigation}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Data room */}
      {dataRoom.length > 0 && (
        <section>
          <SectionTitle description="Reference files.">
            Data room
          </SectionTitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {dataRoom.map((f) => (
              <Card key={f.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[14px] font-medium text-paper hover:text-brass"
                    >
                      {f.file_name}
                    </a>
                    <p className="mt-1 text-[12px] leading-relaxed text-paper-soft">
                      {f.description}
                    </p>
                  </div>
                  <Badge variant="outline">{f.category}</Badge>
                </div>
                <div className="mt-2 text-[11px] tabular-nums text-paper-dim">
                  Added {formatDate(f.date_added)}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
