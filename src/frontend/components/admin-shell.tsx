"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { buildQueue } from "./admin-data";
import { useAppState } from "./app-state";
import { IconClock, IconDatabase, IconHome } from "./icons";
import { Logo } from "./logo";
import { RequireRole } from "./require-role";

export function AdminShell({ children }: { children: ReactNode }) {
  const state = useAppState();
  const pathname = usePathname();
  const open = buildQueue(state.allRequirements(), state.today).length;
  const nav = [
    { href: "/admin", label: "Overview", icon: IconHome, exact: true },
    { href: "/admin/queue", label: "Verification queue", icon: IconDatabase, badge: open },
    { href: "/admin/audit-log", label: "Audit log", icon: IconClock },
  ];
  return (
    <RequireRole role="admin">
      <div className="min-h-[calc(100vh-2rem)]">
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
          <div className="flex items-center gap-3"><Logo href="/admin" /><span className="rounded bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">Admin</span></div>
          <button type="button" onClick={state.signOut} className="text-sm text-muted hover:text-ink">Sign out</button>
        </header>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[14rem_1fr]">
          <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">
            {nav.map((n) => {
              const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
              const Icon = n.icon;
              return (
                <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${active ? "bg-primary-soft font-semibold" : "text-muted hover:bg-surface-2 hover:text-ink"}`}>
                  <span className="flex items-center gap-3"><Icon size={18} />{n.label}</span>
                  {n.badge ? <span className="rounded-full bg-surface-2 px-2 text-xs font-semibold text-ink">{n.badge}</span> : null}
                </Link>
              );
            })}
          </nav>
          <main id="content" className="min-w-0">{children}</main>
        </div>
      </div>
    </RequireRole>
  );
}
