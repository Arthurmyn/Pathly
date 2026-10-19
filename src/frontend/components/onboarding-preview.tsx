"use client";

import { sampleProfile } from "@/lib/mock-data";
import { useAppState } from "./app-state";
import { Button, Callout, Card, LinkButton, PageHeader } from "./ui";

const MESSAGES = [
  { from: "assistant", text: "Hi! Tell me about your studies and what you want to study next." },
  { from: "user", text: "I finished a Bachelor's in Computer Science with GPA 3.5. I want a Master's in the US for fall 2027." },
  { from: "assistant", text: "Great. Did you take an English test? And what is your yearly budget?" },
  { from: "user", text: "TOEFL 96. About 30,000 dollars a year." },
  { from: "assistant", text: "Thanks. One more thing: how many years of work experience do you have?" },
];

/**
 * STATIC PREVIEW of the AI onboarding screen (mockup W1). The real conversation, extraction and follow-up
 * questions are built by the AI-layer owner; this page shows the intended layout with a scripted example.
 */
export function OnboardingPreview() {
  const { loadSampleProfile } = useAppState();
  const p = sampleProfile;
  const rows: [string, string, boolean][] = [
    ["Current degree", "Bachelor's degree", true],
    ["Field", p.field, true],
    ["Target degree", "Master's", true],
    ["Target country", p.targetCountry, true],
    ["GPA (4.0 scale)", String(p.gpa), true],
    ["Language test", "TOEFL 96", true],
    ["Intake", p.intake, true],
    ["Budget per year", "$30,000", true],
    ["Work experience", "not provided yet", false],
  ];
  return (
    <div>
      <PageHeader title="AI onboarding" subtitle="Describe your background in your own words. Your profile fills in on the right and you can edit every field." />
      <Callout tone="warn" title="Preview">
        This screen shows the intended design with a scripted example. The live conversation and extraction are not connected yet.
      </Callout>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="flex flex-col">
          <h2 className="font-semibold">Conversation</h2>
          <ol className="mt-3 flex-1 space-y-3" aria-label="Example conversation">
            {MESSAGES.map((m, i) => (
              <li key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "ml-auto bg-primary text-primary-fg" : "bg-surface-2"}`}>
                {m.text}
              </li>
            ))}
          </ol>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input disabled aria-label="Message" placeholder="Type your answer (not connected in this preview)" className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-sm" />
            <Button disabled>Send</Button>
          </form>
          <p className="mt-2 text-xs text-muted">We only keep fields needed to match requirements.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Your profile (extracted)</h2>
          <dl className="mt-3 divide-y divide-line text-sm">
            {rows.map(([k, v, ok]) => (
              <div key={k} className="flex items-center justify-between gap-3 py-2">
                <dt className="text-muted">{k}</dt>
                <dd className={ok ? "font-medium" : "font-medium"} style={ok ? undefined : { color: "var(--st-stale-fg)" }}>{v}{ok ? "" : " (asked next)"}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton href="/app/profile">Edit fields</LinkButton>
            <Button variant="secondary" onClick={loadSampleProfile}>Use this example as my profile</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
