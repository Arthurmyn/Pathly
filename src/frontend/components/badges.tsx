import { STATUS_HELP, STATUS_LABEL } from "@/lib/status";
import type { DataStatus, Outcome } from "@/lib/types";

/**
 * Describes the DATA: how far a stored record can be trusted. A coloured dot and a label.
 * The dot also differs by shape (filled, hollow, dashed), so the meaning never rests on colour alone.
 * `quiet` leaves Verified and Unverified records without a badge where the source line next to them already says so.
 */
export function StatusBadge({ status, quiet = false }: { status: DataStatus; quiet?: boolean }) {
  if (quiet && (status === "verified" || status === "unverified")) return null;
  return (
    <span title={STATUS_HELP[status]} data-status={status} className="badge-status" style={{ ["--dot" as string]: `var(--st-${status}-fg)` }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export const OUTCOME_LABEL: { [K in Outcome]: string } = {
  met: "Met",
  not_met: "Not met",
  pending: "Pending",
  unknown: "Unknown",
};

/** Describes the PERSON: the result for this applicant, in the same dot-and-label style. */
export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  return (
    <span data-outcome={outcome} className="badge-outcome" style={{ ["--dot" as string]: `var(--oc-${outcome}-fg)` }}>
      {OUTCOME_LABEL[outcome]}
    </span>
  );
}
