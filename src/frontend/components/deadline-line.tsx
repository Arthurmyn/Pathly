import { formatDate } from "@/lib/dates";
import { effectiveStatus } from "@/lib/status";
import type { Deadline } from "@/lib/types";
import { StatusBadge } from "./badges";
import { SourceChip } from "./source-chip";

/** The deadline with its status, source and date. A deadline that is not Verified is never shown as a plain date. */
export function DeadlineLine({ deadline, today }: { deadline: Deadline; today: string }) {
  const status = effectiveStatus(deadline, today);
  const usable = status === "verified" && deadline.date;
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <p className="text-sm text-muted">{deadline.label}</p>
        <p className="text-lg font-semibold">{usable ? formatDate(deadline.date) : "No verified deadline"}</p>
        {status === "conflict" ? <p className="text-sm" style={{ color: "var(--st-conflict-fg)" }}>{deadline.conflictNote}</p> : null}
        {status === "stale" ? <p className="text-sm" style={{ color: "var(--st-stale-fg)" }}>Source expired on {formatDate(deadline.validUntil)}.</p> : null}
        <div className="mt-1"><SourceChip source={deadline.source} date={deadline.verifiedAt} /></div>
      </div>
      <StatusBadge status={status} hideVerified />
    </div>
  );
}
