"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { getInstitution } from "@/lib/institutions";
import { getProgram, getRequirement } from "@/lib/mock-data";
import { effectiveStatus } from "@/lib/status";
import { buildNotices, type Notice } from "@/lib/notifications";
import { buildQueue } from "./admin-data";
import { useAppState, type Role } from "./app-state";
import {
  IconBell,
  IconBook,
  IconChat,
  IconChecklist,
  IconClock,
  IconCap,
  IconCompass,
  IconDatabase,
  IconHome,
  IconInfo,
  IconLayers,
  IconLogout,
  IconMenu,
  IconRoute,
  IconSearch,
  IconSettings,
  IconSidebar,
  IconUser,
  IconX,
} from "./icons";
import { Logo } from "./logo";
import { NotificationsMenu } from "./notifications-menu";
import { setSettingsQuery, useSettingsQuery } from "@/lib/search-store";
import { RequireRole } from "./require-role";

export type Area = "public" | "app" | "admin";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  exact?: boolean;
  badge?: number;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

function navFor(area: Area, role: Role, queueCount: number): NavGroup[] {
  if (area === "admin") {
    return [
      {
        label: "Data",
        items: [
          { href: "/admin", label: "Overview", icon: IconHome, exact: true },
          { href: "/admin/queue", label: "Verification queue", icon: IconDatabase, badge: queueCount },
          { href: "/admin/audit-log", label: "Audit log", icon: IconClock },
          { href: "/admin/users", label: "Users", icon: IconUser },
        ],
      },
      { label: "Site", items: [{ href: "/", label: "Public site", icon: IconCompass, exact: true }] },
    ];
  }
  if (area === "app" || role === "applicant") {
    return [
      {
        label: "Plan",
        items: [
          { href: "/app", label: "Dashboard", icon: IconHome, exact: true },
          { href: "/app/roadmap", label: "Roadmap", icon: IconChecklist },
          { href: "/app/applications", label: "Applications", icon: IconRoute },
          { href: "/programs", label: "Programmes", icon: IconLayers },
          { href: "/institutions", label: "Institutions", icon: IconCap },
        ],
      },
      {
        label: "Assistant",
        items: [
          { href: "/app/advisor", label: "Advisor", icon: IconChat },
          { href: "/app/onboarding", label: "AI onboarding", icon: IconInfo },
        ],
      },
      {
        label: "Account",
        items: [
          { href: "/app/profile", label: "Profile", icon: IconUser },
          { href: "/app/settings", label: "Settings", icon: IconSettings },
        ],
      },
    ];
  }
  const groups: NavGroup[] = [
    {
      label: "Explore",
      items: [
        { href: "/", label: "Home", icon: IconHome, exact: true },
        { href: "/programs", label: "Programmes", icon: IconLayers },
        { href: "/institutions", label: "Institutions", icon: IconCap },
        { href: "/how-it-works", label: "How it works", icon: IconBook },
      ],
    },
  ];
  if (role === "admin") groups.push({ label: "Admin", items: [{ href: "/admin", label: "Admin panel", icon: IconDatabase, exact: true }] });
  else
    groups.push({
      label: "Account",
      items: [
        { href: "/login", label: "Log in", icon: IconUser },
        { href: "/register", label: "Get started", icon: IconRoute },
      ],
    });
  return groups;
}

interface Crumb {
  label: string;
  href?: string;
}

const STATIC_CRUMBS: { [path: string]: Crumb[] } = {
  "/": [{ label: "Home" }],
  "/programs": [{ label: "Home", href: "/" }, { label: "Programmes" }],
  "/institutions": [{ label: "Home", href: "/" }, { label: "Institutions" }],
  "/how-it-works": [{ label: "Home", href: "/" }, { label: "How it works" }],
  "/login": [{ label: "Home", href: "/" }, { label: "Log in" }],
  "/register": [{ label: "Home", href: "/" }, { label: "Get started" }],
  "/privacy": [{ label: "Home", href: "/" }, { label: "Privacy" }],
  "/app": [{ label: "Workspace", href: "/app" }, { label: "Dashboard" }],
  "/app/profile": [{ label: "Workspace", href: "/app" }, { label: "Profile" }],
  "/app/settings": [{ label: "Workspace", href: "/app" }, { label: "Settings" }],
  "/app/onboarding": [{ label: "Workspace", href: "/app" }, { label: "AI onboarding" }],
  "/app/advisor": [{ label: "Workspace", href: "/app" }, { label: "Advisor" }],
  "/app/roadmap": [{ label: "Workspace", href: "/app" }, { label: "Roadmap" }],
  "/app/applications": [{ label: "Workspace", href: "/app" }, { label: "Applications" }],
  "/admin": [{ label: "Admin", href: "/admin" }, { label: "Overview" }],
  "/admin/queue": [{ label: "Admin", href: "/admin" }, { label: "Verification queue" }],
  "/admin/audit-log": [{ label: "Admin", href: "/admin" }, { label: "Audit log" }],
  "/admin/users": [{ label: "Admin", href: "/admin" }, { label: "Users" }],
};

export function crumbsFor(pathname: string): Crumb[] {
  const path = pathname.replace(/\/$/, "") || "/";
  if (STATIC_CRUMBS[path]) return STATIC_CRUMBS[path];
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "programs" && parts[1]) {
    return [{ label: "Home", href: "/" }, { label: "Programmes", href: "/programs" }, { label: getProgram(parts[1])?.name ?? parts[1] }];
  }
  if (parts[0] === "institutions" && parts[1]) {
    return [{ label: "Home", href: "/" }, { label: "Institutions", href: "/institutions" }, { label: getInstitution(parts[1])?.name ?? parts[1] }];
  }
  if (parts[0] === "app" && parts[1] === "applications" && parts[2]) {
    return [{ label: "Workspace", href: "/app" }, { label: "Applications", href: "/app/applications" }, { label: getProgram(parts[2])?.name ?? parts[2] }];
  }
  if (parts[0] === "admin" && parts[1] === "requirements" && parts[2]) {
    return [{ label: "Admin", href: "/admin" }, { label: "Verification queue", href: "/admin/queue" }, { label: getRequirement(parts[2])?.label ?? parts[2] }];
  }
  return [{ label: "Home", href: "/" }, { label: parts[parts.length - 1] ?? "" }];
}

function SidebarNav({ groups, onNavigate, collapsed = false }: { groups: NavGroup[]; onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={collapsed ? "space-y-4" : "space-y-7"}>
      {groups.map((g) => (
        <div key={g.label}>
          {collapsed ? <div className="mx-2 mb-2 h-px bg-line" aria-hidden="true" /> : <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{g.label}</p>}
          <ul className="space-y-0.5">
            {g.items.map((n) => {
              const active = n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(n.href + "/");
              const Icon = n.icon;
              return (
                <li key={n.href} className="relative">
                  {active ? <span className={`absolute ${collapsed ? "-left-3" : "-left-5"} top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--nav-line)]`} aria-hidden="true" /> : null}
                  <Link
                    href={n.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? n.label : undefined}
                    aria-label={collapsed ? n.label : undefined}
                    className={`relative flex items-center gap-3 rounded-xl px-2 py-2 text-[15px] transition-colors duration-150 ${collapsed ? "justify-center" : ""} ${active ? "font-semibold text-[var(--nav-active)]" : "text-ink hover:bg-surface-2"}`}
                  >
                    <Icon size={19} />
                    {collapsed ? null : <span className="flex-1">{n.label}</span>}
                    {n.badge ? (
                      collapsed ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" /> : <span className="rounded-full bg-primary px-2 text-[11px] font-semibold leading-5 text-primary-fg">{n.badge}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter({ role, onSignOut, collapsed = false }: { role: Role; onSignOut: () => void; collapsed?: boolean }) {
  if (role === "guest") return <div className="mt-auto" />;
  return (
    <div className="mt-auto pt-8 text-sm">
      <button
        type="button"
        onClick={onSignOut}
        title={collapsed ? "Sign out" : undefined}
        aria-label={collapsed ? "Sign out" : undefined}
        className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-ink transition-colors duration-150 hover:bg-surface-2 ${collapsed ? "justify-center" : ""}`}
      >
        <IconLogout size={19} /> {collapsed ? null : "Sign out"}
      </button>
    </div>
  );
}

function Topbar({ role, onMenu, attention, notices }: { role: Role; onMenu: () => void; attention: number; notices: Notice[] }) {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname);
  const onSettings = pathname.startsWith("/app/settings");
  const q = useSettingsQuery();

  const bellHref = role === "admin" ? "/admin/queue" : "/app";
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 pb-3 pt-5 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onMenu} className="press rounded-full border border-line bg-surface p-2 md:hidden" aria-label="Open menu">
          <IconMenu size={18} />
        </button>
        <nav aria-label="Breadcrumb" className="min-w-0 text-[13px] text-muted">
          <ol className="flex flex-wrap items-center gap-x-2">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {c.href && i < crumbs.length - 1 ? (
                  <Link href={c.href} className="hover:text-ink">{c.label}</Link>
                ) : (
                  <span aria-current={i === crumbs.length - 1 ? "page" : undefined} className={i === crumbs.length - 1 ? "font-semibold text-ink" : ""}>{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {onSettings ? (
          <div role="search" className="flex w-48 items-center gap-2 rounded-full bg-surface-2 px-4 py-2 sm:w-64">
            <IconSearch size={16} />
            <input value={q} onChange={(e) => setSettingsQuery(e.target.value)} aria-label="Search settings" placeholder="Search settings…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" />
          </div>
        ) : null}
        {role === "guest" ? (
          <>
            <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-surface-2 sm:inline-flex">Log in</Link>
            <Link href="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-fg hover:bg-primary-hover">Get started</Link>
          </>
        ) : (
          <>
            {role === "admin" ? (
              <Link href={bellHref} className="relative rounded-full p-2 hover:bg-surface-2" aria-label={attention > 0 ? `${attention} items need attention` : "Verification queue"}>
                <IconBell size={19} />
                {attention > 0 ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-sheet" aria-hidden="true" /> : null}
              </Link>
            ) : (
              <NotificationsMenu notices={notices} />
            )}
            {role === "applicant" ? (
              <Link href="/app/settings" className={`rounded-full p-2 hover:bg-surface-2 ${onSettings ? "text-[var(--nav-active)]" : ""}`} aria-label="Settings" aria-current={onSettings ? "page" : undefined}>
                <IconSettings size={19} />
              </Link>
            ) : null}
            <Link href={role === "admin" ? "/admin" : "/app/profile"} aria-label={role === "admin" ? "Administrator" : "Profile"} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg">
              {role === "admin" ? "A" : "Y"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

/** Application frame: window background, sidebar with grouped navigation, rounded main sheet with top bar. */
export function Shell({ area, children }: { area: Area; children: ReactNode }) {
  const state = useAppState();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const role = state.ready ? state.role : "guest";
  const collapsed = state.ready && state.collapsed;

  const queueCount = area === "admin" || role === "admin" ? buildQueue(state.allRequirements(), state.today).length : 0;
  const attention =
    role === "admin"
      ? queueCount
      : state.shortlist.reduce((n, slug) => n + state.requirementsFor(slug).filter((r) => ["stale", "conflict", "missing"].includes(effectiveStatus(r, state.today))).length, 0);

  const notices = useMemo(
    () => (role === "applicant" ? buildNotices({ profile: state.profile, shortlist: state.shortlist, today: state.today, done: state.done, requests: state.requests, settings: state.settings, requirementsFor: state.requirementsFor }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [role, state.profile, state.shortlist, state.today, state.done, state.requests, state.settings, state.overrides],
  );
  const groups = navFor(area, role, queueCount);
  // The drawer leaves the way it came (slides back to the left) before it is removed.
  const closeDrawer = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  };
  const inner = (
    <div className="flex min-h-screen bg-page">
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-y-auto py-6 transition-[width] duration-200 md:flex ${collapsed ? "w-[4.5rem] px-3" : "w-64 px-5"}`} aria-label="Sidebar">
        <div className={`mb-9 flex ${collapsed ? "flex-col items-center gap-4" : "items-center justify-between px-2"}`}>
          <Logo href={area === "admin" ? "/admin" : role === "applicant" ? "/app" : "/"} compact={collapsed} />
          <button
            type="button"
            onClick={() => state.setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="press rounded-full p-2 text-muted hover:bg-surface-2 hover:text-ink"
          >
            <IconSidebar size={18} />
          </button>
        </div>
        <SidebarNav groups={groups} collapsed={collapsed} />
        <SidebarFooter role={role} onSignOut={state.signOut} collapsed={collapsed} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-modal="true" aria-label="Menu" data-closing={closing}>
          <button type="button" className="drawer-overlay absolute inset-0 bg-black/40" aria-label="Close menu" onClick={closeDrawer} />
          <div className="drawer-panel absolute inset-y-0 left-0 flex w-72 flex-col overflow-y-auto bg-page px-6 py-6">
            <div className="mb-8 flex items-center justify-between">
              <Logo href="/" />
              <button type="button" onClick={closeDrawer} className="press rounded-full border border-line bg-surface p-2" aria-label="Close menu"><IconX size={16} /></button>
            </div>
            <SidebarNav groups={groups} onNavigate={closeDrawer} />
            <SidebarFooter role={role} onSignOut={() => { state.signOut(); closeDrawer(); }} />
          </div>
        </div>
      ) : null}

      <div className="min-w-0 flex-1 p-0 md:p-3 md:pl-0">
        <div className="min-h-screen rounded-none bg-sheet md:min-h-[calc(100vh-1.5rem)] md:rounded-[28px] md:border md:border-line/70 md:shadow-[var(--shadow)]">
          <Topbar role={role} onMenu={() => setOpen(true)} attention={attention} notices={notices} />
          <main id="content" className="px-5 pb-8 pt-3 md:px-8">{children}</main>
          <footer className="border-t border-line px-5 py-4 text-xs text-muted md:px-8">
            Pathly is a support tool only. It does not guarantee admission; always confirm requirements and submit on the official website.
          </footer>
        </div>
      </div>
    </div>
  );

  if (area === "app") return <RequireRole role="applicant">{inner}</RequireRole>;
  if (area === "admin") return <RequireRole role="admin">{inner}</RequireRole>;
  return inner;
}
