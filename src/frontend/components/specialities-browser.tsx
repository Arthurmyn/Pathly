"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LEVEL_NAME, SPECIALITY_GROUPS, specialities, type SpecialityLevel } from "@/lib/specialities";
import { FilterGroup, Option } from "./filter-ui";
import { IconChevron, IconFilter, IconSearch } from "./icons";
import { EmptyState, Tag } from "./ui";

const LEVELS: SpecialityLevel[] = ["bachelor", "master", "phd", "residency"];

/** The Bolashak 2026 priority specialities as a searchable list with filters. */
export function SpecialitiesBrowser() {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [level, setLevel] = useState<SpecialityLevel | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const q = query.trim().toLowerCase();
  const match = (s: (typeof specialities)[number], skip?: "group" | "level") =>
    (skip === "group" || groups.length === 0 || groups.includes(s.group)) &&
    (skip === "level" || !level || s.levels.some((l) => l.level === level)) &&
    (!q || `${s.nameRu} ${s.examples.join(" ")} ${s.code}`.toLowerCase().includes(q));

  const rows = useMemo(
    () => specialities.filter((s) => match(s)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, groups, level],
  );
  const active = groups.length + (level ? 1 : 0);
  const reset = () => { setGroups([]); setLevel(null); setQuery(""); };

  return (
    <div>
      <p className="mb-4 max-w-3xl text-sm text-muted">
        Priority specialities of the Bolashak scholarship for 2026, copied from the official list. Each speciality names the programmes that count as its equivalent abroad. The list does not say which university teaches them, so check the university&apos;s own website.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block min-w-0 flex-1 basis-72">
          <span className="sr-only">Search specialities</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"><IconSearch size={18} /></span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by speciality, programme name or code" className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-4 text-sm shadow-[var(--shadow)] transition-colors focus:border-primary" />
        </label>
        <button type="button" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} className="press inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium lg:hidden">
          <IconFilter size={16} /> Filters{active ? ` (${active})` : ""}
        </button>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside aria-label="Speciality filters" className={`${showFilters ? "block" : "hidden"} self-start rounded-[20px] border border-line bg-surface px-5 py-2 shadow-[var(--shadow)] lg:block`}>
          <div className="flex items-center justify-between py-3">
            <h2 className="font-semibold">Filters</h2>
            {active || query ? <button type="button" onClick={reset} className="text-sm font-medium text-primary hover:underline">Clear filters</button> : null}
          </div>
          <FilterGroup title="Degree level">
            <Option type="radio" name="sp-level" label="All levels" count={specialities.filter((s) => match(s, "level")).length} checked={!level} onChange={() => setLevel(null)} />
            {LEVELS.map((l) => (
              <Option key={l} type="radio" name="sp-level" label={LEVEL_NAME[l]} count={specialities.filter((s) => match(s, "level") && s.levels.some((x) => x.level === l)).length} checked={level === l} onChange={() => setLevel(l)} />
            ))}
          </FilterGroup>
          <FilterGroup title="Field">
            {SPECIALITY_GROUPS.map((g) => (
              <Option key={g} type="checkbox" name="sp-group" label={g} count={specialities.filter((s) => s.group === g && match(s, "group")).length} checked={groups.includes(g)} onChange={() => setGroups(groups.includes(g) ? groups.filter((x) => x !== g) : [...groups, g])} />
            ))}
          </FilterGroup>
        </aside>

        <section aria-label="Specialities" className="min-w-0">
          <p className="mb-3 text-sm text-muted" aria-live="polite">{rows.length} {rows.length === 1 ? "speciality" : "specialities"}</p>
          {rows.length === 0 ? (
            <EmptyState title="No specialities match" action={<button type="button" onClick={reset} className="btn rounded-full border border-line bg-surface px-5 py-2 text-sm font-semibold hover:bg-surface-2">Clear filters</button>}>Try another word or clear the filters.</EmptyState>
          ) : (
            <ul className="space-y-3">
              {rows.map((s) => (
                <li key={s.id}>
                  <Link href={`/specialities/${s.id}`} className="lift flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow)] hover:border-primary">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold leading-snug"><span className="mr-2 text-muted">{s.code}</span>{s.nameRu}</h3>
                        <p className="mt-0.5 text-sm text-muted">{s.group} · e.g. {s.examples.join(", ")}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">{s.levels.map((l) => <Tag key={l.code}>{LEVEL_NAME[l.level]}</Tag>)}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">{s.programmeCount} programme name{s.programmeCount === 1 ? "" : "s"} abroad</span>
                      <IconChevron size={16} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted">Source: list of priority specialities for the Bolashak international scholarship, 2026. Names are shown as in the list.</p>
        </section>
      </div>
    </div>
  );
}
