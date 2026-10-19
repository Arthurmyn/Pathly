import type { DataStatus, Source } from "./types";

/** Anything that carries a stored status: a requirement or a deadline. */
export interface Checkable {
  status: DataStatus;
  source: Source | null;
  validUntil: string | null;
}

/**
 * Status of a record on a given date (FR-07, NFR-05).
 * - A record can only be Verified with a Tier 1 source.
 * - A Verified record whose validity date has passed is Stale.
 */
export function effectiveStatus(record: Checkable, today: string): DataStatus {
  if (record.status !== "verified") return record.status;
  if (!record.source || record.source.tier !== 1) return "unverified";
  if (record.validUntil && record.validUntil < today) return "stale";
  return "verified";
}

export const STATUS_LABEL: { [K in DataStatus]: string } = {
  verified: "Verified",
  unverified: "Unverified",
  stale: "Stale",
  missing: "Missing",
  conflict: "Conflict",
};

export const STATUS_HELP: { [K in DataStatus]: string } = {
  verified: "Official source, reviewed by an administrator, inside its validity window.",
  unverified: "Entered but not reviewed, or supported only by a secondary or third-party source.",
  stale: "The validity date has passed or the source changed, so we cannot rely on it.",
  missing: "The programme expects this item but no value is stored yet.",
  conflict: "Two sources disagree. It stays unknown until an administrator resolves it.",
};
