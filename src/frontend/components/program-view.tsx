"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { evaluateProgram, summarize } from "@/lib/eligibility";
import { getProgram, getUniversity, LEVEL_LABEL } from "@/lib/mock-data";
import { effectiveStatus } from "@/lib/status";
import type { Requirement } from "@/lib/types";
import { useAppState } from "./app-state";
import { DeadlineLine } from "./deadline-line";
import { IconChat, IconFilter } from "./icons";
import { OutcomeBar } from "./outcome-bar";
import { PillTabs } from "./pill-tabs";
import { BookmarkButton, ShareButton, StatsCard, TitleRow, UniversityCard } from "./page-hero";
import { Select } from "./form-controls";
import { hasProfileData } from "./profile-utils";
import { RailCard, RelatedList, SourceList } from "./rail";
import { relatedFor, sourcesFor } from "./rail-data";
import { RequirementRow } from "./requirement-row";
import { Button, Callout, Card, IllustrativeNote, LinkButton, Tag } from "./ui";

type Tab = "requirements" | "deadlines" | "about";

export function ProgramView({ slug }: { slug: string }) {
  const state = useAppState();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("requirements");
  const [show, setShow] = useState<"all" | "attention">("all");
  const program = getProgram(slug)!;
  const uni = getUniversity(program.universityId)!;
  const { today, role, profile } = state;

  const reqs = state.requirementsFor(slug);
  const showResults = role === "applicant" && hasProfileData(profile);
  const results = useMemo(() => (showResults ? evaluateProgram(profile, reqs, today) : []), [showResults, profile, reqs, today]);
  const summary = summarize(results);
  const byId = new Map(results.map((r) => [r.requirementId, r]));

  const verified = reqs.filter((r) => effectiveStatus(r, today) === "verified").length;
  const visible = show === "all" ? reqs : reqs.filter((r) => effectiveStatus(r, today) !== "verified");
  const groups = useMemo(() => {
    const map = new Map<string, Requirement[]>();
    for (const r of visible) map.set(r.pathway, [...(map.get(r.pathway) ?? []), r]);
    return Array.from(map.entries());
  }, [visible]);

  const lastChecked = reqs.map((r) => r.verifiedAt).filter(Boolean).sort().pop() ?? null;
  const inShortlist = state.shortlist.includes(slug);
  const needAttention = reqs.length - verified;

  function startRoadmap() {
    if (!inShortlist) state.toggleShortlist(slug);
    router.push("/app/roadmap");
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="min-w-0">
        <TitleRow title={program.name}>
          {role === "applicant" ? <BookmarkButton saved={inShortlist} onToggle={() => state.toggleShortlist(slug)} /> : null}
          <ShareButton />
        </TitleRow>
        <div className="mb-4 flex flex-wrap gap-2">
          <Tag>{LEVEL_LABEL[program.level]}</Tag>
          <Tag>{program.field}</Tag>
          <Tag>Taught in {program.language}</Tag>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <UniversityCard uni={uni}>
            {role === "applicant" ? (
              <LinkButton href="/app/advisor"><IconChat size={16} /> Ask the advisor</LinkButton>
            ) : (
              <LinkButton href="/register">Build my profile</LinkButton>
            )}
            <a href={program.officialUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-10 items-center justify-center rounded-full border border-line bg-surface px-5 py-2 text-sm font-semibold hover:bg-surface-2">Official page</a>
          </UniversityCard>
          <StatsCard program={program} verified={verified} total={reqs.length} lastChecked={lastChecked} today={today} />
        </div>

        <PillTabs<Tab>
          label="Programme sections"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "requirements", label: "Requirements", count: reqs.length },
            { id: "deadlines", label: "Deadlines", count: 1 },
            { id: "about", label: "About" },
          ]}
          right={
            tab === "requirements" ? (
              <Select
                variant="pill"
                label="Show"
                icon={<IconFilter size={16} />}
                placeholder={null}
                value={show}
                options={[{ value: "all", label: "All requirements" }, { value: "attention", label: `Needs attention (${needAttention})` }]}
                onChange={(v) => setShow((v ?? "all") as "all" | "attention")}
              />
            ) : null
          }
        />

        <div className="mt-5">
          {tab === "requirements" ? (
            <div role="tabpanel" id="panel-requirements" aria-labelledby="tab-requirements" className="space-y-6">
              {role === "guest" ? (
                <Callout title="Check your own eligibility">
                  Build a profile in about three minutes and see Met, Not met, Pending or Unknown for each requirement below.
                </Callout>
              ) : null}
              {role === "applicant" && !showResults ? (
                <Callout title="Fill in your profile to see your results">
                  Without a profile every requirement below stays Unknown. <Link href="/app/profile" className="font-medium underline">Open my profile</Link> or <Link href="/app/onboarding" className="font-medium underline">answer a few questions with AI</Link>.
                </Callout>
              ) : null}
              {groups.length === 0 ? <Callout>Every requirement of this programme is Verified on this date.</Callout> : null}
              {groups.map(([pathway, list]) => (
                <section key={pathway} aria-label={pathway}>
                  <h2 className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{pathway}</h2>
                  <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface shadow-[var(--shadow)]">
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
              <Card>
                <p>{program.summary}</p>
                <p className="mt-3 text-sm text-muted">Pathly does not replace the official application system. Submit your application on the university&apos;s official website.</p>
              </Card>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="space-y-4" aria-label="Summary">
        {showResults ? (
          <>
            <RailCard label="Your eligibility">
              <p className="text-sm text-muted">{summary.sentence}</p>
              <div className="mt-3"><OutcomeBar summary={summary} /></div>
              <div className="mt-4 flex flex-col gap-2">
                <Button onClick={startRoadmap}>{inShortlist ? "Open my roadmap" : "Create my roadmap"}</Button>
              </div>
            </RailCard>
          </>
        ) : role === "applicant" ? (
          <RailCard label="Your eligibility">
            <p className="text-sm text-muted">Your profile is empty, so every result would be Unknown. Add your background to see where you stand.</p>
            <div className="mt-3 flex flex-col gap-2">
              <LinkButton href="/app/profile">Edit my profile</LinkButton>
              <Button variant="secondary" onClick={state.loadSampleProfile}>Use a sample profile</Button>
            </div>
          </RailCard>
        ) : (
          <RailCard label="Your eligibility">
            <p className="text-sm text-muted">Sign in and add your profile to see your result for every requirement.</p>
            <div className="mt-3"><LinkButton href="/register">Build my profile</LinkButton></div>
          </RailCard>
        )}

        {effectiveStatus(program.deadline, today) !== "verified" ? (
          <Callout tone="warn" title="Deadline not verified">We cannot show a reliable deadline for this programme yet. Check the official page.</Callout>
        ) : null}

        <RailCard label="Sources"><SourceList items={sourcesFor(reqs)} /></RailCard>
        {state.enrolled.includes(slug) ? null : <RailCard label="Related programmes"><RelatedList items={relatedFor(slug)} /></RailCard>}
      </aside>
    </div>
  );
}
