import { examsFor } from "./exams";
import type { Profile } from "./types";

export type FieldGroup = "Education" | "Target" | "Test scores and budget" | "Work and documents";

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
  const school = p.currentDegree === "high_school";
  const fields: ProfileField[] = [
    { key: "degree", label: "Current degree", group: "Education", value: p.currentDegree ? DEGREE[p.currentDegree] : null },
    ...(school ? [] : [{ key: "programme", label: "Educational programme", group: "Education" as const, value: p.programme }]),
    { key: "gpa", label: school ? "School GPA" : "GPA", group: "Education", value: p.gpa != null ? `${p.gpa} / 4.0` : null },
    ...(school ? [] : [{ key: "speciality", label: "Speciality", group: "Education" as const, value: p.field }]),
    { key: "target", label: "Target degree", group: "Target", value: p.targetLevel ? LEVEL[p.targetLevel] : null },
    { key: "targetField", label: "Field of study", group: "Target", value: p.targetField },
    { key: "intake", label: "Intake", group: "Target", value: p.intake },
    { key: "country", label: "Target countries", group: "Target", value: p.targetCountries.length ? p.targetCountries.join(", ") : null },
    {
      key: "language",
      label: "Language test",
      group: "Test scores and budget",
      value: languageText(lang),
    },
    ...(needsExam ? [{ key: "exams", label: "Entrance exams", group: "Test scores and budget" as const, value: exams.length ? exams.join(", ") : null }] : []),
    { key: "budget", label: "Budget per year", group: "Test scores and budget", value: p.budgetUsd != null ? `$${p.budgetUsd.toLocaleString("en-US")}` : null },
    { key: "funding", label: "Funding", group: "Test scores and budget", value: p.funding ? FUNDING[p.funding] : null },
    ...(school ? [] : [{
      key: "work",
      label: "Work experience",
      group: "Work and documents" as const,
      value: p.workYears != null ? `${p.workYears} year(s)${p.workField ? `, ${FIELD_WORK[p.workField]}` : ""}` : null,
    }]),
    { key: "documents", label: "Documents ready", group: "Work and documents", value: p.documentsReady == null ? null : p.documentsReady ? "Ready" : "Not ready" },
  ];
  return fields;
}

function languageText(l: Profile["language"]): string | null {
  const parts = (["ielts", "toefl"] as const).flatMap((t) => (l[t].score != null ? [`${t.toUpperCase()} ${l[t].score}`] : l[t].planned ? [`${t.toUpperCase()} planned`] : []));
  return parts.length ? parts.join(", ") : null;
}

export function completeness(p: Profile): { filled: number; total: number; percent: number } {
  const f = profileFields(p);
  const filled = f.filter((x) => x.value != null).length;
  return { filled, total: f.length, percent: Math.round((filled / f.length) * 100) };
}
