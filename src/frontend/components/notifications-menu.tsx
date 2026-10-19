"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Notice } from "@/lib/notifications";
import { useAppState } from "./app-state";
import { IconBell } from "./icons";

const KIND: { [k in Notice["kind"]]: string } = {
  profile: "Profile",
  requirement: "Requirements",
  roadmap: "Roadmap",
  deadline: "Deadline",
  verification: "Verification",
};

/** Bell with a dropdown panel of in-app notifications. */
export function NotificationsMenu({ notices }: { notices: Notice[] }) {
  const { seen, markSeen } = useAppState();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const unread = notices.filter((n) => !seen.includes(n.id));

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
        className="press relative rounded-full p-2 hover:bg-surface-2"
      >
        <IconBell size={19} />
        {unread.length ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-sheet" aria-hidden="true" /> : null}
      </button>
      {open ? (
        <div role="dialog" aria-label="Notifications" className="pop absolute right-0 top-full z-40 mt-2 w-[min(24rem,calc(100vw-2rem))] origin-top-right rounded-[20px] border border-line bg-surface shadow-[var(--shadow-lift)]">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <h2 className="font-semibold">Notifications</h2>
            <button type="button" disabled={unread.length === 0} onClick={() => markSeen(notices.map((n) => n.id))} className="text-sm font-medium text-primary hover:underline disabled:text-muted-2 disabled:no-underline">
              Mark all as read
            </button>
          </div>
          {notices.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">You are all caught up.</p>
          ) : (
            <ul className="max-h-[24rem] divide-y divide-line overflow-y-auto">
              {notices.map((n) => {
                const isNew = !seen.includes(n.id);
                return (
                  <li key={n.id}>
                    <Link href={n.href} onClick={() => { markSeen([n.id]); setOpen(false); }} className="flex gap-3 px-4 py-3 hover:bg-surface-2">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isNew ? "bg-primary" : "bg-transparent"}`} aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{KIND[n.kind]}{isNew ? " · new" : ""}</span>
                        <span className="mt-0.5 block text-sm font-medium">{n.title}</span>
                        <span className="block text-sm text-muted">{n.text}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-line px-4 py-2.5 text-sm">
            <Link href="/app/settings#notifications" onClick={() => setOpen(false)} className="font-medium text-primary hover:underline">Notification settings</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
