"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAppState } from "./app-state";
import { IconEye, IconEyeOff } from "./icons";
import { Logo } from "./logo";
import { STATIONS } from "./route-stations";

const field =
  "w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-2 focus:border-primary focus:shadow-[0_0_0_4px_var(--primary-soft)]";

/** Sign up and log in: a short form beside the five stations of the applicant's admission route. */
export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const { signIn } = useAppState();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<{ field: "email" | "password"; text: string } | null>(null);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const passOk = mode === "login" ? password.length > 0 : password.length >= 8;
  // The lit part of the route fills as the form becomes valid: first station, then the line towards the second.
  const progress = (emailOk ? 0.5 : email ? 0.15 : 0) + (passOk ? 0.5 : password ? 0.15 : 0);
  const isRegister = mode === "register";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!emailOk) return setError({ field: "email", text: "Enter an email address like name@example.com." });
    if (!passOk) return setError({ field: "password", text: isRegister ? "Use at least 8 characters." : "Enter your password." });
    setError(null);
    signIn("applicant");
    router.push(isRegister ? "/app/profile" : "/app");
  }

  return (
    <div className="grid min-h-screen bg-page lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16 lg:py-10 xl:px-24">
        <Logo />
        <div className="enter my-auto w-full max-w-[30rem] py-12">
          <div className="mb-8 inline-flex rounded-full border border-line bg-surface p-1 text-sm font-medium" role="tablist" aria-label="Account">
            <Link href="/register" role="tab" aria-selected={isRegister} className={`press rounded-full px-4 py-1.5 transition-colors duration-150 ${isRegister ? "bg-primary text-primary-fg" : "text-ink hover:bg-surface-2"}`}>
              Sign up
            </Link>
            <Link href="/login" role="tab" aria-selected={!isRegister} className={`press rounded-full px-4 py-1.5 transition-colors duration-150 ${!isRegister ? "bg-primary text-primary-fg" : "text-ink hover:bg-surface-2"}`}>
              Log in
            </Link>
          </div>
          <h1 className="text-balance text-[clamp(2rem,4.2vw,2.9rem)] font-medium leading-[1.04] tracking-[-0.025em] text-heading">
            {isRegister ? "Start your route to the right programme." : "Continue your route."}
          </h1>
          <p className="mt-4 max-w-[26rem] text-[17px] leading-relaxed text-muted">
            {isRegister
              ? "Create an account and Pathly builds the path from your profile to the official application."
              : "Pick up where you left off: your profile, shortlist and roadmap are waiting."}
          </p>

          <form onSubmit={submit} className="mt-9 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
              <input id="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" aria-invalid={error?.field === "email"} aria-describedby={error?.field === "email" ? "auth-error" : undefined} className={field} />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
              <div className="relative">
                <input id="password" type={show ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isRegister ? "At least 8 characters" : "Your password"} aria-invalid={error?.field === "password"} aria-describedby={error?.field === "password" ? "auth-error" : undefined} className={`${field} pr-12`} />
                <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"} className="press absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink">
                  {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>
            {error ? (
              <p id="auth-error" role="alert" className="slide-down text-sm font-medium" style={{ color: "var(--danger)" }}>{error.text}</p>
            ) : null}
            <button type="submit" className="btn w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-fg hover:bg-primary-hover">
              {isRegister ? "Create account" : "Log in"}
            </button>
          </form>

          <div className="mt-8 border-t border-line pt-6 text-sm text-muted">
            <p>No account is created in this demo. Any valid email works, or skip the form:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => { signIn("applicant"); router.push("/app"); }} className="btn rounded-full border border-line bg-surface px-4 py-2 font-semibold text-ink hover:bg-surface-2">Continue as applicant</button>
              <button type="button" onClick={() => { signIn("admin"); router.push("/admin"); }} className="btn rounded-full border border-line bg-surface px-4 py-2 font-semibold text-ink hover:bg-surface-2">Continue as administrator</button>
            </div>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted lg:hidden">Your route: Profile, Requirements, Gaps, Roadmap, then the official website.</p>
        <p className="text-xs text-muted">Pathly · diploma project, Astana IT University. Pathly does not submit applications.</p>
      </div>

      <aside aria-label="Your admission route" className="relative hidden p-4 lg:block">
        <div className="relative h-full rounded-[32px] border border-line bg-sheet px-14 py-16 shadow-[var(--shadow)]">
          <div className="pointer-events-none absolute right-10 top-10 flex h-[132px] w-[132px] -rotate-[8deg] items-center justify-center rounded-full border-2 border-dashed border-strong text-center text-[12px] font-medium leading-tight text-muted" aria-hidden="true">
            Illustrative
            <br />
            demo data
          </div>
          <h2 className="max-w-[18rem] text-[1.35rem] font-medium leading-snug text-heading">Your admission route, in five stations.</h2>
          <ol className="relative mt-12 space-y-12 pl-0">
            <span className="absolute left-[23px] top-6 h-[calc(100%-3rem)] w-[3px] rounded-full bg-line" aria-hidden="true" />
            <span
              className="absolute left-[23px] top-6 h-[calc(100%-3rem)] w-[3px] origin-top rounded-full bg-primary transition-transform duration-500 ease-[var(--ease-out)]"
              style={{ transform: `scaleY(${Math.min(progress, 1) * 0.25})` }}
              aria-hidden="true"
            />
            {STATIONS.map((s, i) => {
              const Icon = s.icon;
              const lit = i === 0 || (i === 1 && progress >= 1);
              return (
                <li key={s.title} className="enter relative flex items-start gap-6" style={{ animationDelay: `${i * 60}ms` }}>
                  <span
                    className={`relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] transition-colors duration-300 ${lit ? "border-primary bg-primary text-primary-fg" : "border-strong bg-surface text-ink"}`}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="pt-1">
                    <p className="text-[1.15rem] font-medium leading-tight text-heading">{s.title}</p>
                    <p className="mt-1 max-w-[24rem] text-[15px] leading-snug text-muted">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>
    </div>
  );
}
