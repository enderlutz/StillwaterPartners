import { Shell } from "@/components/shell";
import { PageHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { listPats } from "./actions";
import { TokensClient } from "./tokens-client";

export const metadata = { title: "Tokens — Settings — Client OS" };
export const dynamic = "force-dynamic";

export default async function TokensPage() {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const tokens = await listPats();

  return (
    <Shell>
      <PageHeader
        eyebrow="Settings"
        title="Personal access tokens"
        description="Tokens authenticate the MCP server from your terminal. One token per device — revoke instantly if a device is lost."
      />

      <div className="mb-6">
        <Card className="p-5">
          <div className="text-[13px] font-medium text-paper">
            How this works
          </div>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] leading-relaxed text-paper-soft">
            <li>Generate a token below, give it a name (e.g. <em>MacBook</em>).</li>
            <li>Copy it once — the plaintext is shown only at creation.</li>
            <li>
              On each device, run:{" "}
              <code className="rounded-sm bg-ink px-1.5 py-0.5 text-[11px] tabular-nums text-brass">
                claude mcp add --transport sse client-os &lt;url&gt;/mcp --header
                &quot;Authorization: Bearer &lt;token&gt;&quot;
              </code>
            </li>
            <li>Every <code className="text-brass">claude</code> session on that device now has read + write access to Client OS.</li>
          </ol>
        </Card>
      </div>

      <TokensClient
        initialTokens={tokens}
        supabaseConfigured={supabaseConfigured}
      />
    </Shell>
  );
}
