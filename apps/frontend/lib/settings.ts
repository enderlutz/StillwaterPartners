// Mock-data toggle — stored as a cookie so both server and client code
// can read it. Default: mock ON when Supabase env vars are not set,
// OFF when they are. The user can override via the settings page.

import { cookies } from "next/headers";

const COOKIE = "client_os_use_mock";

export function getUseMockServer(): boolean {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Cookie can only be read in server context during a request — this
  // function is intended for use in Server Components / Route Handlers.
  const store = cookies();
  const val = store.get(COOKIE)?.value;
  if (val === "1") return true;
  if (val === "0") return false;

  // Default: mock if Supabase isn't configured; real if it is.
  return !supabaseConfigured;
}

export const USE_MOCK_COOKIE = COOKIE;
