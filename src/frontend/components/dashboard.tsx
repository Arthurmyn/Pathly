"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatDate } from "@/lib/dates";
import { evaluateProgram, summarize } from "@/lib/eligibility";
import { getProgram } from "@/lib/mock-data";
import { generateRoadmap } from "@/lib/roadmap";
import { effectiveStatus } from "@/lib/status";
import { useAppState } from "./app-state";
import { OutcomeBar } from "./outcome-bar";
import { hasProfileData } from "./profile-utils";
import { Button, Callout, Card, EmptyState, LinkButton, PageHeader } from "./ui";
import type { Profile } from "@/lib/types";

function completeness(p: Profile): { filled: number; total: number } {
  const checks = [
    p.currentDegree != null, p.targetLevel != null, p.targetCountry != null, p.gpa != null,
    p.language.score != null || p.language.planned, p.exams.length > 0, p.workYears != null,
    p.intake != null, p.budgetUsd != null, p.documentsReady != null,
  ];
  return { filled: checks.filter(Boolean).length, total: checks.length };
}

export function Dashboard() {
  const state = useAppState();
  const { profile, today, shortlist } = state;
  const hasProfile = hasProfileData(profile);
  const { filled, total } = completeness(profile);

  const cards = useMemo(
    () =>
      shortlist.flatMap((slug) => {
        const program = getProgram(slug);
        if (!program) return [];
        const reqs = state.requirementsFor(slug);
        const results = evaluateProgram(profile, reqs, today);
        const tasks = generateRoadmap(program, reqs, results, today);
        const done = state.done[slug] ?? [];
        const attention = reqs.filter((r) => ["stale", "conflict", "missing"].includes(effectiveStatus(r, today))).length;
        return [{ slug, program, summary: summarize(results), next: tasks.filter((t) => !done.includes(t.id) && t.dependsOn.every((d) => done.includes(d))), attention }];
      }),
    [shortlist, profile, today, state],
  );

  const nextActions = cards
    .flatMap((c) => c.next.map((t) => ({ ...t, program: c.program.name, slug: c.slug })))
    .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"))
    .slice(0, 3);
  const attention = cards.filter((c) => c.attention > 0);

  if (!hasProfile) {
    return (
      <div>
        <PageHeader title="Welcome to Pathly" subtitle="Start with your profile. It is what Pathly compares with each programme's requirements." />
        <EmptyState
          title="Your profile is empty"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <LinkButton href="/app/onboarding">Start AI onboarding</LinkButton>
              <LinkButton href="/app/profile" variant="secondary">Fill in my profile</LinkButton>
              <Button variant="secondary" onClick={state.loadSampleProfile}>Use a sample profile</Button>
            </div>
          }
        >
          Until then every requirement would show as Unknown.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="What to do next, and what needs your attention." />

      <section aria-labelledby="next">
        <h2 id="next" className="mb-3 text-lg font-semibold">Your next actions</h2>
        {nextActions.length === 0 ? (
          <EmptyState title="No actions yet" action={<LinkButton href="/programs">Choose a programme</LinkButton>}>Add a programme to your shortlist to get a roadmap.</EmptyState>
        ) : (
          <ul className="space-y-2">
            {nextActions.map((t) => (
              <li key={`${t.slug}-${t.id}`} className="rounded-[20px] border border-line bg-surface shadow-[var(--shadow)] px-4 py-3">
                <p className="font-medium">{t.title}</p>
                <p className="text-sm text-muted">{t.program} · {t.dueDate ? `due ${formatDate(t.dueDate)}` : "date pending"} · {t.reason}</p>
                <Link href={`/app/applications/${t.slug}`} className="mt-1 inline-block text-sm text-primary hover:underline">Open roadmap</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {attention.length > 0 ? (
        <Callout tone="warn" title="Needs attention">
          Some requirements of your shortlisted programmes are outdated, missing or conflicting:
          <ul className="mt-1 list-disc pl-5">
            {attention.map((c) => (
              <li key={c.slug}><Link href={`/programs/${c.slug}`} className="underline">{c.program.name}</Link>: {c.attention} item{c.attention > 1 ? "s" : ""}</li>
            ))}
          </ul>
        </Callout>
      ) : null}

      <section aria-labelledby="short" className="grid gap-4 lg:grid-cols-[1fr_16rem]">
        <div>
          <h2 id="short" className="mb-3 text-lg font-semibold">Shortlist</h2>
          {cards.length === 0 ? (
            <EmptyState title="Nothing shortlisted yet" action={<LinkButton href="/programs">Browse programmes</LinkButton>} />
          ) : (
            <ul className="space-y-3">
              {cards.map((c) => (
                <li key={c.slug} className="rounded-[20px] border border-line bg-surface shadow-[var(--shadow)] p-4">
                  <Link href={`/app/applications/${c.slug}`} className="font-semibold hover:underline">{c.program.name}</Link>
                  <div className="mt-3"><OutcomeBar summary={c.summary} /></div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Card className="self-start">
          <h2 className="font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted">{filled} of {total} fields filled</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={filled} aria-valuemin={0} aria-valuemax={total}>
            <div className="h-full bg-primary" style={{ width: `${(filled / total) * 100}%` }} />
          </div>
          <div className="mt-3"><LinkButton href="/app/profile" variant="secondary">Edit profile</LinkButton></div>
        </Card>
      </section>
    </div>
  );
}
