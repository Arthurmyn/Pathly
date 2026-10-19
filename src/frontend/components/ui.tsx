import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT: { [K in Variant]: string } = {
  primary: "bg-primary text-primary-fg hover:bg-primary-hover",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-2",
  ghost: "text-ink hover:bg-surface-2",
};

const BASE =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function LinkButton({ href, variant = "primary", children, className = "" }: { href: string; variant?: Variant; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`${BASE} ${VARIANT[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({ variant = "primary", className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={`${BASE} ${VARIANT[variant]} ${className}`} {...rest} />;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow)] ${className}`}>{children}</section>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-medium leading-tight tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Callout({ tone = "info", title, children }: { tone?: "info" | "warn"; title?: string; children: ReactNode }) {
  const style =
    tone === "warn"
      ? { background: "var(--surface)", color: "var(--text)", borderColor: "var(--text)", borderStyle: "dashed" as const, borderWidth: 1.5 }
      : { background: "var(--surface-2)", color: "var(--text)", borderColor: "var(--border)" };
  return (
    <div className="rounded-2xl border px-4 py-3 text-sm" style={style} role="note">
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-0.5" : ""}>{children}</div>
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-dashed border-line bg-surface px-6 py-10 text-center">
      <p className="font-semibold">{title}</p>
      {children ? <p className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

/** Reminder that all data in the demo is invented. */
export function IllustrativeNote() {
  return (
    <p className="text-xs text-muted">
      Illustrative data: universities, programmes and sources are invented for this demo.
    </p>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">{children}</span>;
}

/** Small uppercase label used as a card header (letter-spaced, gray). */
export function CardLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{children}</p>;
}
