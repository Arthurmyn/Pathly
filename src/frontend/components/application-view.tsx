"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { evaluateProgram, summarize } from "@/lib/eligibility";
import { generateRoadmap } from "@/lib/roadmap";
import { getProgram, getUniversity } from "@/lib/mock-data";
import { useAppState } from "./app-state";
import { DeadlineLine } from "./deadline-line";
import { OutcomeBar } from "./outcome-bar";
import { hasProfileData } from "./profile-utils";
import { RequirementRow } from "./requirement-row";
import { TaskCard } from "./task-card";
import { Callout, Card, EmptyState, LinkButton, PageHeader } from "./ui";

type Tab = "roadmap" | "eligibility" | "deadline";

export function ApplicationView({ slug }: { slug: string }) {
  const state = useAppState();
  const [tab, setTab] = useState<Tab>("roadmap");
  const program = getProgram(slug)!;
  const uni = getUniversity(program.universityId)!;
  const { today, profile } = state;
  const reqs = state.requirementsFor(slug);
  const hasProfile = hasProfileData(profile);

  const results = useMemo(() => evaluateProgram(profile, reqs, today), [profile, reqs, today]);
  const summary = summarize(results);
  const tasks = useMemo(() => generateRoadmap(program, reqs, results, today), [program, reqs, results, today]);
  const done = state.done[slug] ?? [];
  const titleOf = new Map(tasks.map((t) => [t.id, t.title]));
  const labelOf = new Map(results.map((r) => [r.requirementId, r.label]));
  const byId = new Map(results.map((r) => [r.requirementId, r]));

  const tabs: { id: Tab; label: string }[] = [
    { id: "roadmap", label: "Roadmap" },
    { id: "eligibility", label: "Eligibility" },
    { id: "deadline", label: "Deadline" },
  ];

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
        <Link href="/app/applications" className="hover:text-ink">Applications</Link> / <span className="text-ink">{program.name}</span>
      </nav>
      <PageHeader
        title={program.name}
        subtitle={`${uni.name} · ${uni.city}, ${uni.country}`}
        actions={<LinkButton href={`/programs/${slug}`} variant="secondary">Programme page</LinkButton>}
      />

      {!hasProfile ? (
        <EmptyState
          title="Add your profile to get a roadmap"
          action={<div className="flex gap-2"><LinkButton href="/app/profile">Edit my profile</LinkButton><button type="button" onClick={state.loadSampleProfile} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-2">Use a sample profile</button></div>}
        >
          Without a profile every requirement is Unknown, so there is nothing to plan yet.
        </EmptyState>
      ) : (
        <>
          <div role="tablist" aria-label="Application sections" className="mb-4 flex gap-1 border-b border-line">
            {tabs.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${tab === t.id ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "roadmap" ? (
            <div role="tabpanel" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  <strong className="text-ink">{tasks.filter((t) => done.includes(t.id)).length} of {tasks.length}</strong> tasks done · The roadmap is recomputed whenever your profile or the data changes.
                </p>
              </div>
              <ol className="space-y-3" aria-label="Roadmap tasks">
                {tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    done={done.includes(t.id)}
                    blockedBy={t.dependsOn.filter((d) => !done.includes(d)).map((d) => titleOf.get(d) ?? d)}
                    gapLabel={t.gapRequirementId ? labelOf.get(t.gapRequirementId) ?? null : null}
                    today={today}
                    onToggle={() => state.toggleTask(slug, t.id)}
                  />
                ))}
              </ol>
              <Callout>Pathly does not submit applications. The last step is always done on the official website.</Callout>
            </div>
          ) : null}

          {tab === "eligibility" ? (
            <div role="tabpanel" className="space-y-4">
              <Card>
                <p className="text-sm text-muted">{summary.sentence}</p>
                <div className="mt-4"><OutcomeBar summary={summary} /></div>
              </Card>
              <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
                {reqs.map((r) => (
                  <RequirementRow key={r.id} requirement={r} today={today} result={byId.get(r.id)} />
                ))}
              </ul>
            </div>
          ) : null}

          {tab === "deadline" ? (
            <div role="tabpanel" className="space-y-4">
              <Card><DeadlineLine deadline={program.deadline} today={today} /></Card>
              <Callout>Task dates are counted back from a Verified deadline. If the deadline is not Verified, tasks have no date until it is verified.</Callout>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
