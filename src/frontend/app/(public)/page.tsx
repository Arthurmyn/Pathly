import Link from "next/link";
import { StatusBadge } from "@/components/badges";
import { IconArrowRight } from "@/components/icons";
import { RouteStrip } from "@/components/route-stations";
import { SourceChip } from "@/components/source-chip";
import { LinkButton } from "@/components/ui";
import { getRequirements } from "@/lib/mock-data";
import { STATUS_HELP, STATUS_LABEL } from "@/lib/status";
import type { DataStatus } from "@/lib/types";

const STATUSES: DataStatus[] = ["verified", "unverified", "stale", "missing", "conflict"];

/** A round "verified source" seal that overlaps the corner of the bulletin. Decorative. */
function Seal() {
  return (
    <svg viewBox="0 0 160 160" className="seal-turn h-[116px] w-[116px] text-primary" aria-hidden="true">
      <defs>
        <path id="seal-ring" d="M80 80m-56 0a56 56 0 1 1 112 0a56 56 0 1 1-112 0" />
      </defs>
      <circle cx="80" cy="80" r="76" fill="var(--sheet)" stroke="currentColor" strokeWidth="2" />
      <circle cx="80" cy="80" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
      <text fontSize="11.5" fontWeight="600" letterSpacing="3.2" fill="currentColor">
        <textPath href="#seal-ring">VERIFIED SOURCE · TIER 1 · VERIFIED SOURCE · TIER 1 ·</textPath>
      </text>
      <path d="m64 80 11 11 22-25" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing() {
  const rows = getRequirements("steppe-msc-data-science");
  return (
    <div className="space-y-28">
      <section aria-labelledby="hero">
        <div className="enter">
          <h1 id="hero" className="text-balance text-[clamp(2.5rem,5.4vw,4.75rem)] font-medium leading-[1] tracking-[-0.035em] text-heading">
            Know where you stand
            <span className="block font-normal text-muted">and what to do next.</span>
          </h1>
          <div className="mt-8 grid items-center gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted">
              Admission requirements for Bachelor&apos;s, Master&apos;s and PhD programmes in Kazakhstan and abroad, each with its source and the date it was checked, and an honest result for you.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end">
              <LinkButton href="/register">
                Get started <IconArrowRight />
              </LinkButton>
              <Link href="/programs" className="press text-[15px] font-semibold text-ink underline decoration-strong decoration-2 underline-offset-[6px] transition-colors hover:decoration-primary">
                Browse programmes without an account
              </Link>
            </div>
          </div>
        </div>

        <figure className="stagger-lines relative mt-16" aria-label="Example: requirements of MSc Data Science as Pathly shows them">
          <div className="absolute -top-8 right-6 z-10 -rotate-[9deg] sm:right-12">
            <Seal />
          </div>
          <div className="rounded-[28px] border border-line bg-surface px-6 py-7 shadow-[var(--shadow)] sm:px-10 sm:py-9">
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-ink/80 pb-4 pr-24 sm:pr-32">
              <span className="text-xl font-medium tracking-tight text-heading">MSc Data Science, Steppe Technical University</span>
              <span className="text-sm text-muted">Requirements as Pathly shows them · illustrative data</span>
            </figcaption>
            <ul>
              {rows.map((r) => (
                <li key={r.id} className="bulletin-row border-b border-line py-4 last:border-b-0">
                  <div className="flex items-end gap-3">
                    <span className="text-[1.0625rem] font-medium text-ink">{r.label}</span>
                    <span className="leader" aria-hidden="true" />
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-1">
                    <SourceChip source={r.source} date={r.verifiedAt} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2 border-t-2 border-ink/80 pt-5 text-[1.0625rem] leading-snug text-ink">
              <strong className="font-semibold">2 requirements met, 3 cannot be confirmed.</strong>{" "}
              <span className="text-muted">So Pathly will not tell you that you are eligible. It tells you what to verify.</span>
            </p>
          </div>
        </figure>
      </section>

      <section aria-labelledby="route">
        <h2 id="route" className="max-w-[32rem] text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.02em] text-heading">
          One route from your profile to the official application.
        </h2>
        <div className="mt-12">
          <RouteStrip />
        </div>
      </section>

      <section aria-labelledby="trust" className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <h2 id="trust" className="text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.02em] text-heading">
            We only call something Verified if it is.
          </h2>
          <p className="mt-4 max-w-[28rem] text-[1.0625rem] leading-relaxed text-muted">
            A requirement is Verified when it comes from an official source and an administrator has checked it. Everything else is shown for what it is and is never treated as satisfied.
          </p>
          <div className="mt-6">
            <LinkButton href="/how-it-works" variant="secondary">
              How verification works
            </LinkButton>
          </div>
        </div>
        <dl className="divide-y divide-line border-y border-line">
          {STATUSES.map((s) => (
            <div key={s} className="grid grid-cols-[7.5rem_1fr] items-start gap-4 py-4">
              <dt>
                <StatusBadge status={s} />
                <span className="sr-only"> {STATUS_LABEL[s]}</span>
              </dt>
              <dd className="text-[15px] leading-snug text-muted">{STATUS_HELP[s]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="not" className="grid gap-x-16 gap-y-6 border-t-2 border-ink/80 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <h2 id="not" className="text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium leading-tight tracking-[-0.02em] text-heading">What Pathly does not do</h2>
        <ul className="space-y-3 text-[1.0625rem] leading-relaxed text-muted">
          <li>It does not submit applications. You submit on the official website of the university or scholarship.</li>
          <li>It does not predict your chance of admission. It shows which requirements are met, not met, pending or unknown.</li>
          <li>It does not guess. If information is missing, outdated or conflicting, it says so and tells you how to verify it.</li>
        </ul>
      </section>
    </div>
  );
}
