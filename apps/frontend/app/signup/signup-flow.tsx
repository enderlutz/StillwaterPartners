"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signupWithInvite, validateInvite } from "./actions";

const gateInitial = {
  error: null as string | null,
  clientName: null as string | null,
  code: null as string | null,
};
const signupInitial = {
  error: null as string | null,
  info: null as string | null,
};

export function SignupFlow() {
  const [validated, setValidated] = useState<{
    code: string;
    clientName: string;
  } | null>(null);

  if (!validated) return <Gate onValidated={setValidated} />;
  return <Form code={validated.code} clientName={validated.clientName} />;
}

function Gate({
  onValidated,
}: {
  onValidated: (v: { code: string; clientName: string }) => void;
}) {
  const [state, formAction] = useFormState(validateInvite, gateInitial);

  useEffect(() => {
    if (state?.code && state?.clientName) {
      onValidated({ code: state.code, clientName: state.clientName });
    }
  }, [state, onValidated]);

  return (
    <>
      <h1 className="mb-2 font-serif text-[32px] font-medium leading-[1.1] tracking-tight text-paper">
        Access password
      </h1>
      <p className="mb-8 text-[14px] leading-relaxed text-paper-soft">
        Enter the access password your account manager sent you.
      </p>
      <form action={formAction} className="space-y-7">
        <Underlined label="Access password">
          <input
            type="password"
            name="code"
            autoComplete="off"
            required
            placeholder="••••••••••••"
            className="block w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-[15px] text-paper placeholder:text-paper-dim/70 transition-colors focus:border-brass focus:outline-none focus:ring-0"
          />
        </Underlined>

        {state?.error && (
          <div className="border-l-2 border-brass-bright bg-brass-bright/[0.05] px-3 py-2 text-[12px] leading-snug text-brass-bright">
            {state.error}
          </div>
        )}

        <Submit pendingLabel="Verifying…" idleLabel="Continue" />
      </form>
    </>
  );
}

function Form({
  code,
  clientName,
}: {
  code: string;
  clientName: string;
}) {
  const [state, formAction] = useFormState(signupWithInvite, signupInitial);
  const router = useRouter();

  useEffect(() => {
    if (state?.info === "redirect") {
      router.replace("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <>
      <h1 className="mb-2 font-serif text-[32px] font-medium leading-[1.1] tracking-tight text-paper">
        Create your account
      </h1>
      <p className="mb-8 text-[14px] leading-relaxed text-paper-soft">
        You&apos;re joining the workspace for{" "}
        <span className="text-paper">{clientName}</span>.
      </p>

      <form action={formAction} className="space-y-7">
        <input type="hidden" name="code" value={code} />

        <Underlined label="Full name">
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Your given name"
            className="block w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-[15px] text-paper placeholder:text-paper-dim/70 transition-colors focus:border-brass focus:outline-none focus:ring-0"
          />
        </Underlined>
        <Underlined label="Email">
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@firm.com"
            className="block w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-[15px] text-paper placeholder:text-paper-dim/70 transition-colors focus:border-brass focus:outline-none focus:ring-0"
          />
        </Underlined>
        <Underlined label="Choose a password">
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="••••••••"
            className="block w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-[15px] text-paper placeholder:text-paper-dim/70 transition-colors focus:border-brass focus:outline-none focus:ring-0"
          />
        </Underlined>

        {state?.error && (
          <div className="border-l-2 border-brass-bright bg-brass-bright/[0.05] px-3 py-2 text-[12px] leading-snug text-brass-bright">
            {state.error}
          </div>
        )}
        {state?.info && state.info !== "redirect" && (
          <div className="border-l-2 border-brass bg-brass/[0.05] px-3 py-2 text-[12px] leading-snug text-brass">
            {state.info}
          </div>
        )}

        <Submit pendingLabel="Creating account…" idleLabel="Create account" />
      </form>
    </>
  );
}

function Submit({
  pendingLabel,
  idleLabel,
}: {
  pendingLabel: string;
  idleLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="block w-full border border-brass/40 bg-brass py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:bg-brass-bright disabled:opacity-60"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

function Underlined({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
