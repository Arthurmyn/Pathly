"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/dates";
import { evaluateProgram, summarize } from "@/lib/eligibility";
import { getProgram, getUniversity, LEVEL_LABEL } from "@/lib/mock-data";
import { effectiveStatus } from "@/lib/status";
import type { Requirement } from "@/lib/types";
import { useAppState } from "./app-state";
import { OutcomeBadge } from "./badges";
import { DeadlineLine } from "./deadline-line";
import { OutcomeBar } from "./outcome-bar";
import { hasProfileData } from "./profile-utils";
import { RequirementRow } from "./requirement-row";
import { Button, Callout, Card, IllustrativeNote, LinkButton, Tag } from "./ui";

type Tab = "requirements" | "deadlines" | "about";

export function ProgramView({ slug }: { slug: string }) {
  const state = useAppState();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("requirements");
  const program = getProgram(slug)!;
  const uni = getUniversity(program.universityId)!;
  const { today, role, profile } = state;

  const reqs = state.requirementsFor(slug);
  const showResults = role === "applicant" && hasProfileData(profile);
  const results = useMemo(() => (showResults ? evaluateProgram(profile, reqs, today) : []), [showResults, profile, reqs, today]);
  const summary = summarize(results);
  const byId = new Map(results.map((r) => [r.requirementId, r]));

  const groups = useMemo(() => {
    const map = new Map<string, Requirement[]>();
    for (const r of reqs) map.set(r.pathway, [...(map.get(r.pathway) ?? []), r]);
    return Array.from(map.entries());
  }, [reqs]);

  const lastChecked = reqs.map((r) => r.verifiedAt).filter(Boolean).sort().pop() ?? null;
  const gaps = results.filter((r) => r.outcome !== "met");
  const inShortlist = state.shortlist.includes(slug);

  function startRoadmap() {
    if (!inShortlist) state.toggleShortlist(slug);
    router.push(`/app/applications/${slug}`);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "requirements", label: "Requirements" },
    { id: "deadlines", label: "Deadlines" },
    { id: "about", label: "About" },
  ];

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/programs" className="hover:text-ink">Programmes</Link> / <span className="text-ink">{program.name}</span>
      </nav>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{program.name}</h1>
          <p className="mt-1 text-muted">{uni.name} · {uni.city}, {uni.country}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Tag>{LEVEL_LABEL[program.level]}</Tag>
            <Tag>{program.field}</Tag>
            <Tag>Taught in {program.language}</Tag>
          </div>
        </div>
        <div className="text-sm text-muted sm:text-right">
          <a href={program.officialUrl} target="_blank" rel="noreferrer noopener" className="text-primary underline-offset-2 hover:underline">Official programme page</a>
          <p className="mt-1">Last checked: {formatDate(lastChecked)}</p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <div role="tablist" aria-label="Programme sections" className="mb-4 flex gap-1 border-b border-line">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${tab === t.id ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "requirements" ? (
            <div role="tabpanel" id="panel-requirements" aria-labelledby="tab-requirements" className="space-y-6">
              {role === "guest" ? (
                <Callout title="Check your own eligibility">
                  Build a profile in about three minutes and see Met, Not met, Pending or Unknown for each requirement below.
                  <div className="mt-2"><LinkButton href="/register">Build my profile</LinkButton></div>
                </Callout>
              ) : null}
              {groups.map(([pathway, list]) => (
                <section key={pathway} aria-label={pathway}>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{pathway}</h2>
                  <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
                    {list.map((r) => (
                      <RequirementRow key={r.id} requirement={r} today={today} result={byId.get(r.id)} />
                    ))}
                  </ul>
                </section>
              ))}
              <IllustrativeNote />
            </div>
          ) : null}

          {tab === "deadlines" ? (
            <div role="tabpanel" id="panel-deadlines" aria-labelledby="tab-deadlines" className="space-y-4">
              <Card><DeadlineLine deadline={program.deadline} today={today} /></Card>
              <Callout>Deadlines are valid until the end of their admission cycle. A deadline that is not Verified is never used to date roadmap tasks.</Callout>
            </div>
          ) : null}

          {tab === "about" ? (
            <div role="tabpanel" id="panel-about" aria-labelledby="tab-about" className="space-y-3">
              <p>{program.summary}</p>
              <p className="text-sm text-muted">Pathly does not replace the official application system. Submit your application on the university&apos;s official website.</p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start" aria-label="Your eligibility">
          {showResults ? (
            <>
              <Card>
                <h2 className="text-lg font-semibold">Your eligibility</h2>
                <p className="mt-1 text-sm text-muted">{summary.sentence}</p>
                <div className="mt-4"><OutcomeBar summary={summary} /></div>
                <div className="mt-5 flex flex-col gap-2">
                  <Button onClick={startRoadmap}>{inShortlist ? "Open my roadmap" : "Create my roadmap"}</Button>
                  {!inShortlist ? <Button variant="secondary" onClick={() => state.toggleShortlist(slug)}>Add to shortlist</Button> : <Button variant="secondary" onClick={() => state.toggleShortlist(slug)}>Remove from shortlist</Button>}
                </div>
              </Card>
              {gaps.length > 0 ? (
                <Card>
                  <h2 className="text-lg font-semibold">Gaps</h2>
                  <ul className="mt-3 space-y-3">
                    {gaps.map((g) => (
                      <li key={g.requirementId} className="text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium">{g.label}</span>
                          <OutcomeBadge outcome={g.outcome} />
                        </div>
                        <p className="mt-1 text-muted">{g.explanation}</p>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </>
          ) : role === "applicant" ? (
            <Card>
              <h2 className="text-lg font-semibold">Add your profile</h2>
              <p className="mt-1 text-sm text-muted">Your profile is empty, so every result would be Unknown. Add your background to see where you stand.</p>
              <div className="mt-4 flex flex-col gap-2">
                <LinkButton href="/app/profile">Edit my profile</LinkButton>
                <Button variant="secondary" onClick={state.loadSampleProfile}>Use a sample profile</Button>
              </div>
            </Card>
          ) : null}
          {effectiveStatus(program.deadline, today) !== "verified" ? (
            <Callout tone="warn" title="Deadline not verified">
              We cannot show a reliable deadline for this programme yet. Check the official page.
            </Callout>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
