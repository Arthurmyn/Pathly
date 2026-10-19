import type { Summary } from "@/lib/eligibility";
import { OUTCOME_LABEL } from "./badges";
import type { Outcome } from "@/lib/types";

const ORDER: Outcome[] = ["met", "not_met", "pending", "unknown"];

/** Segmented bar of result counts. Shows counts, never a percentage or a "match score". */
export function OutcomeBar({ summary }: { summary: Summary }) {
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-2" role="img" aria-label={ORDER.map((o) => `${summary[o]} ${OUTCOME_LABEL[o]}`).join(", ")}>
        {ORDER.map((o) =>
          summary[o] > 0 ? (
            <span
              key={o}
              style={{ width: `${(summary[o] / Math.max(summary.total, 1)) * 100}%`, background: `var(--oc-${o}-fg)`, opacity: o === "unknown" ? 0.55 : 1 }}
            />
          ) : null,
        )}
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {ORDER.map((o) => (
          <div key={o} className="flex items-baseline gap-1.5">
            <dd className="text-xl font-semibold tabular-nums">{summary[o]}</dd>
            <dt className="text-muted">{OUTCOME_LABEL[o]}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
