import bolashak from "./data/bolashak-institutions.json";
import { programs, universities } from "./mock-data";
import type { Program } from "./types";

export interface Institution {
  id: string;
  name: string;
  nameRu: string | null;
  country: string;
  city: string | null;
  websiteUrl: string | null;
  /** "demo": invented university with demo programmes. "bolashak": from the Bolashak 2024-2026 list. */
  origin: "demo" | "bolashak";
  /** Row number in the Bolashak list. */
  listNo: number | null;
}

interface BolashakRow {
  id: string;
  no: number;
  name: string;
  nameRu: string;
  country: string;
  websiteUrl: string | null;
}

const demo: Institution[] = universities.map((u) => ({ id: u.id, name: u.name, nameRu: null, country: u.country, city: u.city, websiteUrl: null, origin: "demo", listNo: null }));
const listed: Institution[] = (bolashak as BolashakRow[]).map((b) => ({ id: b.id, name: b.name, nameRu: b.nameRu, country: b.country, city: null, websiteUrl: b.websiteUrl, origin: "bolashak", listNo: b.no }));

export const institutions: Institution[] = [...demo, ...listed];

export const getInstitution = (id: string) => institutions.find((i) => i.id === id);

/** Programmes of this institution that Pathly has data for. */
export const programsOf = (id: string): Program[] => programs.filter((p) => p.universityId === id);

export function institutionCountries(): string[] {
  return Array.from(new Set(institutions.map((i) => i.country))).sort((a, b) => a.localeCompare(b));
}

export const hostOf = (url: string | null) => (url ? url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] : null);
