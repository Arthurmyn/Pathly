"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "./app-state";
import { Logo } from "./logo";
import { LinkButton } from "./ui";

const NAV = [
  { href: "/programs", label: "Programmes" },
  { href: "/how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { role, signOut, ready } = useAppState();
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Main" className="flex items-center gap-5 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={pathname.startsWith(n.href) ? "page" : undefined}
                className={pathname.startsWith(n.href) ? "font-semibold text-ink" : "text-muted hover:text-ink"}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!ready || role === "guest" ? (
            <>
              <LinkButton href="/login" variant="ghost">
                Log in
              </LinkButton>
              <LinkButton href="/register">Get started</LinkButton>
            </>
          ) : (
            <>
              <LinkButton href={role === "admin" ? "/admin" : "/app"} variant="secondary">
                {role === "admin" ? "Admin panel" : "My workspace"}
              </LinkButton>
              <button type="button" onClick={signOut} className="px-2 text-sm text-muted hover:text-ink">
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
