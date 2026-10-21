"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { formatDate } from "@/lib/dates";
import { effectiveStatus } from "@/lib/status";
import type { Program, University } from "@/lib/types";
import { StatusBadge } from "./badges";
import { initials } from "./rail-data";
import { IconBookmark, IconClock, IconShare, IconShieldCheck } from "./icons";

export function TitleRow({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-[28px] font-medium leading-tight tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function CircleButton({ label, pressed, onClick, children }: { label: string; pressed?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onClick}
      className={`press flex h-11 w-11 items-center justify-center rounded-full border border-line ${pressed ? "bg-primary text-primary-fg" : "bg-surface hover:bg-surface-2"}`}
    >
      {children}
    </button>
  );
}

export function BookmarkButton({ saved, onToggle }: { saved: boolean; onToggle: () => void }) {
  return (
    <CircleButton label={saved ? "Remove from shortlist" : "Add to shortlist"} pressed={saved} onClick={onToggle}>
      <IconBookmark size={18} />
    </CircleButton>
  );
}

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be blocked; nothing else to do */
    }
  }
  return (
    <span className="relative">
      <CircleButton label="Copy link" onClick={copy}><IconShare size={18} /></CircleButton>
      {copied ? <span role="status" className="pop absolute -bottom-7 right-0 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-xs text-primary-fg">Link copied</span> : null}
    </span>
  );
}

/** Left info card: the university with its actions (the reference "mentor" card). */
export function UniversityCard({ uni, children }: { uni: University; children: ReactNode }) {
  return (
    <section className="rounded-[20px] border border-line bg-surface p-4 shadow-[var(--shadow)]">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg" aria-hidden="true">{initials(uni.name)}</span>
        <div className="min-w-0">
          <p className="truncate font-semibold"><Link href={`/institutions/${uni.id}`} className="hover:underline">{uni.name}</Link></p>
          <p className="truncate text-sm text-muted">{uni.city}, {uni.country}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

/** Right info card: key facts and a short description with a More toggle. */
export function StatsCard({ program, verified, total, lastChecked, today }: { program: Program; verified: number; total: number; lastChecked: string | null; today: string }) {
  const [more, setMore] = useState(false);
  const dStatus = effectiveStatus(program.deadline, today);
  return (
    <section className="rounded-[20px] border border-line bg-surface p-4 shadow-[var(--shadow)]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5"><IconShieldCheck size={16} /><strong>{verified} of {total}</strong> verified</span>
        <span className="inline-flex items-center gap-1.5"><IconClock size={16} />Checked {formatDate(lastChecked)}</span>
        <span className="inline-flex items-center gap-2">Deadline <strong>{dStatus === "verified" ? formatDate(program.deadline.date) : "not verified"}</strong><StatusBadge status={dStatus} quiet /></span>
      </div>
      <p className={`mt-3 text-sm text-muted ${more ? "" : "line-clamp-2"}`}>
        {program.summary} Pathly does not replace the official application system: submit your application on the university&apos;s official website, and check every requirement against its source.
        {" "}
      </p>
      <button type="button" onClick={() => setMore((v) => !v)} className="mt-1 text-sm font-semibold" aria-expanded={more}>{more ? "Less" : "More"}</button>
    </section>
  );
}
