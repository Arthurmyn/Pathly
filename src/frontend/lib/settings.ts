import type { DegreeLevel, Program } from "./types";

/** Only settings that do something in the MVP. Anything that would not is left out on purpose. */
export interface Settings {
  account: { name: string; email: string };
  notifications: {
    /** Remind by email before a verified deadline. The choice is stored; no email service is connected yet. */
    emailReminders: boolean;
    /** Days before a verified deadline, used for email and in-app reminders. */
    reminderDays: number[];
    /** Show notifications in the app (the bell). */
    inApp: boolean;
    requirementUpdates: boolean;
    roadmapReminders: boolean;
  };
  /** What the applicant is looking for. Target countries live in the Profile. Used to highlight matching programmes. */
  study: {
    levels: DegreeLevel[];
    fields: string[];
    teachingLanguage: string | null;
  };
}

export const REMINDER_DAY_OPTIONS = [30, 14, 7, 1];

export const DEFAULT_SETTINGS: Settings = {
  account: { name: "", email: "" },
  notifications: { emailReminders: true, reminderDays: [30, 14, 7, 1], inApp: true, requirementUpdates: true, roadmapReminders: true },
  study: { levels: [], fields: [], teachingLanguage: null },
};

/** Fill settings saved by an older version with the defaults and drop keys that no longer exist. */
export function normalizeSettings(saved: unknown): Settings {
  const s = (saved ?? {}) as { account?: Partial<Settings["account"]>; notifications?: Partial<Settings["notifications"]> & { email?: boolean; deadlineDays?: number[] }; study?: Partial<Settings["study"]> };
  const n = s.notifications ?? {};
  const d = DEFAULT_SETTINGS;
  return {
    account: { name: s.account?.name ?? d.account.name, email: s.account?.email ?? d.account.email },
    notifications: {
      emailReminders: n.emailReminders ?? n.email ?? d.notifications.emailReminders,
      reminderDays: n.reminderDays ?? n.deadlineDays ?? d.notifications.reminderDays,
      inApp: n.inApp ?? d.notifications.inApp,
      requirementUpdates: n.requirementUpdates ?? d.notifications.requirementUpdates,
      roadmapReminders: n.roadmapReminders ?? d.notifications.roadmapReminders,
    },
    study: { levels: s.study?.levels ?? [], fields: s.study?.fields ?? [], teachingLanguage: s.study?.teachingLanguage ?? null },
  };
}

/** True when a programme fits every study preference that is set. No preferences means no match claim. */
export function matchesPreferences(s: Settings["study"], targetCountries: string[], p: Program, country: string): boolean {
  const any = targetCountries.length || s.levels.length || s.fields.length || s.teachingLanguage;
  if (!any) return false;
  if (targetCountries.length && !targetCountries.includes(country)) return false;
  if (s.levels.length && !s.levels.includes(p.level)) return false;
  if (s.fields.length && !s.fields.includes(p.field)) return false;
  if (s.teachingLanguage && p.language !== s.teachingLanguage) return false;
  return true;
}
