"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { institutions, institutionCountries, programsOf, type Institution } from "@/lib/institutions";
import { FilterGroup, Option } from "./filter-ui";
import { IconChevron, IconFilter, IconSearch } from "./icons";
import { initials } from "./rail-data";
import { EmptyState, Tag } from "./ui";

const PAGE_SIZE = 30;
const TILES = [
  { bg: "var(--deco-cyan)", fg: "var(--deco-teal)" },
  { bg: "var(--deco-sky)", fg: "var(--deco-navy)" },
  { bg: "var(--deco-sand)", fg: "var(--deco-navy)" },
  { bg: "var(--deco-aqua)", fg: "var(--deco-navy)" },
];

/** Initials on a decorative tile stand in for a logo: Pathly has no logos or photos of universities. */
export function InstitutionTile({ name, size = 56 }: { name: string; size?: number }) {
  const t = TILES[(name.charCodeAt(0) + name.length) % TILES.length];
  return (
    <span className="flex shrink-0 items-center justify-center rounded-2xl font-semibold" style={{ width: size, height: size, background: t.bg, color: t.fg, fontSize: size / 3 }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

function InstitutionRow({ i }: { i: Institution }) {
  const n = programsOf(i.id).length;
  return (
    <li>
      <Link href={`/institutions/${i.id}`} className="lift flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[20px] border border-line bg-surface p-4 shadow-[var(--shadow)] hover:border-primary">
        <InstitutionTile name={i.name} size={48} />
        <div className="min-w-0 flex-1 basis-56">
          <h2 className="text-lg font-semibold leading-snug">{i.name}</h2>
          <p className="text-sm text-muted">{i.city ? `${i.city}, ` : ""}{i.country}{i.nameRu ? ` · ${i.nameRu}` : ""}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {i.origin === "bolashak" ? <Tag>Bolashak 2024–2026</Tag> : <Tag>Demo university</Tag>}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className={n ? "font-medium" : "text-muted"}>{n ? `${n} programme${n > 1 ? "s" : ""} in Pathly` : "Programmes not loaded yet"}</span>
          <IconChevron size={16} />
        </div>
      </Link>
    </li>
  );
}

export function InstitutionsBrowser() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [origin, setOrigin] = useState<"all" | "withPrograms" | "bolashak">("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const allCountries = useMemo(() => institutionCountries(), []);

  const q = query.trim().toLowerCase();
  const match = (i: Institution, skip?: "country" | "origin") =>
    (skip === "country" || countries.length === 0 || countries.includes(i.country)) &&
    (skip === "origin" || origin === "all" || (origin === "withPrograms" ? programsOf(i.id).length > 0 : i.origin === "bolashak")) &&
    (!q || `${i.name} ${i.nameRu ?? ""} ${i.country}`.toLowerCase().includes(q));

  const rows = useMemo(
    () => institutions.filter((i) => match(i)).sort((a, b) => a.name.localeCompare(b.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, countries, origin],
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const countryCount = (c: string) => institutions.filter((i) => i.country === c && match(i, "country")).length;
  const active = countries.length + (origin === "all" ? 0 : 1);
  const reset = () => { setCountries([]); setOrigin("all"); setQuery(""); setPage(1); };
  const change = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block min-w-0 flex-1 basis-72">
          <span className="sr-only">Search institutions</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"><IconSearch size={18} /></span>
          <input type="search" value={query} onChange={(e) => change(setQuery)(e.target.value)} placeholder="Search by name or country" className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-4 text-sm shadow-[var(--shadow)] transition-colors focus:border-primary" />
        </label>
        <button type="button" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} className="press inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium lg:hidden">
          <IconFilter size={16} /> Filters{active ? ` (${active})` : ""}
        </button>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside aria-label="Filters" className={`${showFilters ? "block" : "hidden"} self-start rounded-[20px] border border-line bg-surface px-5 py-2 shadow-[var(--shadow)] lg:block`}>
          <div className="flex items-center justify-between py-3">
            <h2 className="font-semibold">Filters</h2>
            {active || query ? <button type="button" onClick={reset} className="text-sm font-medium text-primary hover:underline">Clear filters</button> : null}
          </div>
          <FilterGroup title="Programmes">
            <Option type="radio" name="origin" label="All institutions" checked={origin === "all"} onChange={() => change(setOrigin)("all")} />
            <Option type="radio" name="origin" label="With programmes in Pathly" checked={origin === "withPrograms"} onChange={() => change(setOrigin)("withPrograms")} />
            <Option type="radio" name="origin" label="Bolashak list" checked={origin === "bolashak"} onChange={() => change(setOrigin)("bolashak")} />
          </FilterGroup>
          <FilterGroup title="Country">
            <div className="space-y-1">
              {allCountries.map((c) => (
                <Option key={c} type="checkbox" name="country" label={c} count={countryCount(c)} checked={countries.includes(c)} onChange={() => change(setCountries)(countries.includes(c) ? countries.filter((x) => x !== c) : [...countries, c])} />
              ))}
            </div>
          </FilterGroup>
        </aside>

        <section aria-label="Institutions" className="min-w-0">
          <p className="mb-3 text-sm text-muted" aria-live="polite">{rows.length} institution{rows.length === 1 ? "" : "s"}</p>
          {rows.length === 0 ? (
            <EmptyState title="No institutions match" action={<button type="button" onClick={reset} className="btn rounded-full border border-line bg-surface px-5 py-2 text-sm font-semibold hover:bg-surface-2">Clear filters</button>}>Try another country or search.</EmptyState>
          ) : (
            <ul className="space-y-3">
              {shown.map((i) => <InstitutionRow key={i.id} i={i} />)}
            </ul>
          )}
          {pages > 1 ? (
            <nav aria-label="Pages" className="mt-6 flex items-center justify-between gap-3 text-sm">
              <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} className="press rounded-full border border-line bg-surface px-4 py-2 font-medium disabled:opacity-50">Previous</button>
              <span className="text-muted">Page {current} of {pages} · showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, rows.length)}</span>
              <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)} className="press rounded-full border border-line bg-surface px-4 py-2 font-medium disabled:opacity-50">Next</button>
            </nav>
          ) : null}
          <p className="mt-6 text-xs text-muted">
            Institutions come from the Bolashak 2024–2026 list of recommended universities, plus three demo universities with invented programmes. Pathly has not loaded programme data for the listed universities yet.
          </p>
        </section>
      </div>
    </div>
  );
}
