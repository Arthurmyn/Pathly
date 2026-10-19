"use client";

import { StatusBadge } from "./badges";
import { IconLink, IconShieldCheck } from "./icons";
import { Button, Callout, Card, PageHeader } from "./ui";

/**
 * STATIC PREVIEW of the AI advisor screen (mockup W4): one answer with a citation and one refusal.
 * The retrieval, citation checking and refusal logic are built by the AI-layer owner.
 */
export function AdvisorPreview() {
  return (
    <div>
      <PageHeader title="Advisor" subtitle="Answers use verified records only and always show their source. If there is no verified source, the advisor says so." />
      <Callout tone="warn" title="Preview">
        This screen shows the intended design with a scripted example. The live advisor is not connected yet.
      </Callout>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_16rem]">
        <Card className="flex flex-col">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs">Context: MS Computer Science, Northfield Institute</p>
          <ol className="space-y-4" aria-label="Example conversation">
            <li className="ml-auto max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-fg">What TOEFL score do I need?</li>
            <li className="max-w-[90%] space-y-2">
              <div className="rounded-2xl bg-surface-2 px-3 py-2 text-sm">The programme requires a TOEFL score of at least 100.</div>
              <div className="rounded-lg border border-line bg-bg p-3 text-sm">
                <p className="flex items-center gap-1.5 font-medium"><IconShieldCheck size={14} /> Source</p>
                <p className="mt-1 text-muted">&quot;English proficiency (TOEFL): minimum 100&quot;</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="inline-flex items-center gap-1 text-primary"><IconLink size={12} /> admissions.northfield.example</span>
                  <span>Tier 1</span><span>Verified 12 Sep 2026</span><StatusBadge status="verified" />
                </p>
              </div>
            </li>
            <li className="ml-auto max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-fg">How much work experience do they want?</li>
            <li className="max-w-[90%] space-y-2">
              <div className="rounded-2xl border border-dashed px-3 py-2 text-sm" style={{ borderColor: "var(--st-missing-bd)" }}>
                <p className="font-medium">I can&apos;t answer this from verified sources.</p>
                <p className="mt-1 text-muted">No value is stored for professional experience, so I won&apos;t guess. I can request verification so an administrator checks the official page.</p>
                <div className="mt-2 flex gap-2"><Button variant="secondary" disabled>Request verification</Button><Button variant="ghost" disabled>Open official source</Button></div>
              </div>
            </li>
          </ol>
          <form className="mt-5 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input disabled aria-label="Question" placeholder="Ask about a requirement (not connected in this preview)" className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-sm" />
            <Button disabled>Ask</Button>
          </form>
          <p className="mt-2 text-xs text-muted">Answers use verified records only.</p>
        </Card>
        <Card className="self-start text-sm">
          <h2 className="font-semibold">How answers work</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>Only Verified records are used as facts.</li>
            <li>Every answer cites its source and date.</li>
            <li>Outdated, missing or conflicting data is named as such.</li>
            <li>No guesses about deadlines or rules.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
