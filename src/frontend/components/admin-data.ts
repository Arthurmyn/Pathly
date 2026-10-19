import { formatDate } from "@/lib/dates";
import { getProgram } from "@/lib/mock-data";
import { effectiveStatus } from "@/lib/status";
import type { DataStatus, Program, Requirement } from "@/lib/types";

export const QUEUE_ORDER: Exclude<DataStatus, "verified">[] = ["conflict", "stale", "missing", "unverified"];

export interface QueueItem {
  requirement: Requirement;
  program: Program;
  status: Exclude<DataStatus, "verified">;
  reason: string;
}

function reasonFor(r: Requirement, status: QueueItem["status"]): string {
  switch (status) {
    case "conflict":
      return r.conflictNote ?? "Two sources disagree.";
    case "stale":
      return `Validity ended on ${formatDate(r.validUntil)}; re-check the source.`;
    case "missing":
      return "The programme expects this item but no value is stored.";
    case "unverified":
      return r.source && r.source.tier !== 1 ? `Only a Tier ${r.source.tier} source; needs an official source.` : "Entered but not reviewed yet.";
  }
}

/** Records that are not usable as facts on the given date, grouped later by queue (FR-06). */
export function buildQueue(requirements: Requirement[], today: string): QueueItem[] {
  const items: QueueItem[] = [];
  for (const r of requirements) {
    const status = effectiveStatus(r, today);
    if (status === "verified") continue;
    const program = getProgram(r.programSlug);
    if (!program) continue;
    items.push({ requirement: r, program, status, reason: reasonFor(r, status) });
  }
  return items.sort((a, b) => QUEUE_ORDER.indexOf(a.status) - QUEUE_ORDER.indexOf(b.status));
}
