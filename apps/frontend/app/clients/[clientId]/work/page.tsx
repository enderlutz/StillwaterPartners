import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { PageHeader, Field, SectionTitle } from "@/components/ui/section";
import {
  getBuilds,
  getCampaigns,
  getClient,
  getClientActions,
  getDeliverables,
  getMeetings,
  getTasks,
} from "@/lib/db";
import { currency, formatDate } from "@/lib/utils";
import type { BuildStatus, DeliverableStatus } from "@/lib/types";

const BUILD_VARIANT: Record<
  BuildStatus,
  "success" | "warning" | "muted" | "outline"
> = {
  shipped: "success",
  in_flight: "warning",
  planned: "outline",
  deprecated: "muted",
};

const DELIV_VARIANT: Record<
  DeliverableStatus,
  "success" | "warning" | "muted" | "outline"
> = {
  delivered: "success",
  ready: "warning",
  review: "outline",
  drafting: "muted",
};

export default async function WorkPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClient(params.clientId);
  if (!client) notFound();

  const [tasks, clientActions, meetings, deliverables, campaigns, builds] =
    await Promise.all([
      getTasks(params.clientId),
      getClientActions(params.clientId),
      getMeetings(params.clientId),
      getDeliverables(params.clientId),
      getCampaigns(params.clientId),
      getBuilds(params.clientId),
    ]);

  const openTasks = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => a.due_date.localeCompare(b.due_date));
  const openClientActions = clientActions.filter((a) => a.status !== "done");
  const liveCampaigns = campaigns.filter((c) => c.status === "live");
  const recentMeetings = meetings
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Shell clientId={params.clientId}>
      <PageHeader
        eyebrow={`${client.name} · Work`}
        title="Work"
        description="Tasks, client actions, meetings, deliverables, campaigns, and the software we're building for them."
      />

      {/* Custom Builds — first because the model is built around them */}
      {builds.length > 0 && (
        <section className="mb-10">
          <SectionTitle description="Software we're building for this client.">
            Custom builds
          </SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {builds.map((b) => (
              <Card key={b.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-paper">
                      {b.name}
                    </div>
                    <div className="mt-1 text-[12px] text-paper-soft">
                      Owner · {b.owner}
                    </div>
                  </div>
                  <Badge variant={BUILD_VARIANT[b.status]}>
                    {b.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                {b.problem_solved && (
                  <p className="mt-3 text-[12px] leading-relaxed text-paper-soft">
                    {b.problem_solved}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] tabular-nums text-paper-dim">
                  <span>Created {formatDate(b.created_at)}</span>
                  {b.shipped_at && <span>· Shipped {formatDate(b.shipped_at)}</span>}
                  {b.url && (
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brass hover:underline"
                    >
                      Open ↗
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Tasks */}
        <section>
          <SectionTitle description="What we owe.">
            Our tasks
          </SectionTitle>
          <div className="space-y-3">
            {openTasks.length === 0 && (
              <p className="text-[13px] italic text-paper-dim">
                Nothing open.
              </p>
            )}
            {openTasks.map((t) => (
              <Card key={t.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[14px] text-paper">{t.name}</div>
                    <div className="mt-1 text-[11px] tabular-nums text-paper-soft">
                      {t.owner} · due {formatDate(t.due_date)}
                    </div>
                    {t.notes && (
                      <p className="mt-2 text-[12px] leading-relaxed text-paper-soft">
                        {t.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Client actions */}
        <section>
          <SectionTitle description="What we're waiting on from the client.">
            Client actions
          </SectionTitle>
          <div className="space-y-3">
            {openClientActions.length === 0 && (
              <p className="text-[13px] italic text-paper-dim">
                Nothing on the client.
              </p>
            )}
            {openClientActions.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[14px] text-paper">{a.item}</div>
                    <div className="mt-1 text-[11px] tabular-nums text-paper-soft">
                      {a.owner} · due {formatDate(a.due_date)}
                    </div>
                    {a.notes && (
                      <p className="mt-2 text-[12px] leading-relaxed text-paper-soft">
                        {a.notes}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <section className="mt-10">
          <SectionTitle description="What's drafted, in review, ready, delivered.">
            Deliverables
          </SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {deliverables.map((d) => (
              <Card key={d.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-paper">
                      {d.name}
                    </div>
                    <div className="mt-1 text-[11px] capitalize tabular-nums text-paper-soft">
                      {d.type} · {d.owner} · due {formatDate(d.due_date)}
                    </div>
                  </div>
                  <Badge variant={DELIV_VARIANT[d.status]}>
                    {d.status}
                  </Badge>
                </div>
                {d.notes && (
                  <p className="mt-3 text-[12px] leading-relaxed text-paper-soft">
                    {d.notes}
                  </p>
                )}
                {d.delivered_date && (
                  <div className="mt-2 text-[11px] tabular-nums text-paper-dim">
                    Delivered {formatDate(d.delivered_date)}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Campaigns */}
      {campaigns.length > 0 && (
        <section className="mt-10">
          <SectionTitle description="In market and on the bench.">
            Campaigns
          </SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {campaigns.map((c) => (
              <Card key={c.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-paper">
                      {c.name}
                    </div>
                    <div className="mt-1 text-[11px] tabular-nums text-paper-soft">
                      {c.platform} · {c.target_location} ·{" "}
                      {currency(c.budget)} budget
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                {c.creative_angle && (
                  <p className="mt-3 text-[12px] italic leading-relaxed text-paper-soft">
                    “{c.creative_angle}”
                  </p>
                )}
                {c.results && (
                  <p className="mt-2 text-[12px] leading-relaxed text-paper">
                    <span className="eyebrow mr-2">Results</span>
                    {c.results}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Meetings */}
      {recentMeetings.length > 0 && (
        <section className="mt-10">
          <SectionTitle description="Recent conversations and what they yielded.">
            Meetings
          </SectionTitle>
          <div className="space-y-4">
            {recentMeetings.map((m) => (
              <Card key={m.id} className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-[12px] tabular-nums text-paper-dim">
                    {formatDate(m.date)} · {m.attendees.join(", ")}
                  </div>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-paper">
                  {m.summary}
                </p>
                {m.decisions.length > 0 && (
                  <div className="mt-4">
                    <Field label="Decisions">
                      <ul className="mt-1 space-y-1.5">
                        {m.decisions.map((d, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-brass">·</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </Field>
                  </div>
                )}
                {m.action_items.length > 0 && (
                  <div className="mt-4">
                    <Field label="Action items">
                      <ul className="mt-1 space-y-1.5">
                        {m.action_items.map((a, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-brass">→</span>
                            <span>
                              {a.item}
                              <span className="text-paper-dim">
                                {" "}
                                · {a.owner} · {formatDate(a.deadline)}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Field>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
