import type { DegreeLevel, Profile } from "./types";

export interface ExamMeta {
  name: string;
  /** Target levels this exam is relevant for. */
  levels: DegreeLevel[];
  /** When set, the applicant can enter a score after taking the exam. */
  score?: { label: string; min: number; max: number };
}

/** Exams that appear in the requirement data. A score is stored for the applicant's own reference. */
export const EXAMS: ExamMeta[] = [
  { name: "ENT", levels: ["bachelor"], score: { label: "ENT score", min: 0, max: 140 } },
  { name: "SAT", levels: ["bachelor"], score: { label: "SAT score", min: 400, max: 1600 } },
  { name: "Mathematics entrance exam", levels: ["master"] },
  { name: "GRE", levels: ["master", "phd"], score: { label: "GRE score (Verbal + Quant)", min: 260, max: 340 } },
  { name: "Doctoral specialty exam", levels: ["phd"] },
];

/** The level the applicant is heading for: the chosen target, or the next one after the current degree. */
export function effectiveTarget(p: Pick<Profile, "targetLevel" | "currentDegree">): DegreeLevel | null {
  if (p.targetLevel) return p.targetLevel;
  if (p.currentDegree === "high_school") return "bachelor";
  if (p.currentDegree === "bachelor") return "master";
  if (p.currentDegree === "master") return "phd";
  return null;
}

/** Exams worth showing for this profile. With no level known yet, all exams are shown. */
export function examsFor(p: Pick<Profile, "targetLevel" | "currentDegree">): ExamMeta[] {
  const level = effectiveTarget(p);
  return level ? EXAMS.filter((e) => e.levels.includes(level)) : EXAMS;
}
