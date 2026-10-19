"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/dates";
import { evaluateProgram, summarize } from "@/lib/eligibility";
import { getProgram, getUniversity, LEVEL_LABEL } from "@/lib/mock-data";
import { generateRoadmap } from "@/lib/roadmap";
import { effectiveStatus } from "@/lib/status";
import { useAppState } from "./app-state";
import { DeadlineLine } from "./deadline-line";
import { IconChat, IconFilter } from "./icons";
import { OutcomeBar } from "./outcome-bar";
import { PillTabs } from "./pill-tabs";
import { BookmarkButton, ShareButton, TitleRow, UniversityCard } from "./page-hero";
import { hasProfileData } from "./profile-utils";
import { ProgressCard, RailCard, RelatedList, SourceList, StepList, type StepItem } from "./rail";
import { relatedFor, sourcesFor } from "./rail-data";
import { RequirementRow } from "./requirement-row";
import { TaskCard } from "./task-card";
import { Callout, Card, EmptyState, LinkButton, Tag } from "./ui";
import { StatusBadge } from "./badges";

type Tab = "roadmap" | "eligibility" | "deadline";

export function ApplicationView({ slug }: { slug: string }) {
  const state = useAppState();
  const [tab, setTab] = useState<Tab>("roadmap");
  const [show, setShow] = useState<"all" | "todo">("all");
  const program = getProgram(slug)!;
  const uni = getUniversity(program.universityId)!;
  const { today, profile } = state;
  const reqs = state.requirementsFor(slug);
  const hasProfile = hasProfileData(profile);

  const results = useMemo(() => evaluateProgram(profile, reqs, today), [profile, reqs, today]);
  const summary = summarize(results);
  const tasks = useMemo(() => generateRoadmap(program, reqs, results, today), [program, reqs, results, today]);
  const done = state.done[slug] ?? [];
  const doneCount = tasks.filter((t) => done.includes(t.id)).length;
  const titleOf = new Map(tasks.map((t) => [t.id, t.title]));
  const labelOf = new Map(results.map((r) => [r.requirementId, r.label]));
  const byId = new Map(results.map((r) => [r.requirementId, r]));
  const shown = show === "all" ? tasks : tasks.filter((t) => !done.includes(t.id));
  const dStatus = effectiveStatus(program.deadline, today);

  const firstOpen = tasks.find((t) => !done.includes(t.id) && t.dependsOn.every((d) => done.includes(d)));
  const steps: StepItem[] = tasks.slice(0, 6).map((t) => ({
    id: t.id,
    title: t.title,
    subtitle: t.type === "verify" ? "Verify data" : t.type === "submit" ? "Official website" : t.dueDate ? formatDate(t.dueDate) : "Date pending",
    meta: t.dueDate && !t.asap ? `D−${t.offsetDays}` : t.asap ? "Now" : "",
    state: done.includes(t.id) ? "done" : t.id === firstOpen?.id ? "current" : "todo",
  }));

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "roadmap", label: "Roadmap", count: tasks.length },
    { id: "eligibility", label: "Eligibility", count: reqs.length },
    { id: "deadline", label: "Deadline" },
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="min-w-0">
        <TitleRow title={program.name}>
          <BookmarkButton saved={state.shortlist.includes(slug)} onToggle={() => state.toggleShortlist(slug)} />
          <ShareButton />
        </TitleRow>
        <div className="mb-4 flex flex-wrap gap-2"><Tag>{LEVEL_LABEL[program.level]}</Tag><Tag>{program.field}</Tag></div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <UniversityCard uni={uni}>
            <LinkButton href="/app/advisor"><IconChat size={16} /> Ask the advisor</LinkButton>
            <LinkButton href={`/programs/${slug}`} variant="secondary">Programme page</LinkButton>
          </UniversityCard>
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-2">Deadline <strong>{dStatus === "verified" ? formatDate(program.deadline.date) : "not verified"}</strong><StatusBadge status={dStatus} /></span>
              <span><strong>{doneCount} of {tasks.length}</strong> tasks done</span>
            </div>
            <div className="mt-3"><OutcomeBar summary={summary} /></div>
            <p className="mt-3 text-sm text-muted">{summary.sentence}</p>
          </Card>
        </div>

        {!hasProfile ? (
          <EmptyState
            title="Add your profile to get a roadmap"
            action={<div className="flex gap-2"><LinkButton href="/app/profile">Edit my profile</LinkButton><button type="button" onClick={state.loadSampleProfile} className="rounded-full border border-line bg-surface px-5 py-2 text-sm font-semibold hover:bg-surface-2">Use a sample profile</button></div>}
          >
            Without a profile every requirement is Unknown, so there is nothing to plan yet.
          </EmptyState>
        ) : (
          <>
            <PillTabs<Tab>
              label="Application sections"
              value={tab}
              onChange={setTab}
              tabs={tabs}
              right={
                tab === "roadmap" ? (
                  <label className="inline-flex items-center gap-2 text-sm font-medium">
                    <IconFilter size={16} />
                    <span className="sr-only">Show</span>
                    <select value={show} onChange={(e) => setShow(e.target.value as "all" | "todo")} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
                      <option value="all">All tasks</option>
                      <option value="todo">To do</option>
                    </select>
                  </label>
                ) : null
              }
            />

            <div className="mt-5">
              {tab === "roadmap" ? (
                <div role="tabpanel" id="panel-roadmap" aria-labelledby="tab-roadmap" className="space-y-4">
                  <p className="text-sm text-muted">The roadmap is recomputed whenever your profile or the data changes.</p>
                  {shown.length === 0 ? <Callout>Everything is done. Submit on the official website.</Callout> : null}
                  <ol className="space-y-3" aria-label="Roadmap tasks">
                    {shown.map((t) => (
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
                <div role="tabpanel" id="panel-eligibility" aria-labelledby="tab-eligibility">
                  <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface shadow-[var(--shadow)]">
                    {reqs.map((r) => (
                      <RequirementRow key={r.id} requirement={r} today={today} result={byId.get(r.id)} />
                    ))}
                  </ul>
                </div>
              ) : null}

              {tab === "deadline" ? (
                <div role="tabpanel" id="panel-deadline" aria-labelledby="tab-deadline" className="space-y-4">
                  <Card><DeadlineLine deadline={program.deadline} today={today} /></Card>
                  <Callout>Task dates are counted back from a Verified deadline. If the deadline is not Verified, tasks have no date until it is verified.</Callout>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>

      <aside className="space-y-4" aria-label="Summary">
        <ProgressCard
          label="Roadmap progress"
          title={`${doneCount} of ${tasks.length} tasks completed`}
          subtitle="Complete a task to unlock the next one."
          percent={tasks.length ? (doneCount / tasks.length) * 100 : 0}
        />
        {hasProfile ? <RailCard label="Next steps"><StepList steps={steps} /></RailCard> : null}
        <RailCard label="Sources"><SourceList items={sourcesFor(reqs)} /></RailCard>
        <RailCard label="Related programmes"><RelatedList items={relatedFor(slug)} /></RailCard>
      </aside>
    </div>
  );
}
