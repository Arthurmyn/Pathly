"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/dates";
import { effectiveStatus } from "@/lib/status";
import { LEVEL_LABEL, programs, universities } from "@/lib/mock-data";
import type { DegreeLevel } from "@/lib/types";
import { useAppState } from "./app-state";
import { StatusBadge } from "./badges";
import { IconChevron } from "./icons";
import { EmptyState, IllustrativeNote, Tag } from "./ui";

type Sort = "name" | "deadline" | "verified";

export function Catalogue() {
  const { today, requirementsFor } = useAppState();
  const [level, setLevel] = useState<DegreeLevel | "all">("all");
  const [country, setCountry] = useState("all");
  const urlQuery = useSearchParams().get("q") ?? "";
  const [typed, setTyped] = useState<string | null>(null);
  const query = typed ?? urlQuery;
  const setQuery = (v: string) => setTyped(v);
  const [sort, setSort] = useState<Sort>("name");

  const countries = useMemo(() => Array.from(new Set(universities.map((u) => u.country))), []);

  const rows = useMemo(() => {
    return programs
      .map((p) => {
        const uni = universities.find((u) => u.id === p.universityId)!;
        const reqs = requirementsFor(p.slug);
        const verified = reqs.filter((r) => effectiveStatus(r, today) === "verified").length;
        const dStatus = effectiveStatus(p.deadline, today);
        return { p, uni, verified, total: reqs.length, dStatus };
      })
      .filter(({ p, uni }) => (level === "all" || p.level === level) && (country === "all" || uni.country === country))
      .filter(({ p, uni }) => `${p.name} ${uni.name} ${p.field}`.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => {
        if (sort === "verified") return b.verified / b.total - a.verified / a.total;
        if (sort === "deadline") return (a.p.deadline.date ?? "9999").localeCompare(b.p.deadline.date ?? "9999");
        return a.p.name.localeCompare(b.p.name);
      });
  }, [level, country, query, sort, today, requirementsFor]);

  const field = "mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm";

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside aria-label="Filters" className="space-y-5">
        <label className="block text-sm font-medium">
          Search
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Programme, university or field" className={field} />
        </label>
        <fieldset>
          <legend className="text-sm font-medium">Degree level</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["all", "bachelor", "master", "phd"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={level === l}
                onClick={() => setLevel(l)}
                className={`rounded-full border px-3 py-1 text-sm ${level === l ? "border-primary bg-primary-soft font-semibold" : "border-line bg-surface text-muted hover:text-ink"}`}
              >
                {l === "all" ? "All" : LEVEL_LABEL[l]}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-medium">
          Country
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={field}>
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={field}>
            <option value="name">Name</option>
            <option value="deadline">Deadline</option>
            <option value="verified">Most verified</option>
          </select>
        </label>
        <IllustrativeNote />
      </aside>

      <section aria-label="Programmes">
        <p className="mb-3 text-sm text-muted" aria-live="polite">{rows.length} programme{rows.length === 1 ? "" : "s"}</p>
        {rows.length === 0 ? (
          <EmptyState title="No programmes match your filters">Try another degree level or country, or clear the search.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ p, uni, verified, total, dStatus }) => (
              <li key={p.slug}>
                <Link href={`/programs/${p.slug}`} className="block rounded-[20px] border border-line bg-surface shadow-[var(--shadow)] p-5 transition-colors hover:border-primary">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{p.name}</h2>
                      <p className="text-sm text-muted">{uni.name} · {uni.city}, {uni.country}</p>
                    </div>
                    <div className="flex gap-2"><Tag>{LEVEL_LABEL[p.level]}</Tag><Tag>{p.field}</Tag></div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Deadline</span>
                      <strong>{dStatus === "verified" ? formatDate(p.deadline.date) : "No verified deadline"}</strong>
                      <StatusBadge status={dStatus} />
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
      </section>
    </div>
  );
}
