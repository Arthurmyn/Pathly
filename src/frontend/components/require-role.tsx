"use client";

import type { ReactNode } from "react";
import { Role, useAppState } from "./app-state";
import { Button, Card, LinkButton } from "./ui";

/** Route guard for the demo: each role sees only its own area (FR-01). The real app enforces this on the API with 403. */
export function RequireRole({ role, children }: { role: Exclude<Role, "guest">; children: ReactNode }) {
  const state = useAppState();
  if (!state.ready) return <div className="p-8 text-sm text-muted" aria-busy="true">Loading…</div>;
  if (state.role === role) return <>{children}</>;

  const area = role === "admin" ? "administrator" : "applicant";
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <h1 className="text-xl font-semibold">{state.role === "guest" ? "Sign in to continue" : "This area is not available for your role"}</h1>
        <p className="mt-2 text-muted">
          {state.role === "guest"
            ? `The ${area} area needs a sign-in. In this demo you can sign in with one click.`
            : `You are signed in as ${state.role === "admin" ? "an administrator" : "an applicant"}. The ${area} area is only for ${area}s (the API would answer 403).`}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => state.signIn(role)}>Continue as {area} (demo)</Button>
          <LinkButton href="/" variant="secondary">Back to start</LinkButton>
        </div>
      </Card>
    </div>
  );
}
