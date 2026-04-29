"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ClientInvite } from "@/lib/types";

const TOKEN_PREFIX = "inv_";

function generateToken(): { token: string; hash: string; prefix: string } {
  const raw = randomBytes(18).toString("base64url");
  const token = `${TOKEN_PREFIX}${raw}`;
  const hash = createHash("sha256").update(token).digest("hex");
  return { token, hash, prefix: token.slice(0, 12) };
}

export type InviteRow = ClientInvite & {
  client_name: string;
  status: "active" | "exhausted" | "expired" | "revoked";
};

async function requireTeamMember() {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase not configured.");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "team_member") {
    throw new Error("Only team members can manage invites.");
  }
  return { supabase, userId: user.id };
}

function statusOf(row: ClientInvite): InviteRow["status"] {
  if (row.revoked_at) return "revoked";
  if (row.expires_at && new Date(row.expires_at) < new Date()) return "expired";
  if (row.max_uses !== null && row.use_count >= row.max_uses) return "exhausted";
  return "active";
}

export async function listInvites(): Promise<InviteRow[]> {
  const { supabase } = await requireTeamMember();
  const { data, error } = await supabase
    .from("client_invites")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: ClientInvite & { clients?: { name: string } }) => ({
    ...r,
    client_name: r.clients?.name ?? r.client_id,
    status: statusOf(r),
  }));
}

export async function listClientsForInvite(): Promise<
  { id: string; name: string }[]
> {
  const { supabase } = await requireTeamMember();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createInvite(
  _prev: { error: string | null; token: string | null } | null,
  formData: FormData,
): Promise<{ error: string | null; token: string | null }> {
  let supabase, userId;
  try {
    ({ supabase, userId } = await requireTeamMember());
  } catch (e) {
    return { error: (e as Error).message, token: null };
  }

  const clientId = String(formData.get("client_id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const maxUsesRaw = String(formData.get("max_uses") ?? "").trim();
  const maxUses = maxUsesRaw === "" ? null : Number(maxUsesRaw);

  if (!clientId) return { error: "Pick a client.", token: null };
  if (maxUses !== null && (Number.isNaN(maxUses) || maxUses < 1)) {
    return { error: "Max uses must be a positive integer or empty.", token: null };
  }

  const { token, hash, prefix } = generateToken();
  const { error: insertError } = await supabase.from("client_invites").insert({
    client_id: clientId,
    label: label || `Invite for ${clientId}`,
    token_hash: hash,
    token_prefix: prefix,
    created_by: userId,
    max_uses: maxUses,
  });
  if (insertError) return { error: insertError.message, token: null };

  revalidatePath("/brain/invites");
  return { error: null, token };
}

export async function revokeInvite(formData: FormData): Promise<void> {
  const { supabase } = await requireTeamMember();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase
    .from("client_invites")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/brain/invites");
}
