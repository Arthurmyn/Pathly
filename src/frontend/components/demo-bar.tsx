"use client";

import { DEMO_TODAY, formatDate } from "@/lib/dates";
import { useAppState } from "./app-state";

/** Demo-only controls: shows that data is illustrative and lets the viewer move the date to see records go Stale. */
export function DemoBar() {
  const { today, setToday, resetDemo, ready } = useAppState();
  return (
    <div className="border-b border-line bg-primary-soft text-xs text-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5">
        <p>
          <strong>Demo</strong> · Illustrative data, no real universities. Nothing is sent anywhere.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5">
            <span>Today in the demo:</span>
            <input
              type="date"
              value={today}
              onChange={(e) => e.target.value && setToday(e.target.value)}
              disabled={!ready}
              aria-label="Demo date"
              className="rounded border border-line bg-surface px-1.5 py-0.5 text-xs"
            />
          </label>
          <span className="hidden text-muted sm:inline">({formatDate(today)})</span>
          {today !== DEMO_TODAY ? (
            <button type="button" onClick={() => setToday(DEMO_TODAY)} className="rounded border border-line bg-surface px-1.5 py-0.5 hover:bg-surface-2">
              Back to {formatDate(DEMO_TODAY)}
            </button>
          ) : null}
          <button type="button" onClick={resetDemo} className="rounded border border-line bg-surface px-1.5 py-0.5 hover:bg-surface-2">
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}
