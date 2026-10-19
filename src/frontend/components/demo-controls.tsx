"use client";

import { DEMO_TODAY, formatDate } from "@/lib/dates";
import { useAppState } from "./app-state";
import { Button, Card, CardLabel } from "./ui";

/** Demo-only controls: move the date to see records go Stale, or reset the demo data. */
export function DemoControls() {
  const { today, setToday, resetDemo, ready } = useAppState();
  return (
    <Card>
      <CardLabel>Developer tools · demo mode</CardLabel>
      <p className="mt-2 text-sm text-muted">Demo status: on. Only visible in the demo build.</p>
      <p className="mt-2 rounded-xl border border-dashed border-strong px-3 py-2 text-sm">The data in this demo is demonstration data: universities, programmes and sources are invented.</p>
      <p className="mt-2 text-sm text-muted">
         Move the date forward to see Verified records turn Stale once their validity ends. Nothing is sent anywhere.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          Today in the demo
          <input
            type="date"
            value={today}
            onChange={(e) => e.target.value && setToday(e.target.value)}
            disabled={!ready}
            aria-label="Demo date"
            className="rounded-lg border border-line bg-bg px-2 py-1.5 text-sm"
          />
        </label>
        {today !== DEMO_TODAY ? <Button variant="secondary" onClick={() => setToday(DEMO_TODAY)}>Back to {formatDate(DEMO_TODAY)}</Button> : null}
        <Button variant="ghost" onClick={resetDemo}>Reset demo data</Button>
      </div>
    </Card>
  );
}
