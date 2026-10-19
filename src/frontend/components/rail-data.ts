import { formatDate } from "@/lib/dates";
import { getUniversity, LEVEL_LABEL, programs } from "@/lib/mock-data";
import type { Requirement } from "@/lib/types";
import type { RelatedItem, SourceItem } from "./rail";

/** Distinct sources behind the requirements shown on a page. */
export function sourcesFor(reqs: Requirement[]): SourceItem[] {
  const seen = new Map<string, SourceItem>();
  for (const r of reqs) {
    if (!r.source || seen.has(r.source.url)) continue;
    const host = r.source.url.replace(/^https?:\/\//, "").split("/")[0];
    seen.set(r.source.url, {
      id: r.source.url,
      name: r.source.title,
      detail: `${host} · Tier ${r.source.tier}${r.verifiedAt ? ` · ${formatDate(r.verifiedAt)}` : " · not verified"}`,
      href: r.source.url,
    });
  }
  return Array.from(seen.values());
}

const SKIP = new Set(["of", "the", "and", "de", "la", "del", "for", "für", "von", "der", "du", "des"]);

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w && !SKIP.has(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Other programmes: same level first, then the rest. */
export function relatedFor(slug: string, limit = 2): RelatedItem[] {
  const current = programs.find((p) => p.slug === slug);
  return programs
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.level === current?.level) - Number(a.level === current?.level))
    .slice(0, limit)
    .map((p) => {
      const uni = getUniversity(p.universityId)!;
      return { slug: p.slug, title: `${p.name}, ${uni.name}`, description: p.summary, meta: `${LEVEL_LABEL[p.level]} · ${uni.country}`, initials: initials(uni.name) };
    });
}
