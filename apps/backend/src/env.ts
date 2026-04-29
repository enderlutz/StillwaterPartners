import "dotenv/config";

// Backend env. Supabase is optional in dev — when missing, the backend falls
// back to mock data (reads work, writes refuse). In prod (Railway) all values
// must be set.
export const env = {
  port: Number(process.env.PORT ?? 3001),
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  // When the backend has no Supabase config, run in mock mode.
  // Reads return seeded mock data, writes are refused, PAT auth is skipped.
  isMock: !(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
};

if (env.isMock) {
  console.warn(
    "[backend] running in MOCK mode — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to use real data",
  );
}
