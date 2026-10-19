"use client";

import type { ReactNode } from "react";

export interface PillTab<T extends string> {
  id: T;
  label: string;
  count?: number;
}

/** Pill tabs with optional count chips; the active tab is filled black (white in dark mode). */
export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  right,
}: {
  tabs: PillTab<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => onChange(t.id)}
              className={`press inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                active ? "border-primary bg-primary text-primary-fg" : "border-line bg-surface text-ink hover:bg-surface-2"
              }`}
            >
              {t.label}
              {t.count !== undefined ? (
                <span className={`rounded-full px-1.5 text-[11px] leading-5 ${active ? "bg-primary-fg/20" : "bg-surface-2 text-muted"}`}>{t.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {right}
    </div>
  );
}
