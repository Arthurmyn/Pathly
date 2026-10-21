"use client";

import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { evaluateProgram, summarize } from "@/lib/eligibility";
import { getProgram, getUniversity } from "@/lib/mock-data";
import { effectiveStatus } from "@/lib/status";
import { useAppState } from "./app-state";
import { StatusBadge } from "./badges";
import { OutcomeBar } from "./outcome-bar";
import { Button, EmptyState, LinkButton, PageHeader } from "./ui";

export function ApplicationsList() {
  const state = useAppState();
  const { shortlist, today, profile } = state;

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Your shortlist with eligibility and the next deadline. Tasks are in the Roadmap. Submit on each university's official website."
        actions={<LinkButton href="/programs" variant="secondary">Add programmes</LinkButton>}
      />
      {shortlist.length === 0 ? (
        <EmptyState title="Your shortlist is empty" action={<LinkButton href="/programs">Browse programmes</LinkButton>}>
          Open a programme and choose &quot;Add to shortlist&quot; or &quot;Create my roadmap&quot;.
        </EmptyState>
      ) : (
        <ul className="stagger space-y-4">
          {shortlist.map((slug) => {
            const program = getProgram(slug);
            if (!program) return null;
            const uni = getUniversity(program.universityId)!;
            const reqs = state.requirementsFor(slug);
            const results = evaluateProgram(profile, reqs, today);
            const summary = summarize(results);
            const dStatus = effectiveStatus(program.deadline, today);
            return (
              <li key={slug} className="rounded-[20px] border border-line bg-surface shadow-[var(--shadow)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold"><Link href={`/app/applications/${slug}`} className="hover:underline">{program.name}</Link></h2>
                    <p className="text-sm text-muted">{uni.name} · {uni.country}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted">Deadline</span>
                    <strong>{dStatus === "verified" ? formatDate(program.deadline.date) : "not verified"}</strong>
                    <StatusBadge status={dStatus} quiet />
                  </div>
                </div>
                <div className="mt-4"><OutcomeBar summary={summary} /></div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted">{state.enrolled.includes(slug) ? "You reported that you are enrolled." : summary.sentence}</p>
                  <div className="flex gap-2">
                    <LinkButton href={`/app/applications/${slug}`}>Open application</LinkButton>
                    <Button variant="ghost" onClick={() => state.toggleShortlist(slug)}>Remove</Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
