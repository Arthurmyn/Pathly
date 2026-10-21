"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/dates";
import { evaluateProgram, summarize } from "@/lib/eligibility";
import { getProgram, getUniversity, LEVEL_LABEL } from "@/lib/mock-data";
import { effectiveStatus } from "@/lib/status";
import { useAppState } from "./app-state";
import { DeadlineLine } from "./deadline-line";
import { IconChat } from "./icons";
import { OutcomeBar } from "./outcome-bar";
import { PillTabs } from "./pill-tabs";
import { BookmarkButton, ShareButton, TitleRow, UniversityCard } from "./page-hero";
import { hasProfileData } from "./profile-utils";
import { RailCard, RelatedList, SourceList } from "./rail";
import { relatedFor, sourcesFor } from "./rail-data";
import { RequirementRow } from "./requirement-row";
import { Callout, Card, EmptyState, LinkButton, Tag } from "./ui";
import { StatusBadge } from "./badges";

type Tab = "eligibility" | "deadline";

export function ApplicationView({ slug }: { slug: string }) {
  const state = useAppState();
  const [tab, setTab] = useState<Tab>("eligibility");
  const program = getProgram(slug)!;
  const uni = getUniversity(program.universityId)!;
  const { today, profile } = state;
  const reqs = state.requirementsFor(slug);
  const hasProfile = hasProfileData(profile);

  const results = useMemo(() => evaluateProgram(profile, reqs, today), [profile, reqs, today]);
  const summary = summarize(results);
  const byId = new Map(results.map((r) => [r.requirementId, r]));
  const dStatus = effectiveStatus(program.deadline, today);

  const tabs: { id: Tab; label: string; count?: number }[] = [
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
              <span className="inline-flex items-center gap-2">Deadline <strong>{dStatus === "verified" ? formatDate(program.deadline.date) : "not verified"}</strong><StatusBadge status={dStatus} hideVerified /></span>
            </div>
            <div className="mt-3"><OutcomeBar summary={summary} /></div>
            <p className="mt-3 text-sm text-muted">{summary.sentence}</p>
          </Card>
        </div>

        {!hasProfile ? (
          <EmptyState
            title="Add your profile to see your results"
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
            />

            <div className="mt-5">
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
        <RailCard label="Your progress">
          {state.enrolled.includes(slug) ? (
            <p className="text-sm">You reported that you are enrolled in this programme.</p>
          ) : (
            <p className="text-sm text-muted">Your tasks for this programme are in the Roadmap.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <LinkButton href="/app/roadmap" variant="secondary">Open roadmap</LinkButton>
            <button type="button" onClick={() => state.toggleEnrolled(slug)} className="press inline-flex min-h-10 items-center rounded-full border border-line bg-surface px-5 py-2 text-sm font-semibold hover:bg-surface-2">
              {state.enrolled.includes(slug) ? "Undo: not enrolled" : "I am enrolled"}
            </button>
          </div>
        </RailCard>
        <RailCard label="Sources"><SourceList items={sourcesFor(reqs)} /></RailCard>
        {state.enrolled.includes(slug) ? null : <RailCard label="Related programmes"><RelatedList items={relatedFor(slug)} /></RailCard>}
      </aside>
    </div>
  );
}
