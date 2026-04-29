import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { PageHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { getClient } from "@/lib/db";
import { OPERATIONS_SECTIONS } from "@/lib/types";
import { addOperationsBlock, listOperationsBlocks } from "./actions";
import { OperationsBlockCard } from "./operations-block";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClient(params.clientId);
  return {
    title: `Operations — ${client?.name ?? "Client"} — Stillwater Partners`,
  };
}

export default async function OperationsPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClient(params.clientId);
  if (!client) notFound();

  const blocks = await listOperationsBlocks(params.clientId);
  const bySection = new Map<string, typeof blocks>();
  for (const s of OPERATIONS_SECTIONS) bySection.set(s.key, []);
  for (const b of blocks) {
    const arr = bySection.get(b.section_key);
    if (arr) arr.push(b);
  }

  return (
    <Shell>
      <PageHeader
        eyebrow={client.name}
        title="Company Operations"
        description="The whiteboard. Capture how this company works — revenue, costs, flow, people, stack, constraints, leverage. Add blocks per section. Markdown, tables, and Mermaid diagrams all render."
      />

      <nav className="mb-8 flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.18em]">
        {OPERATIONS_SECTIONS.map((s) => (
          <a
            key={s.key}
            href={`#${s.key}`}
            className="border border-hairline px-2.5 py-1.5 text-paper-soft transition-colors hover:border-brass hover:text-brass"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {OPERATIONS_SECTIONS.map((section) => {
          const sectionBlocks = bySection.get(section.key) ?? [];
          return (
            <section key={section.key} id={section.key} className="scroll-mt-8">
              <div className="mb-4 border-b border-hairline pb-3">
                <h2 className="font-serif text-[22px] font-medium tracking-tight text-paper">
                  {section.label}
                </h2>
                <p className="mt-1 text-[12px] text-paper-soft">
                  {section.hint}
                </p>
              </div>

              <div className="space-y-3">
                {sectionBlocks.length === 0 && (
                  <Card className="p-6 text-center text-[13px] italic text-paper-dim">
                    No blocks yet.
                  </Card>
                )}
                {sectionBlocks.map((b, i) => (
                  <OperationsBlockCard
                    key={b.id}
                    block={b}
                    clientId={params.clientId}
                    isFirst={i === 0}
                    isLast={i === sectionBlocks.length - 1}
                  />
                ))}

                <form action={addOperationsBlock}>
                  <input
                    type="hidden"
                    name="client_id"
                    value={params.clientId}
                  />
                  <input
                    type="hidden"
                    name="section_key"
                    value={section.key}
                  />
                  <button
                    type="submit"
                    className="w-full border border-dashed border-hairline px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-paper-dim transition-colors hover:border-brass hover:text-brass"
                  >
                    + Add block
                  </button>
                </form>
              </div>
            </section>
          );
        })}
      </div>
    </Shell>
  );
}
