"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DEMO_TODAY, addDays } from "@/lib/dates";
import { getRequirements, requirements as allRequirements, sampleProfile } from "@/lib/mock-data";
import { DEFAULT_SETTINGS, normalizeSettings, type Settings } from "@/lib/settings";
import type { DataStatus, Profile, Requirement, Source } from "@/lib/types";

export type Role = "guest" | "applicant" | "admin";

export interface AuditEntry {
  id: number;
  at: string;
  requirementId: string;
  from: DataStatus;
  to: DataStatus;
  by: string;
  note: string;
}

export const EMPTY_PROFILE: Profile = {
  currentDegree: null,
  field: null,
  targetLevel: null,
  targetCountries: [],
  gpa: null,
  language: { test: null, score: null, sections: { listening: null, reading: null, writing: null, speaking: null }, planned: false },
  exams: [],
  workYears: null,
  workField: null,
  workRole: null,
  funding: null,
  intake: null,
  budgetUsd: null,
  documentsReady: null,
};

interface DemoState {
  role: Role;
  today: string;
  profile: Profile;
  shortlist: string[];
  done: { [programSlug: string]: string[] };
  overrides: { [requirementId: string]: Partial<Requirement> };
  audit: AuditEntry[];
  /** Requirement ids for which an applicant asked an administrator to re-verify. */
  requests: string[];
  settings: Settings;
  /** Ids of notifications the applicant has read. */
  seen: string[];
  /** Sidebar is collapsed to icons. */
  collapsed: boolean;
  /** Programmes the applicant reports as enrolled in. */
  enrolled: string[];
  registeredAt: string | null;
}

const INITIAL: DemoState = {
  role: "guest",
  today: DEMO_TODAY,
  profile: EMPTY_PROFILE,
  shortlist: [],
  done: {},
  overrides: {},
  audit: [],
  requests: [],
  settings: DEFAULT_SETTINGS,
  seen: [],
  collapsed: false,
  enrolled: [],
  registeredAt: null,
};

const STORAGE_KEY = "pathly-demo-v1";

interface Api extends DemoState {
  ready: boolean;
  signIn: (role: Exclude<Role, "guest">) => void;
  signOut: () => void;
  setToday: (iso: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  loadSampleProfile: () => void;
  clearProfile: () => void;
  toggleShortlist: (slug: string) => void;
  toggleTask: (slug: string, taskId: string) => void;
  requirementsFor: (slug: string) => Requirement[];
  allRequirements: () => Requirement[];
  getRequirementById: (id: string) => Requirement | undefined;
  /** Administrator actions. They return an error message when the change is not allowed. */
  saveRequirement: (id: string, patch: { value: Requirement["value"]; source: Source | null; note: string }) => string | null;
  setRequirementStatus: (id: string, next: DataStatus, note: string) => string | null;
  requestVerification: (id: string) => void;
  resetDemo: () => void;
  markSeen: (ids: string[]) => void;
  setCollapsed: (v: boolean) => void;
  toggleEnrolled: (slug: string) => void;
  updateSettings: <K extends keyof Settings>(section: K, patch: Partial<Settings[K]>) => void;
}

// A small external store backed by localStorage. useSyncExternalStore keeps server and first client render
// identical (INITIAL) and switches to the saved state after hydration, without setState inside an effect.
let current: DemoState = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function loadOnce() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<DemoState>;
      // Older saved states miss newer profile fields; fill them from the empty profile.
      const old = saved.profile as (Partial<Profile> & { targetCountry?: string | null }) | undefined;
      const migrated = old && !old.targetCountries && old.targetCountry ? { targetCountries: [old.targetCountry] } : {};
      const profile = { ...EMPTY_PROFILE, ...saved.profile, ...migrated, language: { ...EMPTY_PROFILE.language, ...saved.profile?.language, sections: { ...EMPTY_PROFILE.language.sections, ...saved.profile?.language?.sections } } };
      current = { ...INITIAL, ...saved, profile, settings: normalizeSettings(saved.settings) };
    }
  } catch {
    /* storage can be blocked or corrupt; the demo still works without it */
  }
}

function update(fn: (s: DemoState) => DemoState) {
  loadOnce();
  current = fn(current);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => {
  loadOnce();
  return current;
};
const getServerSnapshot = () => INITIAL;
const noopSubscribe = () => () => {};

function writeStatus(s: DemoState, id: string, next: DataStatus, patch: Partial<Requirement>, note: string): DemoState {
  const current = { ...allRequirements.find((r) => r.id === id)!, ...s.overrides[id] };
  const entry: AuditEntry = {
    id: s.audit.length + 1,
    at: s.today,
    requirementId: id,
    from: current.status,
    to: next,
    by: "Administrator",
    note,
  };
  return {
    ...s,
    overrides: { ...s.overrides, [id]: { ...s.overrides[id], ...patch, status: next } },
    audit: [entry, ...s.audit],
  };
}

const merge = (overrides: DemoState["overrides"]) => (r: Requirement): Requirement => ({ ...r, ...overrides[r.id] });

/** Kept as a component so the layout does not change; the state lives in the external store above. */
export function AppStateProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function buildApi(state: DemoState, ready: boolean): Api {
  const merged = merge(state.overrides);
  return {
    ...state,
    ready,
    signIn: (role) => update((s) => ({ ...s, role, registeredAt: s.registeredAt ?? s.today })),
    signOut: () => update((s) => ({ ...s, role: "guest" })),
    setToday: (iso) => update((s) => ({ ...s, today: iso })),
    updateProfile: (patch) => update((s) => ({ ...s, profile: { ...s.profile, ...patch } })),
    loadSampleProfile: () => update((s) => ({ ...s, profile: { ...sampleProfile } })),
    clearProfile: () => update((s) => ({ ...s, profile: EMPTY_PROFILE, done: {} })),
    toggleShortlist: (slug) =>
      update((s) => ({
        ...s,
        shortlist: s.shortlist.includes(slug) ? s.shortlist.filter((x) => x !== slug) : [...s.shortlist, slug],
      })),
    toggleTask: (slug, taskId) =>
      update((s) => {
        const list = s.done[slug] ?? [];
        return { ...s, done: { ...s.done, [slug]: list.includes(taskId) ? list.filter((x) => x !== taskId) : [...list, taskId] } };
      }),
    requirementsFor: (slug) => getRequirements(slug).map(merged),
    allRequirements: () => allRequirements.map(merged),
    getRequirementById: (id) => {
      const r = allRequirements.find((x) => x.id === id);
      return r ? merged(r) : undefined;
    },
    saveRequirement: (id, patch) => {
      if (patch.source && !/^https?:\/\//.test(patch.source.url)) return "The source URL must start with http:// or https://.";
      update((s) => writeStatus(s, id, "unverified", { value: patch.value, source: patch.source, verifiedAt: null, validUntil: null }, patch.note || "Value or source edited"));
      return null;
    },
    setRequirementStatus: (id, next, note) => {
      const r = allRequirements.find((x) => x.id === id);
      if (!r) return "Unknown requirement.";
      const cur = merged(r);
      if (next === "verified") {
        if (!cur.source) return "Add a source before verifying.";
        if (cur.source.tier !== 1) return "Only a Tier 1 source (official page or document) can produce Verified.";
        if (cur.value == null) return "Enter a value before verifying.";
        update((s) =>
          writeStatus(s, id, "verified", { verifiedAt: s.today, validUntil: addDays(s.today, 180), conflictNote: undefined }, note || "Verified against the official source"),
        );
        return null;
      }
      update((s) => writeStatus(s, id, next, next === "stale" ? { validUntil: addDays(s.today, -1) } : {}, note || `Marked ${next}`));
      return null;
    },
    requestVerification: (id) => update((s) => (s.requests.includes(id) ? s : { ...s, requests: [...s.requests, id] })),
    resetDemo: () => update(() => INITIAL),
    setCollapsed: (v) => update((s) => ({ ...s, collapsed: v })),
    toggleEnrolled: (slug) => update((s) => ({ ...s, enrolled: s.enrolled.includes(slug) ? s.enrolled.filter((x) => x !== slug) : [...s.enrolled, slug] })),
    markSeen: (ids) => update((s) => ({ ...s, seen: Array.from(new Set([...s.seen, ...ids])) })),
    updateSettings: (section, patch) => update((s) => ({ ...s, settings: { ...s.settings, [section]: { ...s.settings[section], ...patch } } })),
  };
}

export function useAppState(): Api {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // ready is false on the server and during hydration, true afterwards
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return useMemo(() => buildApi(state, ready), [state, ready]);
}
