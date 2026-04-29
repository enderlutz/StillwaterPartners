import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.js";

let _client: SupabaseClient | null = null;

// Service-role Supabase client. Bypasses RLS — only the backend should hold it.
// In mock mode this returns null; callers must check.
export function db(): SupabaseClient | null {
  if (env.isMock) return null;
  if (!_client) {
    _client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}
