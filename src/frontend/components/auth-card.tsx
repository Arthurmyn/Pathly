"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAppState } from "./app-state";
import { Button, Callout, Card } from "./ui";

/** Demo sign-in: no password is checked and nothing is sent. The real app uses JWT with hashed passwords (NFR-01). */
export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const { signIn } = useAppState();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (mode === "register" && password.length < 8) return setError("Use at least 8 characters for the password.");
    if (!password) return setError("Enter your password.");
    setError(null);
    signIn("applicant");
    router.push(mode === "register" ? "/app/profile" : "/app");
  }

  return (
    <div className="mx-auto max-w-md space-y-4 py-8">
      <Card>
        <h1 className="text-2xl font-semibold tracking-tight">{mode === "login" ? "Log in" : "Create your account"}</h1>
        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <label className="block text-sm font-medium">
            Email
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2" />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2" />
            {mode === "register" ? <span className="mt-1 block text-xs font-normal text-muted">At least 8 characters.</span> : null}
          </label>
          {error ? <p role="alert" className="text-sm" style={{ color: "var(--st-conflict-fg)" }}>{error}</p> : null}
          <Button type="submit" className="w-full">{mode === "login" ? "Log in" : "Create account"}</Button>
        </form>
      </Card>
      <Callout title="Demo shortcuts">
        <p>No account is created. Use any valid email, or skip the form:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => { signIn("applicant"); router.push("/app"); }}>Continue as applicant</Button>
          <Button variant="secondary" onClick={() => { signIn("admin"); router.push("/admin"); }}>Continue as administrator</Button>
        </div>
      </Callout>
    </div>
  );
}
