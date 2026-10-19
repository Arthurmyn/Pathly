import { universities } from "./mock-data";

/** Countries the applicant can choose from, sorted by name. */
export function allCountries(): string[] {
  return Array.from(new Set(universities.map((u) => u.country))).sort((a, b) => a.localeCompare(b));
}
