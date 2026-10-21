"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/dates";
import { LEVEL_LABEL, programs, universities } from "@/lib/mock-data";
import { matchesPreferences } from "@/lib/settings";
import { effectiveStatus } from "@/lib/status";
import type { Program, University } from "@/lib/types";
import { useAppState } from "./app-state";
import { StatusBadge } from "./badges";
import { Select } from "./form-controls";
import { IconChevron, IconFilter, IconList, IconSearch } from "./icons";
import { FilterGroup, Option } from "./filter-ui";
import { EmptyState, IllustrativeNote, Tag } from "./ui";

type Sort = "name" | "deadline" | "verified";
type View = "list" | "grid";
type Group = "level" | "format" | "country" | "university" | "field" | "language" | "check";

interface Row {
  p: Program;
  uni: University;
  verified: number;
  total: number;
  dStatus: ReturnType<typeof effectiveStatus>;
  full: boolean;
  match: boolean;
}

interface Filters {
  level: string | null;
  format: string[];
  /** null follows the countries chosen in the profile. */
  country: string[] | null;
  university: string[];
  field: string[];
  language: string[];
  check: string | null;
}

const EMPTY: Filters = { level: null, format: [], country: null, university: [], field: [], language: [], check: null };

/** The value a programme has for a filter group, as text. */
function valueOf(r: Row, g: Group): string {
  switch (g) {
    case "level": return r.p.level;
    case "format": return r.p.format;
    case "country": return r.uni.country;
    case "university": return r.uni.name;
    case "field": return r.p.field;
    case "language": return r.p.language;
    case "check": return r.full ? "full" : "review";
  }
}

const IconGrid = (p: { size?: number }) => (
  <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);

export function Catalogue() {
  const { today, requirementsFor, settings, profile } = useAppState();
  const [f, setF] = useState<Filters>(EMPTY);
  const urlQuery = useSearchParams().get("q") ?? "";
  const [typed, setTyped] = useState<string | null>(null);
  const query = typed ?? urlQuery;
  const [sort, setSort] = useState<Sort>("name");
  const [view, setView] = useState<View>("list");
  const [showFilters, setShowFilters] = useState(false);

  const countries = f.country ?? profile.targetCountries;
  const active: Filters = { ...f, country: countries };

  const all = useMemo<Row[]>(
    () =>
      programs.map((p) => {
        const uni = universities.find((u) => u.id === p.universityId)!;
        const reqs = requirementsFor(p.slug);
        const verified = reqs.filter((r) => effectiveStatus(r, today) === "verified").length;
        const dStatus = effectiveStatus(p.deadline, today);
        return { p, uni, verified, total: reqs.length, dStatus, full: verified === reqs.length && dStatus === "verified", match: matchesPreferences(settings.study, profile.targetCountries, p, uni.country) };
      }),
    [requirementsFor, today, settings.study, profile.targetCountries],
  );

  const q = query.trim().toLowerCase();
  /** Rows that pass every filter, optionally ignoring one group (used for the counts of that group). */
  function passing(skip?: Group) {
    return all.filter((r) => {
      const ok = (g: Group, sel: string[]) => g === skip || sel.length === 0 || sel.includes(valueOf(r, g));
      return (
        ok("level", active.level ? [active.level] : []) &&
        ok("format", active.format) &&
        ok("country", active.country ?? []) &&
        ok("university", active.university) &&
        ok("field", active.field) &&
        ok("language", active.language) &&
        ok("check", active.check ? [active.check] : []) &&
        `${r.p.name} ${r.uni.name} ${r.p.field}`.toLowerCase().includes(q)
      );
    });
  }
  const count = (g: Group, v: string) => passing(g).filter((r) => valueOf(r, g) === v).length;

  const rows = useMemo(
    () =>
      [...passing()].sort((a, b) => {
        if (sort === "verified") return b.verified / b.total - a.verified / a.total;
        if (sort === "deadline") return (a.p.deadline.date ?? "9999").localeCompare(b.p.deadline.date ?? "9999");
        return a.p.name.localeCompare(b.p.name);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [all, f, countries, q, sort],
  );

  const distinct = (g: Group) => Array.from(new Set(all.map((r) => valueOf(r, g)))).sort((a, b) => a.localeCompare(b));
  const activeCount = (f.level ? 1 : 0) + f.format.length + countries.length + f.university.length + f.field.length + f.language.length + (f.check ? 1 : 0);
  const clear = () => { setF({ ...EMPTY, country: [] }); setTyped(""); };
  const toggle = (g: "format" | "university" | "field" | "language", v: string) =>
    setF((s) => ({ ...s, [g]: s[g].includes(v) ? s[g].filter((x) => x !== v) : [...s[g], v] }));
  const toggleCountry = (v: string) =>
    setF((s) => {
      const cur = s.country ?? profile.targetCountries;
      return { ...s, country: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });

  function checkboxGroup(title: string, g: "format" | "university" | "field" | "language") {
    return (
      <FilterGroup title={title}>
        {distinct(g).map((v) => (
          <Option key={v} type="checkbox" name={g} label={v} count={count(g, v)} checked={active[g].includes(v)} onChange={() => toggle(g, v)} />
        ))}
      </FilterGroup>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block min-w-0 flex-1 basis-72">
          <span className="sr-only">Search the catalogue</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"><IconSearch size={18} /></span>
          <input
            type="search"
            value={query}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Search by programme, university or field"
            className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-4 text-sm shadow-[var(--shadow)] transition-colors focus:border-primary"
          />
        </label>
        <Select
          variant="pill"
          label="Sort by"
          icon={<IconFilter size={16} />}
          placeholder={null}
          value={sort}
          options={[{ value: "name", label: "Sort: Name" }, { value: "deadline", label: "Sort: Deadline" }, { value: "verified", label: "Sort: Most verified" }]}
          onChange={(v) => setSort((v ?? "name") as Sort)}
        />
        <button type="button" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} className="press inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium lg:hidden">
          <IconFilter size={16} /> Filters{activeCount ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside aria-label="Filters" className={`${showFilters ? "block" : "hidden"} self-start rounded-[20px] border border-line bg-surface px-5 py-2 shadow-[var(--shadow)] lg:block`}>
          <div className="flex items-center justify-between py-3">
            <h2 className="font-semibold">Filters</h2>
            {activeCount ? <button type="button" onClick={clear} className="text-sm font-medium text-primary hover:underline">Clear filters</button> : null}
          </div>
          <FilterGroup title="Degree level">
            <Option type="radio" name="level" label="All levels" count={passing("level").length} checked={!active.level} onChange={() => setF((s) => ({ ...s, level: null }))} />
            {(["bachelor", "master", "phd"] as const).map((l) => (
              <Option key={l} type="radio" name="level" label={LEVEL_LABEL[l]} count={count("level", l)} checked={active.level === l} onChange={() => setF((s) => ({ ...s, level: l }))} />
            ))}
          </FilterGroup>
          {checkboxGroup("Study format", "format")}
          <FilterGroup title="Country">
            {distinct("country").map((v) => (
              <Option key={v} type="checkbox" name="country" label={v} count={count("country", v)} checked={countries.includes(v)} onChange={() => toggleCountry(v)} />
            ))}
            {profile.targetCountries.length && f.country === null ? <p className="pt-1 text-xs text-muted">Set from your profile.</p> : null}
          </FilterGroup>
          {checkboxGroup("University", "university")}
          {checkboxGroup("Field of study", "field")}
          {checkboxGroup("Language of instruction", "language")}
          <FilterGroup title="Verification status">
            <Option type="radio" name="check" label="Any" checked={!active.check} onChange={() => setF((s) => ({ ...s, check: null }))} />
            <Option type="radio" name="check" label="Fully verified" count={count("check", "full")} checked={active.check === "full"} onChange={() => setF((s) => ({ ...s, check: "full" }))} />
            <Option type="radio" name="check" label="Needs review" count={count("check", "review")} checked={active.check === "review"} onChange={() => setF((s) => ({ ...s, check: "review" }))} />
          </FilterGroup>
        </aside>

        <section aria-label="Programmes" className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">{rows.length} programme{rows.length === 1 ? "" : "s"}</p>
            <div role="group" aria-label="View" className="inline-flex rounded-full border border-line bg-surface p-0.5">
              {([["list", "List view", <IconList key="l" size={16} />], ["grid", "Grid view", <IconGrid key="g" />]] as const).map(([v, name, icon]) => (
                <button
                  key={v}
                  type="button"
                  aria-label={name}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`press rounded-full px-3 py-1.5 transition-colors ${view === v ? "bg-primary text-primary-fg" : "text-muted hover:text-ink"}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {rows.length === 0 ? (
            <EmptyState title="No programmes match your filters" action={<button type="button" onClick={clear} className="btn rounded-full border border-line bg-surface px-5 py-2 text-sm font-semibold hover:bg-surface-2">Clear filters</button>}>
              Try another degree level or country, or clear the search.
            </EmptyState>
          ) : (
            <ul className={view === "grid" ? "stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "stagger space-y-3"}>
              {rows.map(({ p, uni, verified, total, dStatus, match }) => (
                <li key={p.slug}>
                  <Link href={`/programs/${p.slug}`} className="lift flex h-full flex-col rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow)] hover:border-primary">
                    <div className={`flex flex-wrap items-start justify-between gap-3 ${view === "grid" ? "flex-col" : ""}`}>
                      <div>
                        <h2 className="text-lg font-semibold">{p.name}</h2>
                        <p className="text-sm text-muted">{uni.name} · {uni.city}, {uni.country}</p>
                      </div>
                      <div className="flex flex-wrap gap-2"><Tag>{LEVEL_LABEL[p.level]}</Tag><Tag>{p.field}</Tag><Tag>{p.format}</Tag>{match ? <Tag>Matches your preferences</Tag> : null}</div>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted">Deadline</span>
                        <strong>{dStatus === "verified" ? formatDate(p.deadline.date) : "No verified deadline"}</strong>
                        <StatusBadge status={dStatus} quiet />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted">{verified} of {total} requirements verified</span>
                        <span className="inline-block h-1.5 w-20 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                          <span className="block h-full" style={{ width: `${(verified / total) * 100}%`, background: "var(--text)" }} />
                        </span>
                        <IconChevron size={16} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4"><IllustrativeNote /></div>
        </section>
      </div>
    </div>
  );
}
