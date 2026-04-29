import { SignupFlow } from "./signup-flow";

export const metadata = { title: "Create account — Stillwater Partners" };
export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <div className="mb-7 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center border border-brass/50">
              <span className="text-[11px] font-medium tracking-[0.1em] text-brass">
                SP
              </span>
            </div>
            <div className="font-serif text-[18px] leading-none tracking-tight text-paper">
              Stillwater Partners
            </div>
          </div>
        </div>

        <SignupFlow />

        <p className="mt-8 text-[13px] text-paper-soft">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-brass underline-offset-4 transition-colors hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
