import { examsFor } from "./exams";
import type { Profile } from "./types";

export type FieldGroup = "Education" | "Study goals" | "Test scores and budget" | "Work and documents";

export interface ProfileField {
  key: string;
  label: string;
  group: FieldGroup;
  /** Short text for the saved value, or null when nothing is saved. */
  value: string | null;
}

const DEGREE: { [k: string]: string } = { high_school: "High school", bachelor: "Bachelor's degree", master: "Master's degree" };
const LEVEL: { [k: string]: string } = { bachelor: "Bachelor's", master: "Master's", phd: "Doctoral / PhD" };
const FIELD_WORK: { [k: string]: string } = { same: "same field", related: "related field", other: "other field" };
const FUNDING: { [k: string]: string } = { self: "Self-funded", scholarship: "Scholarship", unsure: "Not sure" };

/** Single list of profile fields: drives completeness, the onboarding panel and the checklist. */
export function profileFields(p: Profile): ProfileField[] {
  const lang = p.language;
  const exams = p.exams.map((e) => `${e.name} ${e.state === "passed" ? (e.score != null ? e.score : "taken") : "planned"}`);
  const needsExam = examsFor(p).length > 0;
  const fields: ProfileField[] = [
    { key: "degree", label: "Current degree", group: "Education", value: p.currentDegree ? DEGREE[p.currentDegree] : null },
    { key: "field", label: "Field of study", group: "Education", value: p.field },
    { key: "gpa", label: "GPA", group: "Education", value: p.gpa != null ? `${p.gpa} / 4.0` : null },
    { key: "target", label: "Target degree", group: "Study goals", value: p.targetLevel ? LEVEL[p.targetLevel] : null },
    { key: "country", label: "Target countries", group: "Study goals", value: p.targetCountries.length ? p.targetCountries.join(", ") : null },
    { key: "intake", label: "Intake", group: "Study goals", value: p.intake },
    {
      key: "language",
      label: "Language test",
      group: "Test scores and budget",
      value: lang.test && lang.score != null ? `${lang.test.toUpperCase()} ${lang.score}` : lang.test && lang.planned ? `${lang.test.toUpperCase()} planned` : null,
    },
    ...(needsExam ? [{ key: "exams", label: "Entrance exams", group: "Test scores and budget" as const, value: exams.length ? exams.join(", ") : null }] : []),
    { key: "budget", label: "Budget per year", group: "Test scores and budget", value: p.budgetUsd != null ? `$${p.budgetUsd.toLocaleString("en-US")}` : null },
    { key: "funding", label: "Funding", group: "Test scores and budget", value: p.funding ? FUNDING[p.funding] : null },
    {
      key: "work",
      label: "Work experience",
      group: "Work and documents",
      value: p.workYears != null ? `${p.workYears} year(s)${p.workField ? `, ${FIELD_WORK[p.workField]}` : ""}` : null,
    },
    { key: "documents", label: "Documents ready", group: "Work and documents", value: p.documentsReady == null ? null : p.documentsReady ? "Ready" : "Not ready" },
  ];
  return fields;
}

export function completeness(p: Profile): { filled: number; total: number; percent: number } {
  const f = profileFields(p);
  const filled = f.filter((x) => x.value != null).length;
  return { filled, total: f.length, percent: Math.round((filled / f.length) * 100) };
}
