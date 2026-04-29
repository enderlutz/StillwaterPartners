import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "Request access — Client OS" };

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <div className="mb-7 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center border border-brass/50">
              <span className="text-[11px] font-medium tracking-[0.1em] text-brass">
                CO
              </span>
            </div>
            <div className="font-serif text-[18px] leading-none tracking-tight text-paper">
              Client OS
            </div>
          </div>
          <h1 className="font-serif text-[32px] font-medium leading-[1.1] tracking-tight text-paper">
            Request access
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-paper-soft">
            Team members only, for now.
          </p>
        </div>

        <SignupForm />

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
