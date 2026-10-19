"use client";

import { useState } from "react";
import { formatDate } from "@/lib/dates";
import { describeRequired } from "@/lib/eligibility";
import { effectiveStatus, STATUS_HELP } from "@/lib/status";
import type { EligibilityResult, Requirement } from "@/lib/types";
import { useAppState } from "./app-state";
import { OutcomeBadge, StatusBadge } from "./badges";
import { IconChevron } from "./icons";
import { SourceChip } from "./source-chip";

/**
 * One requirement: label, status, source, verification date. With a result (signed-in applicant with a profile)
 * it also shows the applicant's value and the outcome, plus an expandable explanation.
 */
export function RequirementRow({ requirement, today, result }: { requirement: Requirement; today: string; result?: EligibilityResult }) {
  const [open, setOpen] = useState(false);
  const { requests, requestVerification } = useAppState();
  const status = effectiveStatus(requirement, today);
  const needsHelp = status !== "verified";
  const asked = requests.includes(requirement.id);
  const panelId = `why-${requirement.id}`;

  return (
    <li className="px-4 py-3" data-requirement={requirement.id} data-status={status}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{requirement.label}</p>
          <p className="mt-0.5 text-sm text-muted">
            Required: <span className="text-ink">{result ? result.requiredText : describeRequired(requirement)}</span>
            {result ? (
              <>
                {" "}· You: <span className="text-ink">{result.applicantText}</span>
              </>
            ) : null}
          </p>
          <div className="mt-1.5">
            <SourceChip source={requirement.source} date={requirement.verifiedAt} dateLabel={status === "verified" ? "Verified" : "Last verified"} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {result ? <OutcomeBadge outcome={result.outcome} /> : null}
          <StatusBadge status={status} />
        </div>
      </div>

      {needsHelp ? (
        <p className="mt-2 text-sm" style={{ color: `var(--st-${status}-fg)` }}>
          {status === "stale" ? `Source expired on ${formatDate(requirement.validUntil)}. ` : null}
          {status === "missing" ? "No value is stored yet. " : null}
          {status === "conflict" ? `${requirement.conflictNote ?? "Two sources disagree."} ` : null}
          {status === "unverified" ? "Not verified by an administrator yet. " : null}
          <button
            type="button"
            className="underline underline-offset-2 disabled:no-underline disabled:opacity-70"
            onClick={() => requestVerification(requirement.id)}
            disabled={asked}
          >
            {asked ? "Verification requested" : "Request verification"}
          </button>
        </p>
      ) : null}

      <button
        type="button"
        className="mt-2 inline-flex items-center gap-1 text-sm text-primary"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <IconChevron size={14} className={`transition-transform duration-200 ease-[var(--ease-out)] ${open ? "rotate-90" : ""}`} />
        {open ? "Hide details" : "Why? Show the rule and source"}
      </button>
      {open ? (
        <div id={panelId} className="slide-down mt-2 rounded-lg border border-line bg-bg p-3 text-sm">
          <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[9rem_1fr]">
            <dt className="text-muted">Rule</dt>
            <dd>{result ? result.rule : "Shown after you add your profile."}</dd>
            {result ? (
              <>
                <dt className="text-muted">Your value</dt>
                <dd>{result.applicantText}</dd>
                <dt className="text-muted">Result</dt>
                <dd>{result.explanation}</dd>
              </>
            ) : null}
            <dt className="text-muted">Data status</dt>
            <dd>
              <StatusBadge status={status} /> <span className="text-muted">{STATUS_HELP[status]}</span>
            </dd>
            <dt className="text-muted">Source</dt>
            <dd>{requirement.source ? `${requirement.source.title} (Tier ${requirement.source.tier})` : "No source stored"}</dd>
            <dt className="text-muted">Verified on</dt>
            <dd>{formatDate(requirement.verifiedAt)}</dd>
            <dt className="text-muted">Valid until</dt>
            <dd>{formatDate(requirement.validUntil)}</dd>
          </dl>
        </div>
      ) : null}
    </li>
  );
}
