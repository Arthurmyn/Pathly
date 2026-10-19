"use client";

import { useSyncExternalStore } from "react";

/** Text typed into the top-bar search while on the Settings page. Not persisted. */
let query = "";
const listeners = new Set<() => void>();

export function setSettingsQuery(v: string) {
  query = v;
  listeners.forEach((l) => l());
}

export function useSettingsQuery(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => query,
    () => "",
  );
}
