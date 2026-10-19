"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAppState } from "./app-state";
import { IconBook, IconChat, IconHome, IconRoute, IconSettings, IconUser } from "./icons";
import { Logo } from "./logo";
import { RequireRole } from "./require-role";

const NAV = [
  { href: "/app", label: "Dashboard", icon: IconHome, exact: true },
  { href: "/programs", label: "Programmes", icon: IconBook },
  { href: "/app/applications", label: "Applications", icon: IconRoute },
  { href: "/app/advisor", label: "Advisor", icon: IconChat },
  { href: "/app/profile", label: "Profile", icon: IconUser },
  { href: "/app/settings", label: "Settings", icon: IconSettings },
];

function Nav({ vertical }: { vertical: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Workspace" className={vertical ? "flex flex-col gap-1" : "grid grid-cols-6"}>
      {NAV.map((n) => {
        const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
        const Icon = n.icon;
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={
              vertical
                ? `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? "bg-primary-soft font-semibold text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"}`
                : `flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] leading-tight ${active ? "font-semibold text-primary" : "text-muted"}`
            }
          >
            <Icon size={vertical ? 18 : 20} />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { signOut } = useAppState();
  return (
    <RequireRole role="applicant">
      <div className="min-h-[calc(100vh-2rem)]">
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
          <Logo href="/app" />
          <button type="button" onClick={signOut} className="text-sm text-muted hover:text-ink">Sign out</button>
        </header>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:grid-cols-[13rem_1fr]">
          <aside className="hidden md:block" aria-label="Sidebar">
            <Nav vertical />
          </aside>
          <main id="content" className="min-w-0 pb-20 md:pb-0">{children}</main>
        </div>
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface md:hidden">
          <Nav vertical={false} />
        </div>
      </div>
    </RequireRole>
  );
}
