"use client";

import { useState, type ReactNode } from "react";
import { IconChevron } from "./icons";

/** A collapsible group of filter options with live counts. */
export function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="border-b border-line py-4 last:border-b-0">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-2 text-left font-semibold">
        <span className={`text-muted transition-transform duration-150 ${open ? "rotate-90" : ""}`}><IconChevron size={14} /></span>
        {title}
      </button>
      {open ? <div className="mt-3 space-y-1">{children}</div> : null}
    </section>
  );
}

export function Option({ type, name, label, count, checked, onChange }: { type: "radio" | "checkbox"; name: string; label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm ${count === 0 && !checked ? "text-muted-2" : ""}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="h-4 w-4 shrink-0 accent-[var(--primary)]" />
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined ? <span className="rounded-full bg-surface-2 px-2 text-xs tabular-nums text-muted">{count}</span> : null}
    </label>
  );
}

