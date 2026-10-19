"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LEVEL_NAME, type Speciality } from "@/lib/specialities";
import { IconSearch } from "./icons";
import { EmptyState, LinkButton, Tag } from "./ui";

const STEP = 60;

export function SpecialityView({ speciality: s, programmes }: { speciality: Speciality; programmes: string[] }) {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(STEP);
  const q = query.trim().toLowerCase();
  const rows = useMemo(() => (q ? programmes.filter((p) => p.toLowerCase().includes(q)) : programmes), [programmes, q]);

  return (
    <div className="max-w-4xl">
      <p className="mb-2 text-sm text-muted"><Link href="/programs?tab=specialities" className="hover:underline">Bolashak priority specialities 2026</Link> · {s.group}</p>
      <h1 className="text-[28px] font-medium leading-tight tracking-tight"><span className="mr-2 text-muted">{s.code}</span>{s.nameRu}</h1>
      <div className="mt-3 flex flex-wrap gap-2">{s.levels.map((l) => <Tag key={l.code}>{LEVEL_NAME[l.level]} · {l.code}</Tag>)}</div>

      <section className="mt-8 rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow)]" aria-labelledby="eq">
        <h2 id="eq" className="font-semibold">Programme names abroad</h2>
        <p className="mt-1 text-sm text-muted">The list gives {programmes.length} English names that count as equivalents of this speciality. It does not say which university teaches each one. Search the university&apos;s website for the exact name.</p>
        <label className="relative mt-4 block">
          <span className="sr-only">Search programme names</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"><IconSearch size={16} /></span>
          <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setShown(STEP); }} placeholder="Search programme names" className="w-full rounded-full border border-line bg-surface-2 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:bg-surface" />
        </label>
        <p className="mt-3 text-sm text-muted" aria-live="polite">{rows.length} name{rows.length === 1 ? "" : "s"}</p>
        {rows.length === 0 ? (
          <div className="mt-3"><EmptyState title="Nothing found">Try a shorter word.</EmptyState></div>
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {rows.slice(0, shown).map((p) => <li key={p} className="py-2 text-sm">{p}</li>)}
          </ul>
        )}
        {rows.length > shown ? (
          <button type="button" onClick={() => setShown((n) => n + STEP)} className="press mt-4 rounded-full border border-line bg-surface px-5 py-2 text-sm font-semibold hover:bg-surface-2">
            Show {Math.min(STEP, rows.length - shown)} more
          </button>
        ) : null}
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <LinkButton href="/programs?tab=specialities" variant="secondary">All specialities</LinkButton>
        <LinkButton href="/institutions" variant="secondary">Browse universities</LinkButton>
      </div>
    </div>
  );
}
