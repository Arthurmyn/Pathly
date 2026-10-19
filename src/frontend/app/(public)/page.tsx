import { OutcomeBadge, StatusBadge } from "@/components/badges";
import { IconArrowRight } from "@/components/icons";
import { SourceChip } from "@/components/source-chip";
import { Card, IllustrativeNote, LinkButton } from "@/components/ui";
import { STATUS_HELP, STATUS_LABEL } from "@/lib/status";
import { getRequirements } from "@/lib/mock-data";
import type { DataStatus } from "@/lib/types";

const STEPS = [
  { n: 1, title: "Tell us about you", text: "Describe your background and goals. Your profile is built from the conversation and you can edit every field." },
  { n: 2, title: "See every requirement", text: "Each requirement shows its source, tier and an absolute verification date, or says clearly that it is outdated." },
  { n: 3, title: "Understand your gaps", text: "Requirement by requirement: Met, Not met, Pending or Unknown, with the rule and the reason." },
  { n: 4, title: "Follow your roadmap", text: "An ordered list of next actions built from your gaps, the verified deadline and task dependencies." },
];

const STATUSES: DataStatus[] = ["verified", "unverified", "stale", "missing", "conflict"];

export default function Landing() {
  const preview = getRequirements("steppe-msc-data-science").slice(0, 5);
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Know where you stand and what to do next.</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Verified admission requirements, an honest eligibility check and a step-by-step plan, for Bachelor&apos;s, Master&apos;s and PhD programmes in Kazakhstan and abroad.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/register">
              Build my profile <IconArrowRight />
            </LinkButton>
            <LinkButton href="/programs" variant="secondary">
              Browse programmes
            </LinkButton>
          </div>
          <div className="mt-6">
            <IllustrativeNote />
          </div>
        </div>

        <Card className="p-0">
          <div className="border-b border-line px-5 py-3">
            <p className="text-sm font-semibold">MSc Data Science · Steppe Technical University</p>
            <p className="text-xs text-muted">Requirements as Pathly shows them (illustrative)</p>
          </div>
          <ul className="divide-y divide-line">
            {preview.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <SourceChip source={r.source} date={r.verifiedAt} />
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-3 text-sm">
            <span className="text-muted">Your result for an unconfirmed requirement</span>
            <OutcomeBadge outcome="unknown" />
          </div>
        </Card>
      </section>

      <section aria-labelledby="how">
        <h2 id="how" className="text-2xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-[20px] border border-line bg-surface shadow-[var(--shadow)] p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="trust" className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 id="trust" className="text-2xl font-semibold tracking-tight">We only call something Verified if it is.</h2>
          <p className="mt-3 text-muted">
            A requirement is Verified only when it comes from an official source and an administrator has checked it. Everything else is shown for what it is, and it is never treated as satisfied.
          </p>
          <div className="mt-5">
            <LinkButton href="/how-it-works" variant="secondary">
              Read how verification works
            </LinkButton>
          </div>
        </div>
        <ul className="space-y-2">
          {STATUSES.map((s) => (
            <li key={s} className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3">
              <span className="w-24 shrink-0">
                <StatusBadge status={s} />
              </span>
              <span className="text-sm text-muted">
                <span className="sr-only">{STATUS_LABEL[s]}: </span>
                {STATUS_HELP[s]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="not" className="rounded-[20px] border border-line bg-surface shadow-[var(--shadow)] p-6">
        <h2 id="not" className="text-xl font-semibold">What Pathly does not do</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
          <li>It does not submit applications. You submit on the official website of the university or scholarship.</li>
          <li>It does not predict your chance of admission. It shows which requirements are met, not met, pending or unknown.</li>
          <li>It does not guess. If information is missing, outdated or conflicting, it says so and tells you how to verify it.</li>
        </ul>
      </section>
    </div>
  );
}
