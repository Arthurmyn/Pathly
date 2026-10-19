import type { ReactNode } from "react";
import { STATUS_HELP, STATUS_LABEL } from "@/lib/status";
import type { DataStatus, Outcome } from "@/lib/types";
import {
  IconCheck,
  IconCircleDashed,
  IconCircleOff,
  IconClockAlert,
  IconConflict,
  IconHourglass,
  IconQuestion,
  IconShieldCheck,
  IconX,
} from "./icons";

const STATUS_ICON: { [K in DataStatus]: ReactNode } = {
  verified: <IconShieldCheck size={13} />,
  unverified: <IconCircleDashed size={13} />,
  stale: <IconClockAlert size={13} />,
  missing: <IconCircleOff size={13} />,
  conflict: <IconConflict size={13} />,
};

/** Describes the DATA: how far a stored record can be trusted. Small badge with icon and text. */
export function StatusBadge({ status }: { status: DataStatus }) {
  return (
    <span
      title={STATUS_HELP[status]}
      data-status={status}
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{
        background: `var(--st-${status}-bg)`,
        color: `var(--st-${status}-fg)`,
        borderColor: `var(--st-${status}-bd)`,
        borderStyle: status === "missing" ? "dashed" : "solid",
      }}
    >
      {STATUS_ICON[status]}
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

const OUTCOME_ICON: { [K in Outcome]: ReactNode } = {
  met: <IconCheck size={14} />,
  not_met: <IconX size={14} />,
  pending: <IconHourglass size={14} />,
  unknown: <IconQuestion size={14} />,
};

/** Describes the PERSON: the result for this applicant. Larger pill than the status badge. */
export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  return (
    <span
      data-outcome={outcome}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-semibold whitespace-nowrap"
      style={{
        background: `var(--oc-${outcome}-bg)`,
        color: `var(--oc-${outcome}-fg)`,
        border: outcome === "unknown" ? "1.5px dashed currentColor" : "1.5px solid transparent",
      }}
    >
      {OUTCOME_ICON[outcome]}
      {OUTCOME_LABEL[outcome]}
    </span>
  );
}
