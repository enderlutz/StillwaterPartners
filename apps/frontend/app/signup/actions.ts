"use server";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashToken(raw: string): string {
  return createHash("sha256").update(raw.trim()).digest("hex");
}

type InviteCheck =
  | { ok: true; clientId: string; clientName: string; inviteId: string }
  | { ok: false; error: string };

async function checkInvite(code: string): Promise<InviteCheck> {
  if (!code || code.length < 6) {
    return { ok: false, error: "Invalid access password." };
  }
  const supabase = createClient();
  if (!supabase) {
    return { ok: false, error: "Auth is not configured." };
  }

  const hash = hashToken(code);
  const { data: invite } = await supabase
    .from("client_invites")
    .select("id, client_id, expires_at, revoked_at, max_uses, use_count, clients(name)")
    .eq("token_hash", hash)
    .maybeSingle();

  if (!invite) return { ok: false, error: "That access password isn't recognized." };
  if (invite.revoked_at) {
    return { ok: false, error: "This invite has been revoked. Ask your account manager for a new one." };
  }
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { ok: false, error: "This invite has expired." };
  }
  if (invite.max_uses !== null && invite.use_count >= invite.max_uses) {
    return { ok: false, error: "This invite has reached its use limit." };
  }

  // Supabase types embedded relationships as arrays unless inner-joined.
  const embedded = (invite as { clients?: { name: string } | { name: string }[] })
    .clients;
  const clientName = Array.isArray(embedded)
    ? (embedded[0]?.name ?? invite.client_id)
    : (embedded?.name ?? invite.client_id);
  return {
    ok: true,
    clientId: invite.client_id,
    clientName,
    inviteId: invite.id,
  };
}

export async function validateInvite(
  _prev: { error: string | null; clientName: string | null; code: string | null } | null,
  formData: FormData,
): Promise<{ error: string | null; clientName: string | null; code: string | null }> {
  const code = String(formData.get("code") ?? "").trim();
  const result = await checkInvite(code);
  if (!result.ok) return { error: result.error, clientName: null, code: null };
  return { error: null, clientName: result.clientName, code };
}

export async function signupWithInvite(
  _prev: { error: string | null; info: string | null } | null,
  formData: FormData,
): Promise<{ error: string | null; info: string | null }> {
  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (name.length < 2) return { error: "Name too short.", info: null };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address.", info: null };
  if (password.length < 8) return { error: "Password must be at least 8 characters.", info: null };

  const check = await checkInvite(code);
  if (!check.ok) return { error: check.error, info: null };

  // Use a cookie-bound client so the new auth session sticks for the redirect.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const cookieStore = cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      get: (n: string) => cookieStore.get(n)?.value,
      set: (n: string, v: string, opts: CookieOptions) =>
        cookieStore.set({ name: n, value: v, ...opts }),
      remove: (n: string, opts: CookieOptions) =>
        cookieStore.set({ name: n, value: "", ...opts }),
    },
  });

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (signUpError) return { error: signUpError.message, info: null };

  if (!data.user) {
    return {
      error: null,
      info: "Application received. Check your email for a confirmation link before signing in.",
    };
  }

  // Bind the new profile to the invite's client and increment use_count.
  // Profile insert needs to run with the user's session (RLS), but the cookie
  // client above already holds it after signUp.
  await supabase.from("profiles").upsert({
    id: data.user.id,
    role: "client",
    client_id: check.clientId,
    full_name: name,
    must_change_password: false,
  });

  const adminClient = createClient();
  if (adminClient) {
    await adminClient
      .from("client_invites")
      .update({
        use_count: (await getCurrentCount(check.inviteId)) + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", check.inviteId);
  }

  if (data.session) {
    return { error: null, info: "redirect" };
  }
  return {
    error: null,
    info: "Application received. Check your email for a confirmation link before signing in.",
  };
}

async function getCurrentCount(inviteId: string): Promise<number> {
  const supabase = createClient();
  if (!supabase) return 0;
  const { data } = await supabase
    .from("client_invites")
    .select("use_count")
    .eq("id", inviteId)
    .maybeSingle();
  return data?.use_count ?? 0;
}
