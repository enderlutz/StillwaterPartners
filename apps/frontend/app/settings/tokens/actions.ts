"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const PAT_PREFIX = "co_pat_";

function generatePat(): { plaintext: string; hash: string } {
  const random = randomBytes(24).toString("base64url");
  const plaintext = `${PAT_PREFIX}${random}`;
  const hash = createHash("sha256").update(plaintext).digest("hex");
  return { plaintext, hash };
}

export type PatRow = {
  id: string;
  name: string;
  last_used_at: string | null;
  created_at: string;
  revoked_at: string | null;
};

export async function createPat(formData: FormData): Promise<
  | { ok: true; plaintext: string; row: PatRow }
  | { ok: false; error: string }
> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Token name is required." };

  const supabase = createClient();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Supabase isn't configured. PATs require a real database — set NEXT_PUBLIC_SUPABASE_URL and the service-role key (backend) before generating tokens.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const { plaintext, hash } = generatePat();
  const { data, error } = await supabase
    .from("personal_access_tokens")
    .insert({ user_id: user.id, name, hashed_token: hash })
    .select("id, name, last_used_at, created_at, revoked_at")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Failed to create token." };
  }

  revalidatePath("/settings/tokens");
  return { ok: true, plaintext, row: data as PatRow };
}

export async function revokePat(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const { error } = await supabase
    .from("personal_access_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/settings/tokens");
  return { ok: true };
}

export async function listPats(): Promise<PatRow[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("personal_access_tokens")
    .select("id, name, last_used_at, created_at, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return (data as PatRow[]) ?? [];
}
