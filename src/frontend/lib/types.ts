/** Shared domain types. They mirror the data model of the proposal (sections 6.3 and 7.5). */

export type DegreeLevel = "bachelor" | "master" | "phd";

/** Status of a stored record (section 6.3). Only a Tier 1 source can make a record Verified. */
export type DataStatus = "verified" | "unverified" | "stale" | "missing" | "conflict";

/** Result of comparing the applicant with a requirement (FR-08). */
export type Outcome = "met" | "not_met" | "pending" | "unknown";

export type SourceTier = 1 | 2 | 3;

export interface Source {
  url: string;
  title: string;
  tier: SourceTier;
}

export type RequirementKind =
  | "degree_required"
  | "gpa_min"
  | "language_min"
  | "exam_required"
  | "work_experience_min"
  | "documents_ready";

export interface Requirement {
  id: string;
  programSlug: string;
  kind: RequirementKind;
  label: string;
  /** Required value: number for thresholds, list of allowed values for degrees, exam name for exams. */
  value: number | string | string[] | null;
  /** Language test (ielts, toefl) or exam name where it matters. */
  test?: string;
  /** IELTS only: the minimum for each of the four sections, when the programme states one. */
  sectionMin?: number;
  unit?: string;
  pathway: string;
  source: Source | null;
  status: DataStatus;
  verifiedAt: string | null;
  validUntil: string | null;
  /** Shown when two sources disagree. */
  conflictNote?: string;
}

export interface Deadline {
  date: string | null;
  source: Source | null;
  status: DataStatus;
  verifiedAt: string | null;
  validUntil: string | null;
  conflictNote?: string;
  label: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
}

export interface Program {
  slug: string;
  name: string;
  universityId: string;
  level: DegreeLevel;
  field: string;
  language: string;
  /** How the programme is taught. */
  format: "On campus" | "Online" | "Hybrid";
  officialUrl: string;
  summary: string;
  deadline: Deadline;
}

export type ExamState = "passed" | "planned";

export interface IeltsSections {
  listening: number | null;
  reading: number | null;
  writing: number | null;
  speaking: number | null;
}

/** How close the work is to the target programme: decides whether the years can count. */
export type WorkField = "same" | "related" | "other";

export interface Profile {
  currentDegree: "high_school" | "bachelor" | "master" | null;
  /** The educational programme the applicant studied (or studies). */
  programme: string | null;
  /** Speciality of the education the applicant has. */
  field: string | null;
  /** Field of study the applicant wants next. */
  targetField: string | null;
  targetLevel: DegreeLevel | null;
  /** Countries the applicant is willing to study in. Empty means any. */
  targetCountries: string[];
  /** GPA on a 4.0 scale. */
  gpa: number | null;
  language: { test: "ielts" | "toefl" | null; score: number | null; sections: IeltsSections; planned: boolean };
  exams: { name: string; state: ExamState; score?: number | null }[];
  /** Total years of work. Only years in a "same" or "related" field count towards a requirement. */
  workYears: number | null;
  workField: WorkField | null;
  workRole: string | null;
  funding: "self" | "scholarship" | "unsure" | null;
  intake: string | null;
  budgetUsd: number | null;
  documentsReady: boolean | null;
}

export interface EligibilityResult {
  requirementId: string;
  label: string;
  pathway: string;
  outcome: Outcome;
  /** Effective status of the record at the evaluation date. */
  status: DataStatus;
  requiredText: string;
  applicantText: string;
  rule: string;
  explanation: string;
  source: Source | null;
  verifiedAt: string | null;
}

export type TaskType = "action" | "verify" | "submit";

export interface RoadmapTask {
  id: string;
  title: string;
  reason: string;
  type: TaskType;
  /** Requirement that caused the task (the gap). */
  gapRequirementId: string | null;
  /** Days before the deadline D; the task is dated D minus this offset. */
  offsetDays: number;
  /** null when the deadline is not Verified: no date is invented. */
  dueDate: string | null;
  /** True when D minus the offset is already in the past, so the task is dated today (as soon as possible). */
  asap: boolean;
  dependsOn: string[];
}
