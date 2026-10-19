"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconCheck, IconChevron } from "./icons";

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

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Custom dropdown (listbox) in the site's style instead of the browser's native list.
 * Keyboard: Arrow keys, Home, End, Enter or Space to choose, Escape to close.
 */
export function Select({
  label,
  value,
  options,
  placeholder = "Not set",
  onChange,
  icon,
  variant = "field",
  className = "",
}: {
  label: string;
  value: string | null;
  options: SelectOption[];
  /** Shown when the value is empty. When set, an empty choice is offered as the first option. */
  placeholder?: string | null;
  onChange: (v: string | null) => void;
  icon?: ReactNode;
  variant?: "field" | "pill" | "compact";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [box, setBox] = useState<{ left: number; top: number; minWidth: number } | null>(null);
  const listId = useId();
  const all: SelectOption[] = placeholder != null ? [{ value: "", label: placeholder }, ...options] : options;
  const current = all.find((o) => o.value === (value ?? ""));

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!root.current?.contains(t) && !list.current?.contains(t)) setOpen(false);
    };
    // The list is fixed to the viewport, so follow the button when the page scrolls or resizes.
    const follow = (e: Event) => {
      if (list.current?.contains(e.target as Node)) return;
      const r = root.current?.getBoundingClientRect();
      if (r) setBox({ left: r.left, top: r.bottom + 6, minWidth: r.width });
    };
    document.addEventListener("pointerdown", away);
    window.addEventListener("resize", follow);
    window.addEventListener("scroll", follow, true);
    return () => {
      document.removeEventListener("pointerdown", away);
      window.removeEventListener("resize", follow);
      window.removeEventListener("scroll", follow, true);
    };
  }, [open]);

  function show() {
    const r = root.current?.getBoundingClientRect();
    if (r) setBox({ left: r.left, top: r.bottom + 6, minWidth: r.width });
    setActive(Math.max(0, all.findIndex((o) => o.value === (value ?? ""))));
    setOpen(true);
  }
  function choose(o: SelectOption) {
    onChange(o.value === "" ? null : o.value);
    setOpen(false);
    root.current?.querySelector("button")?.focus();
  }
  function key(e: React.KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); show(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(all.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(all.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(all[active]); }
    else if (e.key === "Tab") setOpen(false);
  }

  const size = variant === "pill" ? "rounded-full py-2.5 pl-4 pr-3.5" : variant === "compact" ? "rounded-xl py-1.5 pl-3 pr-2.5" : "mt-1.5 w-full rounded-xl py-2 pl-3 pr-2.5";
  return (
    <div ref={root} className={`relative ${variant === "field" ? "block" : "inline-block"} ${className}`} onKeyDown={key}>
      <button
        type="button"
        aria-label={`${label}: ${current?.label ?? ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        className={`flex items-center justify-between gap-3 border bg-surface text-sm transition-colors ${open ? "border-primary" : "border-line hover:border-strong"} ${size}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {icon ? <span className="text-muted">{icon}</span> : null}
          <span className={`truncate ${value ? "font-medium" : "text-muted"} ${variant === "pill" ? "font-medium text-ink" : ""}`}>{current?.label ?? placeholder}</span>
        </span>
        <span className={`shrink-0 text-muted transition-transform duration-150 ${open ? "-rotate-90" : "rotate-90"}`}><IconChevron size={14} /></span>
      </button>
      {open && box
        ? createPortal(
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-label={label}
          style={{ position: "fixed", left: box.left, top: box.top, minWidth: box.minWidth }}
          className="pop z-[60] max-h-64 origin-top overflow-auto rounded-2xl border border-line bg-surface p-1.5 shadow-[var(--shadow-lift)]"
        >
          {all.map((o, i) => {
            const selected = o.value === (value ?? "");
            return (
              <li
                key={o.value || "__empty"}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(o)}
                className={`flex cursor-pointer items-center justify-between gap-4 whitespace-nowrap rounded-xl px-3 py-2 text-sm ${i === active ? "bg-surface-2" : ""} ${selected ? "font-semibold text-primary" : ""} ${o.value === "" ? "text-muted" : ""}`}
              >
                {o.label}
                {selected ? <IconCheck size={15} /> : null}
              </li>
            );
          })}
        </ul>,
        document.body,
      )
      : null}
    </div>
  );
}

export function SelectField({ label, value, options, placeholder = "Not set", help, onChange }: { label: string; value: string | null; options: SelectOption[]; placeholder?: string; help?: string; onChange: (v: string | null) => void }) {
  return (
    <div className="text-sm font-medium">
      <span>{label}</span>
      <Select label={label} value={value} options={options} placeholder={placeholder} onChange={onChange} />
      {help ? <span className="mt-1 block text-xs font-normal text-muted">{help}</span> : null}
    </div>
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

/** Multi-choice dropdown with a search box; chosen values appear as removable chips below. */
export function MultiSelect({ label, value, options, placeholder = "Choose", onChange }: { label: string; value: string[]; options: string[]; placeholder?: string; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [box, setBox] = useState<{ left: number; top: number; width: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!root.current?.contains(t) && !list.current?.contains(t)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const follow = (e: Event) => {
      if (list.current?.contains(e.target as Node)) return;
      const r = root.current?.getBoundingClientRect();
      if (r) setBox({ left: r.left, top: r.bottom + 6, width: r.width });
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    window.addEventListener("resize", follow);
    window.addEventListener("scroll", follow, true);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("resize", follow);
      window.removeEventListener("scroll", follow, true);
    };
  }, [open]);

  function show() {
    const r = root.current?.getBoundingClientRect();
    if (r) setBox({ left: r.left, top: r.bottom + 6, width: r.width });
    setSearch("");
    setOpen(true);
  }
  const shown = options.filter((o) => o.toLowerCase().includes(search.trim().toLowerCase()));
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);

  return (
    <div ref={root}>
      <button
        type="button"
        aria-label={`${label}: ${value.length ? `${value.length} selected` : "none selected"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        className={`mt-1.5 flex w-full items-center justify-between gap-3 rounded-xl border bg-surface py-2 pl-3 pr-2.5 text-sm transition-colors ${open ? "border-primary" : "border-line hover:border-strong"}`}
      >
        <span className={value.length ? "font-medium" : "text-muted"}>{value.length ? `${value.length} selected` : placeholder}</span>
        <span className={`shrink-0 text-muted transition-transform duration-150 ${open ? "-rotate-90" : "rotate-90"}`}><IconChevron size={14} /></span>
      </button>
      {value.length ? (
        <ul className="mt-2 flex flex-wrap gap-2" aria-label={`${label}, selected`}>
          {value.map((v) => (
            <li key={v}>
              <button type="button" onClick={() => toggle(v)} aria-label={`Remove ${v}`} className="press inline-flex items-center gap-1.5 rounded-full border border-primary bg-primary-soft px-3 py-1 text-sm font-medium text-primary">
                {v} <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {open && box
        ? createPortal(
            <div ref={list} id={listId} style={{ position: "fixed", left: box.left, top: box.top, width: Math.max(box.width, 240) }} className="pop z-[60] origin-top rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-lift)]">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={`Search ${label.toLowerCase()}`}
                placeholder="Search"
                className="mb-1.5 w-full rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm focus:border-primary focus:bg-surface"
              />
              <ul role="listbox" aria-multiselectable="true" aria-label={label} className="max-h-60 overflow-auto">
                {shown.length === 0 ? <li className="px-3 py-2 text-sm text-muted">Nothing found</li> : null}
                {shown.map((o) => {
                  const on = value.includes(o);
                  return (
                    <li key={o} role="option" aria-selected={on} onClick={() => toggle(o)} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm hover:bg-surface-2">
                      <span className={on ? "font-semibold text-primary" : ""}>{o}</span>
                      {on ? <IconCheck size={15} /> : null}
                    </li>
                  );
                })}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
