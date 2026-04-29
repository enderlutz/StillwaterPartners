import { createHash, randomBytes } from "node:crypto";
import { db } from "./db.js";
import { env } from "./env.js";

export type AuthContext = {
  userId: string;
  // Display label from the PAT row, useful for audit logs.
  tokenName: string;
};

export const PAT_PREFIX = "co_pat_";

// Generate a new PAT — returns plaintext (shown once) and the hash (stored).
export function generatePat(): { plaintext: string; hash: string } {
  const random = randomBytes(24).toString("base64url");
  const plaintext = `${PAT_PREFIX}${random}`;
  const hash = hashPat(plaintext);
  return { plaintext, hash };
}

export function hashPat(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

// Verify a bearer token against personal_access_tokens. Returns the user_id
// + token name on success. In mock mode any token is accepted as the dev user.
export async function verifyPat(token: string): Promise<AuthContext | null> {
  if (!token) return null;

  if (env.isMock) {
    return { userId: "00000000-0000-0000-0000-000000000000", tokenName: "dev" };
  }

  const supabase = db();
  if (!supabase) return null;

  const hash = hashPat(token);
  const { data, error } = await supabase
    .from("personal_access_tokens")
    .select("id, user_id, name")
    .eq("hashed_token", hash)
    .is("revoked_at", null)
    .maybeSingle();

  if (error || !data) return null;

  // Best-effort touch of last_used_at; failure shouldn't deny the request.
  void supabase
    .from("personal_access_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return { userId: data.user_id, tokenName: data.name };
}

export type AuditRecord = {
  toolName: string;
  args: unknown;
  status: "ok" | "error";
  errorMessage?: string;
};

// Append a row to mcp_audit_log. In mock mode just logs to stdout.
export async function audit(
  ctx: AuthContext,
  record: AuditRecord,
): Promise<void> {
  const line = `[mcp] ${record.status} ${record.toolName} user=${ctx.userId.slice(0, 8)} token=${ctx.tokenName}${
    record.errorMessage ? ` err="${record.errorMessage}"` : ""
  }`;
  console.log(line);

  if (env.isMock) return;
  const supabase = db();
  if (!supabase) return;

  await supabase.from("mcp_audit_log").insert({
    user_id: ctx.userId,
    tool_name: record.toolName,
    args_json: record.args ?? {},
    result_status: record.status,
    error_message: record.errorMessage ?? null,
  });
}
