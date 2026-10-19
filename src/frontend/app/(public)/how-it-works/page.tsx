import type { Metadata } from "next";
import { StatusBadge, OutcomeBadge } from "@/components/badges";
import { Card, LinkButton } from "@/components/ui";
import { STATUS_HELP } from "@/lib/status";
import type { DataStatus, Outcome } from "@/lib/types";

export const metadata: Metadata = { title: "How it works" };

const STATUSES: DataStatus[] = ["verified", "unverified", "stale", "missing", "conflict"];

const EFFECT: { [K in DataStatus]: { matching: string; advisor: string } } = {
  verified: { matching: "Used as a fact: Met or Not met.", advisor: "May be cited as a fact with its date." },
  unverified: { matching: "Unknown.", advisor: "Not used as a fact." },
  stale: { matching: "Unknown, listed as a gap.", advisor: "The advisor says the data is outdated." },
  missing: { matching: "Unknown, listed as a gap.", advisor: "The advisor says no information is available." },
  conflict: { matching: "Unknown until resolved.", advisor: "The advisor reports the disagreement." },
};

const OUTCOMES: { outcome: Outcome; text: string }[] = [
  { outcome: "met", text: "The requirement is Verified and your profile satisfies it." },
  { outcome: "not_met", text: "The requirement is Verified and your profile does not satisfy it yet." },
  { outcome: "pending", text: "A step you planned (for example an exam) has not produced a result yet." },
  { outcome: "unknown", text: "We cannot decide: the record is not Verified, or your profile has no value. This is a gap, not a failure." },
];

export default function HowItWorks() {
  return (
    <article className="mx-auto max-w-3xl space-y-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">How verification works</h1>
        <p className="mt-3 text-lg text-muted">
          Admission information is spread over many sites and changes over time. Pathly stores every requirement with its source, a status and a date, and it never hides that status.
        </p>
      </header>

      <section aria-labelledby="statuses" className="space-y-4">
        <h2 id="statuses" className="text-xl font-semibold">Five data statuses</h2>
        <p className="text-muted">The status describes the record, not you. It decides how far the record can be trusted.</p>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Meaning</th>
                <th className="px-4 py-2 font-medium">In eligibility matching</th>
                <th className="px-4 py-2 font-medium">In the AI advisor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {STATUSES.map((s) => (
                <tr key={s}>
                  <td className="px-4 py-3 align-top"><StatusBadge status={s} /></td>
                  <td className="px-4 py-3 align-top text-muted">{STATUS_HELP[s]}</td>
                  <td className="px-4 py-3 align-top">{EFFECT[s].matching}</td>
                  <td className="px-4 py-3 align-top">{EFFECT[s].advisor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="tiers" className="space-y-3">
        <h2 id="tiers" className="text-xl font-semibold">Three source tiers</h2>
        <ul className="space-y-2 text-muted">
          <li><strong className="text-ink">Tier 1</strong>: an official page or document of a university, a government body or a testing organisation. Only Tier 1 can make a record Verified.</li>
          <li><strong className="text-ink">Tier 2</strong>: official secondary material, for example a partner agency.</li>
          <li><strong className="text-ink">Tier 3</strong>: a third-party aggregator or a forum. Useful as a hint, never as a fact.</li>
        </ul>
      </section>

      <section aria-labelledby="freshness" className="space-y-3">
        <h2 id="freshness" className="text-xl font-semibold">Why a Verified record can become Stale</h2>
        <p className="text-muted">
          Deadlines are valid until the end of their admission cycle. Other requirements are valid for 180 days after verification. When the date passes, or the source changes, the record becomes Stale, your result for it turns into Unknown and the roadmap adds a task to verify it.
        </p>
        <Card>
          <p className="text-sm">
            Try it: in the grey demo bar at the top of every page, move &quot;Today in the demo&quot; to a later date and open a programme. Records whose validity ended switch from Verified to Stale.
          </p>
        </Card>
      </section>

      <section aria-labelledby="outcomes" className="space-y-4">
        <h2 id="outcomes" className="text-xl font-semibold">Four results for you</h2>
        <p className="text-muted">The result describes you against one requirement. It is separate from the data status.</p>
        <ul className="space-y-2">
          {OUTCOMES.map((o) => (
            <li key={o.outcome} className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3">
              <span className="w-28 shrink-0"><OutcomeBadge outcome={o.outcome} /></span>
              <span className="text-sm text-muted">{o.text}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">Pathly never shows a single &quot;you are eligible&quot; verdict while any requirement is Unknown.</p>
      </section>

      <div className="flex flex-wrap gap-3">
        <LinkButton href="/programs">Browse programmes</LinkButton>
        <LinkButton href="/register" variant="secondary">Build my profile</LinkButton>
      </div>
    </article>
  );
}
