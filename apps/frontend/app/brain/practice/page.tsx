import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, SectionTitle } from "@/components/ui/section";
import { getCurrentProfile, getLessons, getPlaybooks } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const profile = await getCurrentProfile();
  if (profile?.role === "client") {
    redirect("/");
  }

  const [playbooks, lessons] = await Promise.all([
    getPlaybooks(),
    getLessons(),
  ]);

  return (
    <Shell>
      <PageHeader
        eyebrow="Brain · Practice"
        title="Practice"
        description="The firm's reusable brain — playbooks, frameworks, and what we've learned."
      />

      {/* Playbooks */}
      <section className="mb-10">
        <SectionTitle description="Reusable approaches by vertical or problem.">
          Playbooks
        </SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {playbooks.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[15px] font-medium leading-snug text-paper">
                    {p.title}
                  </div>
                  <div className="mt-1 text-[12px] capitalize text-paper-soft">
                    {p.vertical.replace(/_/g, " ")} · {p.problem}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-paper-soft">
                {p.content_md}
              </pre>
              <div className="mt-4 text-[11px] tabular-nums text-paper-dim">
                Updated {formatDate(p.updated_at)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Lessons */}
      <section>
        <SectionTitle description="What worked, what didn't — tagged for future engagements.">
          Lessons
        </SectionTitle>
        <div className="space-y-3">
          {lessons.map((l) => (
            <Card key={l.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-paper">
                    {l.title}
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper-soft">
                    {l.content}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-[11px] tabular-nums text-paper-dim">
                    {formatDate(l.created_at)}
                  </span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {l.tags.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
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
