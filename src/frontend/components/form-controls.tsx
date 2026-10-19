"use client";

import { useId, useState, type ReactNode } from "react";

export const inputClass =
  "mt-1.5 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm transition-colors hover:border-strong focus:border-primary";

export function Field({ label, help, error, children }: { label: string; help?: string; error?: string | null; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {help && !error ? <span className="mt-1 block text-xs font-normal text-muted">{help}</span> : null}
      {error ? (
        <span role="alert" className="mt-1 block text-xs font-normal" style={{ color: "var(--danger)" }}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function TextField({ label, value, placeholder, help, onChange }: { label: string; value: string | null; placeholder?: string; help?: string; onChange: (v: string | null) => void }) {
  return (
    <Field label={label} help={help}>
      <input className={inputClass} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value || null)} />
    </Field>
  );
}

export function SelectField({ label, value, options, placeholder = "Not set", help, onChange }: { label: string; value: string | null; options: { value: string; label: string }[]; placeholder?: string; help?: string; onChange: (v: string | null) => void }) {
  return (
    <Field label={label} help={help}>
      <select className={inputClass} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

/** Number field: valid values commit immediately, out-of-range values show a message and are not committed. */
export function NumberField({ label, value, min, max, step = 1, help, onCommit, compact = false }: { label: string; value: number | null; min: number; max: number; step?: number; help?: string; onCommit: (v: number | null) => void; compact?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const shown = text ?? (value == null ? "" : String(value));
  return (
    <Field label={label} help={help} error={error}>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={shown}
        className={compact ? inputClass.replace("mt-1.5", "mt-1") : inputClass}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);
          if (raw.trim() === "") { setError(null); return onCommit(null); }
          const n = Number(raw);
          if (Number.isNaN(n) || n < min || n > max) return setError(`Enter a number from ${min} to ${max}.`);
          setError(null);
          onCommit(n);
        }}
        onBlur={() => setText(null)}
      />
    </Field>
  );
}

/** Row of pill buttons for a short single choice. */
export function Pills<T extends string | boolean | null>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`press rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface hover:bg-surface-2"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Switch for a yes/no setting. */
export function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-strong"}`}
      >
        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

/** Card section with a title and a completion badge, as on the profile and settings pages. */
export function Section({ title, badge, description, children }: { title: string; badge?: ReactNode; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

export function CompleteBadge({ filled, total }: { filled: number; total: number }) {
  const done = filled === total;
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${done ? "bg-success-bg text-success" : "bg-surface-2 text-muted"}`}>
      {done ? "Complete" : `${filled} of ${total}`}
    </span>
  );
}
