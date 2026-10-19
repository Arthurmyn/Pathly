import type { DegreeLevel, Program } from "./types";

export interface Settings {
  account: { name: string; email: string; googleConnected: boolean };
  notifications: {
    deadlines: boolean;
    /** Days before a verified deadline. */
    deadlineDays: number[];
    email: boolean;
    inApp: boolean;
    requirementUpdates: boolean;
    roadmapReminders: boolean;
    productUpdates: boolean;
    marketing: boolean;
  };
  /** Search preferences. They are separate from the Profile (facts about you) and only affect which programmes are highlighted. */
  study: {
    countries: string[];
    levels: DegreeLevel[];
    fields: string[];
    teachingLanguage: string | null;
    budgetMin: number | null;
    budgetMax: number | null;
    currency: "USD" | "KZT" | "EUR";
  };
  ai: {
    language: "en" | "ru" | "kk";
    style: "short" | "detailed";
    citations: boolean;
    personalised: boolean;
    alternatives: boolean;
  };
}

export const DEFAULT_SETTINGS: Settings = {
  account: { name: "", email: "", googleConnected: false },
  notifications: {
    deadlines: true,
    deadlineDays: [30, 14, 7, 1],
    email: true,
    inApp: true,
    requirementUpdates: true,
    roadmapReminders: true,
    productUpdates: false,
    marketing: false,
  },
  study: { countries: [], levels: [], fields: [], teachingLanguage: null, budgetMin: null, budgetMax: null, currency: "USD" },
  ai: { language: "en", style: "short", citations: true, personalised: true, alternatives: true },
};

/** Fill settings saved by an older version with the defaults. */
export function normalizeSettings(saved: Partial<Settings> | undefined): Settings {
  return {
    account: { ...DEFAULT_SETTINGS.account, ...saved?.account },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...saved?.notifications },
    study: { ...DEFAULT_SETTINGS.study, ...saved?.study },
    ai: { ...DEFAULT_SETTINGS.ai, ...saved?.ai },
  };
}

/** True when a programme fits every study preference that is set. No preferences means no match claim. The budget is not used because programmes carry no tuition data yet. */
export function matchesPreferences(s: Settings["study"], targetCountries: string[], p: Program, country: string): boolean {
  const any = targetCountries.length || s.levels.length || s.fields.length || s.teachingLanguage;
  if (!any) return false;
  if (targetCountries.length && !targetCountries.includes(country)) return false;
  if (s.levels.length && !s.levels.includes(p.level)) return false;
  if (s.fields.length && !s.fields.includes(p.field)) return false;
  if (s.teachingLanguage && p.language !== s.teachingLanguage) return false;
  return true;
}
