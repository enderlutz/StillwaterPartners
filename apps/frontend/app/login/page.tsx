import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in — Client OS" };
export const dynamic = "force-dynamic";

export default function LoginPage() {
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
            Sign in
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-paper-soft">
            Welcome back.
          </p>
        </div>

        <LoginForm />

        <p className="mt-8 text-[13px] text-paper-soft">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-brass underline-offset-4 transition-colors hover:underline"
          >
            Request access
          </a>
        </p>
      </div>
    </div>
  );
}
