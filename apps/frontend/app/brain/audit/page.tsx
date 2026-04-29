import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { PageHeader, SectionTitle } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/db";

export const metadata = { title: "Audit — Brain — Client OS" };
export const dynamic = "force-dynamic";

type AuditRow = {
  id: string;
  user_id: string;
  tool_name: string;
  args_json: Record<string, unknown>;
  result_status: "ok" | "error";
  error_message: string | null;
  created_at: string;
};

export default async function AuditPage() {
  const profile = await getCurrentProfile();
  if (profile?.role === "client") redirect("/");

  const supabase = createClient();
  let rows: AuditRow[] = [];
  let supabaseConfigured = false;

  if (supabase) {
    supabaseConfigured = true;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("mcp_audit_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200);
      rows = (data as AuditRow[]) ?? [];
    }
  }

  const okCount = rows.filter((r) => r.result_status === "ok").length;
  const errCount = rows.filter((r) => r.result_status === "error").length;

  return (
    <Shell>
      <PageHeader
        eyebrow="Brain · Audit"
        title="MCP action log"
        description="Every tool call from your terminal Claude sessions, attributed to your token."
        actions={
          <div className="flex gap-2">
            <Badge variant="success">{okCount} ok</Badge>
            {errCount > 0 && (
              <Badge variant="danger">{errCount} errors</Badge>
            )}
          </div>
        }
      />

      {!supabaseConfigured ? (
        <Card className="p-5">
          <div className="eyebrow-brass">Audit log unavailable</div>
          <p className="mt-3 text-[14px] leading-relaxed text-paper-soft">
            The audit log lives in Supabase. Configure{" "}
            <code className="rounded-sm bg-ink px-1.5 py-0.5 text-[11px] text-brass">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and the service-role key on the backend, then every MCP call
            you make from a terminal will appear here in real time.
          </p>
        </Card>
      ) : rows.length === 0 ? (
        <Card className="p-5">
          <p className="text-[13px] italic text-paper-dim">
            No MCP calls yet. Once you start chatting with{" "}
            <code className="text-brass">claude</code> from a terminal, every
            tool invocation lands here.
          </p>
        </Card>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>When</TH>
              <TH>Tool</TH>
              <TH>Args</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r) => (
              <TR key={r.id}>
                <TD className="text-paper-soft">
                  {new Date(r.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </TD>
                <TD>
                  <span className="font-mono text-[12px] text-paper">
                    {r.tool_name}
                  </span>
                </TD>
                <TD className="max-w-md">
                  <code className="block truncate font-mono text-[11px] text-paper-soft">
                    {JSON.stringify(r.args_json)}
                  </code>
                </TD>
                <TD>
                  {r.result_status === "ok" ? (
                    <Badge variant="success">ok</Badge>
                  ) : (
                    <span title={r.error_message ?? undefined}>
                      <Badge variant="danger">error</Badge>
                    </span>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </Shell>
  );
}
