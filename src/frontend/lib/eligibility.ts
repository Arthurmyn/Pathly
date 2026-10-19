import { formatDate } from "./dates";
import { effectiveStatus } from "./status";
import type { EligibilityResult, Outcome, Profile, Requirement } from "./types";

const DEGREE_NAME: { [key: string]: string } = {
  high_school: "High school",
  bachelor: "Bachelor's degree",
  master: "Master's degree",
};

/** Human-readable requirement, for example "GPA at least 3.0 / 4.0". */
export function describeRequired(req: Requirement): string {
  if (req.value == null) return "not stored yet";
  return requiredText(req);
}

function requiredText(req: Requirement): string {
  switch (req.kind) {
    case "gpa_min":
      return `GPA at least ${req.value} / 4.0`;
    case "language_min":
      return `${String(req.test ?? "").toUpperCase()} at least ${req.value}${req.sectionMin != null ? `, no section below ${req.sectionMin}` : ""}`;
    case "degree_required":
      return `${(req.value as string[]).map((d) => DEGREE_NAME[d] ?? d).join(" or ")}`;
    case "exam_required":
      return String(req.value);
    case "work_experience_min":
      return `At least ${req.value} year(s) of work experience`;
    case "documents_ready":
      return "All required documents prepared";
  }
}

function ruleText(req: Requirement): string {
  switch (req.kind) {
    case "gpa_min":
      return `Your GPA must be ≥ ${req.value}.`;
    case "language_min":
      return `Your ${String(req.test).toUpperCase()} score must be ≥ ${req.value}${req.sectionMin != null ? ` and each section ≥ ${req.sectionMin}` : ""}.`;
    case "degree_required":
      return "Your current degree must be one of the accepted degrees.";
    case "exam_required":
      return `You must have taken the ${req.value}.`;
    case "work_experience_min":
      return `You need ≥ ${req.value} year(s) of work experience.`;
    case "documents_ready":
      return "Your documents must be ready.";
  }
}

/** What the profile says about this requirement, as text. */
function applicantText(req: Requirement, profile: Profile): string {
  switch (req.kind) {
    case "gpa_min":
      return profile.gpa == null ? "not in your profile" : `${profile.gpa} / 4.0`;
    case "language_min": {
      const l = profile.language;
      if (l.score != null && l.test) return `${l.test.toUpperCase()} ${l.score}`;
      if (l.planned && l.test) return `${l.test.toUpperCase()} planned`;
      return "no score in your profile";
    }
    case "degree_required":
      return profile.currentDegree ? DEGREE_NAME[profile.currentDegree] : "not in your profile";
    case "exam_required": {
      const e = profile.exams.find((x) => x.name === req.value);
      return e ? (e.state === "passed" ? "taken" : "planned") : "not taken";
    }
    case "work_experience_min":
      return profile.workYears == null ? "not in your profile" : `${profile.workYears} year(s)${profile.workField === "other" ? ", not in a related field" : ""}`;
    case "documents_ready":
      return profile.documentsReady == null ? "not in your profile" : profile.documentsReady ? "ready" : "not ready";
  }
}

function compare(req: Requirement, profile: Profile): { outcome: Outcome; why: string } {
  switch (req.kind) {
    case "gpa_min": {
      if (profile.gpa == null) return { outcome: "unknown", why: "Your GPA is not in your profile yet." };
      return profile.gpa >= (req.value as number)
        ? { outcome: "met", why: `Your GPA ${profile.gpa} is at least ${req.value}.` }
        : { outcome: "not_met", why: `Your GPA ${profile.gpa} is below the required ${req.value}.` };
    }
    case "language_min": {
      const l = profile.language;
      if (l.test && l.test !== req.test && l.score != null) {
        return {
          outcome: "unknown",
          why: `Your profile has ${l.test.toUpperCase()}, but this programme states ${String(req.test).toUpperCase()}. Equivalence is not decided automatically.`,
        };
      }
      if (l.test === req.test && l.score != null) {
        if (l.score < (req.value as number)) {
          return { outcome: "not_met", why: `Your score ${l.score} is below the required ${req.value}.` };
        }
        if (req.sectionMin != null) {
          const parts = Object.values(l.sections);
          if (parts.some((x) => x == null)) {
            return { outcome: "unknown", why: `This programme also requires at least ${req.sectionMin} in every section. Enter all four section scores.` };
          }
          const low = Object.entries(l.sections).filter(([, v]) => (v as number) < req.sectionMin!);
          if (low.length > 0) {
            return { outcome: "not_met", why: `Your overall score is enough, but ${low.map(([k, v]) => `${k} (${v})`).join(", ")} is below the section minimum ${req.sectionMin}.` };
          }
          return { outcome: "met", why: `Your score ${l.score} and every section are at least ${req.sectionMin}.` };
        }
        return { outcome: "met", why: `Your score ${l.score} is at least ${req.value}.` };
      }
      if (l.planned && (l.test === req.test || !l.test)) {
        return { outcome: "pending", why: "You plan to take the test; the score is not available yet." };
      }
      return { outcome: "not_met", why: "No language test score in your profile." };
    }
    case "degree_required": {
      if (!profile.currentDegree) return { outcome: "unknown", why: "Your current degree is not in your profile yet." };
      return (req.value as string[]).includes(profile.currentDegree)
        ? { outcome: "met", why: "Your current degree is accepted." }
        : { outcome: "not_met", why: "Your current degree is not among the accepted degrees." };
    }
    case "exam_required": {
      const e = profile.exams.find((x) => x.name === req.value);
      if (!e) return { outcome: "not_met", why: `You have not taken the ${req.value}.` };
      return e.state === "passed"
        ? { outcome: "met", why: `You have taken the ${req.value}.` }
        : { outcome: "pending", why: `The ${req.value} is planned but not taken yet.` };
    }
    case "work_experience_min": {
      if (profile.workYears == null) return { outcome: "unknown", why: "Your work experience is not in your profile yet." };
      if (profile.workField == null) {
        return { outcome: "unknown", why: "Say whether your work is in the same or a related field, because the programme may count only relevant experience." };
      }
      const counted = profile.workField === "other" ? 0 : profile.workYears;
      const note = profile.workField === "other" ? " Work outside a related field is not counted." : "";
      return counted >= (req.value as number)
        ? { outcome: "met", why: `You have ${counted} relevant year(s), the minimum is ${req.value}.` }
        : { outcome: "not_met", why: `You have ${counted} relevant year(s), the minimum is ${req.value}.${note}` };
    }
    case "documents_ready": {
      if (profile.documentsReady == null) return { outcome: "unknown", why: "Document readiness is not in your profile yet." };
      return profile.documentsReady
        ? { outcome: "met", why: "You marked your documents as ready." }
        : { outcome: "not_met", why: "Your documents are not ready yet." };
    }
  }
}

/**
 * Deterministic, explainable matching (FR-08, NFR-04).
 * A requirement whose record is not Verified on the given date can only be Unknown.
 */
export function evaluateRequirement(profile: Profile, req: Requirement, today: string): EligibilityResult {
  const status = effectiveStatus(req, today);
  const base = {
    requirementId: req.id,
    label: req.label,
    pathway: req.pathway,
    status,
    requiredText: status === "missing" || req.value == null ? "not stored yet" : requiredText(req),
    applicantText: applicantText(req, profile),
    rule: status === "missing" || req.value == null ? "No rule is stored for this item." : ruleText(req),
    source: req.source,
    verifiedAt: req.verifiedAt,
  };

  if (status !== "verified") {
    const why: { [key: string]: string } = {
      stale: `The source expired on ${formatDate(req.validUntil)}. We cannot confirm this requirement until it is re-verified.`,
      missing: "No value is stored for this requirement yet, so we cannot decide.",
      conflict: req.conflictNote ?? "Two sources disagree, so we cannot decide until an administrator resolves it.",
      unverified: "This value has not been verified against an official source, so it is not used as a fact.",
    };
    return { ...base, outcome: "unknown", explanation: why[status] };
  }

  const { outcome, why } = compare(req, profile);
  return { ...base, outcome, explanation: why };
}

export function evaluateProgram(profile: Profile, requirements: Requirement[], today: string): EligibilityResult[] {
  return requirements.map((r) => evaluateRequirement(profile, r, today));
}

export interface Summary {
  met: number;
  not_met: number;
  pending: number;
  unknown: number;
  total: number;
  /** Honest one-line summary: never claims eligibility while anything is unknown. */
  sentence: string;
}

export function summarize(results: EligibilityResult[]): Summary {
  const count = (o: Outcome) => results.filter((r) => r.outcome === o).length;
  const s = { met: count("met"), not_met: count("not_met"), pending: count("pending"), unknown: count("unknown"), total: results.length };
  let sentence: string;
  if (s.total === 0) sentence = "There are no requirements to check yet.";
  else if (s.unknown > 0)
    sentence = `${s.unknown} requirement${s.unknown > 1 ? "s" : ""} cannot be confirmed yet, so we cannot say you are eligible.`;
  else if (s.not_met > 0) sentence = `${s.not_met} requirement${s.not_met > 1 ? "s are" : " is"} not met yet.`;
  else if (s.pending > 0) sentence = `${s.pending} step${s.pending > 1 ? "s are" : " is"} still pending; everything else is met.`;
  else sentence = "All verified requirements are met. Submit your application on the official website.";
  return { ...s, sentence };
}
