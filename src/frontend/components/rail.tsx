import Link from "next/link";
import type { ReactNode } from "react";
import { IconCheck, IconClock, IconFile, IconLink } from "./icons";
import { CardLabel } from "./ui";

/** Card of the right rail: small uppercase label and content. */
export function RailCard({ label, right, children }: { label: string; right?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[20px] border border-line bg-surface p-4 shadow-[var(--shadow)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <CardLabel>{label}</CardLabel>
        {right}
      </div>
      {children}
    </section>
  );
}

/** Circular progress with the percentage in the middle. */
export function ProgressRing({ percent, size = 44 }: { percent: number; size?: number }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${Math.round(p)} percent`}>
      <svg viewBox="0 0 44 44" width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">{Math.round(p)}</span>
    </div>
  );
}

/** Compact progress card: label, headline and a ring on the right (the reference "course progress"). */
export function ProgressCard({ label, title, subtitle, percent }: { label: string; title: string; subtitle?: string; percent: number }) {
  return (
    <section className="flex items-center justify-between gap-4 rounded-[20px] border border-line bg-surface p-4 shadow-[var(--shadow)]">
      <div className="min-w-0">
        <CardLabel>{label}</CardLabel>
        <p className="mt-1.5 text-[15px] font-semibold leading-snug">{title}</p>
        {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
      </div>
      <ProgressRing percent={percent} size={52} />
    </section>
  );
}

export interface StepItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  state: "done" | "current" | "todo";
}

/** Vertical step list with check circles joined by a line, as in the reference "lesson tasks" card. */
export function StepList({ steps }: { steps: StepItem[] }) {
  return (
    <ol className="relative space-y-3" aria-label="Steps">
      {steps.map((s, i) => (
        <li key={s.id} className="relative flex items-center gap-3">
          {i < steps.length - 1 ? <span className="absolute left-[15px] top-8 h-[calc(100%-4px)] w-px bg-line" aria-hidden="true" /> : null}
          <span
            className={`relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
              s.state === "done" ? "border-primary bg-primary text-primary-fg" : s.state === "current" ? "border-primary bg-surface text-ink" : "border-line bg-surface text-transparent"
            }`}
          >
            {s.state === "done" ? <IconCheck size={15} /> : s.state === "current" ? <IconClock size={14} /> : null}
          </span>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-medium ${s.state === "done" ? "text-muted line-through" : ""}`}>{s.title}</p>
            {s.subtitle ? <p className="truncate text-xs text-muted">{s.subtitle}</p> : null}
          </div>
          {s.meta ? <span className="shrink-0 text-xs font-medium tabular-nums text-muted">{s.meta}</span> : null}
        </li>
      ))}
    </ol>
  );
}

export interface SourceItem {
  id: string;
  name: string;
  detail: string;
  href: string;
}

/** Sources of the data shown on the page, each with an Open button (the reference "lesson materials"). */
export function SourceList({ items }: { items: SourceItem[] }) {
  if (items.length === 0) return <p className="text-sm text-muted">No sources are stored yet.</p>;
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.id} className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink">
            <IconFile size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{it.name}</p>
            <p className="truncate text-xs text-muted">{it.detail}</p>
          </div>
          <a href={it.href} target="_blank" rel="noreferrer noopener" className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-surface-2">
            <IconLink size={12} /> Open
          </a>
        </li>
      ))}
    </ul>
  );
}

export interface RelatedItem {
  slug: string;
  title: string;
  description: string;
  meta: string;
  initials: string;
}

const TILES = [
  { bg: "var(--deco-cyan)", fg: "var(--deco-teal)" },
  { bg: "var(--deco-sky)", fg: "var(--deco-navy)" },
  { bg: "var(--deco-sand)", fg: "var(--deco-navy)" },
  { bg: "var(--deco-aqua)", fg: "var(--deco-navy)" },
];

/** Related programmes (the reference "related content"). Initials on decorative colours replace thumbnails. */
export function RelatedList({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return <p className="text-sm text-muted">No related programmes.</p>;
  return (
    <ul className="space-y-4">
      {items.map((it) => (
        <li key={it.slug} className="flex gap-3">
          <span
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold"
            style={{ background: TILES[(it.initials.charCodeAt(0) + it.initials.length) % TILES.length].bg, color: TILES[(it.initials.charCodeAt(0) + it.initials.length) % TILES.length].fg }}
            aria-hidden="true"
          >
            {it.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug">{it.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted">{it.description}</p>
            <p className="mt-1 text-[11px] text-muted">{it.meta}</p>
            <Link href={`/programs/${it.slug}`} className="mt-1.5 inline-flex rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold hover:bg-surface-2">
              View programme
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
