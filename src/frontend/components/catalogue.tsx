"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { formatDate } from "@/lib/dates";
import { effectiveStatus } from "@/lib/status";
import { LEVEL_LABEL, programs, universities } from "@/lib/mock-data";
import type { DegreeLevel } from "@/lib/types";
import { matchesPreferences } from "@/lib/settings";
import { useAppState } from "./app-state";
import { Select } from "./form-controls";
import { StatusBadge } from "./badges";
import { IconBook, IconChevron, IconCompass, IconFilter, IconList, IconSearch, IconShieldCheck, IconX } from "./icons";
import { EmptyState, IllustrativeNote, Tag } from "./ui";

type Sort = "name" | "deadline" | "verified";
type Check = "all" | "full" | "review";
type View = "list" | "grid";

const IconGrid = (p: { size?: number }) => (
  <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);

function FilterSelect({ label, icon, value, onChange, options }: { label: string; icon: ReactNode; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return <Select variant="pill" label={label} icon={icon} placeholder={null} value={value} options={options} onChange={(v) => onChange(v ?? options[0].value)} className="min-w-[11rem]" />;
}

export function Catalogue() {
  const { today, requirementsFor, settings } = useAppState();
  const [level, setLevel] = useState<DegreeLevel | "all">("all");
  const [country, setCountry] = useState("all");
  const [fieldOf, setFieldOf] = useState("all");
  const [check, setCheck] = useState<Check>("all");
  const urlQuery = useSearchParams().get("q") ?? "";
  const [typed, setTyped] = useState<string | null>(null);
  const query = typed ?? urlQuery;
  const [sort, setSort] = useState<Sort>("name");
  const [view, setView] = useState<View>("list");

  const countries = useMemo(() => Array.from(new Set(universities.map((u) => u.country))), []);
  const fields = useMemo(() => Array.from(new Set(programs.map((p) => p.field))).sort(), []);

  const rows = useMemo(() => {
    return programs
      .map((p) => {
        const uni = universities.find((u) => u.id === p.universityId)!;
        const reqs = requirementsFor(p.slug);
        const verified = reqs.filter((r) => effectiveStatus(r, today) === "verified").length;
        const dStatus = effectiveStatus(p.deadline, today);
        return { p, uni, verified, total: reqs.length, dStatus, match: matchesPreferences(settings.study, p, uni.country) };
      })
      .filter(({ p, uni }) => (level === "all" || p.level === level) && (country === "all" || uni.country === country) && (fieldOf === "all" || p.field === fieldOf))
      .filter(({ verified, total, dStatus }) => {
        const full = verified === total && dStatus === "verified";
        return check === "all" || (check === "full" ? full : !full);
      })
      .filter(({ p, uni }) => `${p.name} ${uni.name} ${p.field}`.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => {
        if (sort === "verified") return b.verified / b.total - a.verified / a.total;
        if (sort === "deadline") return (a.p.deadline.date ?? "9999").localeCompare(b.p.deadline.date ?? "9999");
        return a.p.name.localeCompare(b.p.name);
      });
  }, [level, country, fieldOf, check, query, sort, today, requirementsFor, settings.study]);

  const filtered = level !== "all" || country !== "all" || fieldOf !== "all" || check !== "all" || query !== "";
  function clear() {
    setLevel("all"); setCountry("all"); setFieldOf("all"); setCheck("all"); setTyped("");
  }

  return (
    <div>
      <div role="search" aria-label="Filters" className="rounded-[20px] border border-line bg-surface p-4 shadow-[var(--shadow)]">
        <label className="relative block">
          <span className="sr-only">Search the catalogue</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"><IconSearch size={18} /></span>
          <input
            type="search"
            value={query}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Search by programme, university or field"
            className="w-full rounded-full border border-line bg-surface-2 py-3 pl-11 pr-4 text-sm transition-colors focus:border-primary focus:bg-surface"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-sm font-medium text-muted" id="level-label">Degree level</span>
          <div role="group" aria-labelledby="level-label" className="flex flex-wrap gap-2">
            {(["all", "bachelor", "master", "phd"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={level === l}
                onClick={() => setLevel(l)}
                className={`press rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${level === l ? "border-primary bg-primary text-primary-fg" : "border-line bg-surface hover:bg-surface-2"}`}
              >
                {l === "all" ? "All" : LEVEL_LABEL[l]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterSelect label="Country" icon={<IconCompass size={16} />} value={country} onChange={setCountry} options={[{ value: "all", label: "All countries" }, ...countries.map((c) => ({ value: c, label: c }))]} />
          <FilterSelect label="Field of study" icon={<IconBook size={16} />} value={fieldOf} onChange={setFieldOf} options={[{ value: "all", label: "All fields" }, ...fields.map((f) => ({ value: f, label: f }))]} />
          <FilterSelect
            label="Verification status"
            icon={<IconShieldCheck size={16} />}
            value={check}
            onChange={(v) => setCheck(v as Check)}
            options={[{ value: "all", label: "Any verification" }, { value: "full", label: "Fully verified" }, { value: "review", label: "Needs review" }]}
          />
          <FilterSelect
            label="Sort by"
            icon={<IconFilter size={16} />}
            value={sort}
            onChange={(v) => setSort(v as Sort)}
            options={[{ value: "name", label: "Sort: Name" }, { value: "deadline", label: "Sort: Deadline" }, { value: "verified", label: "Sort: Most verified" }]}
          />
          {filtered ? (
            <button type="button" onClick={clear} className="press inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-primary hover:bg-primary-soft">
              <IconX size={14} /> Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-3 mt-5 flex items-center justify-between gap-3">
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

      <section aria-label="Programmes">
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
                    <div className="flex flex-wrap gap-2"><Tag>{LEVEL_LABEL[p.level]}</Tag><Tag>{p.field}</Tag>{match ? <Tag>Matches your preferences</Tag> : null}</div>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Deadline</span>
                      <strong>{dStatus === "verified" ? formatDate(p.deadline.date) : "No verified deadline"}</strong>
                      <StatusBadge status={dStatus} plain />
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
  );
}
