/**
 * ILLUSTRATIVE DATA. Universities, programmes, requirements and sources below are invented for the
 * demo and do not describe any real institution. The `.example` domains are reserved and do not resolve.
 * Real pilot data must be verified against official sources before it is shown as fact (proposal 1.6).
 */
import type { Deadline, Program, Requirement, Source, University } from "./types";

const src = (host: string, path: string, title: string, tier: 1 | 2 | 3 = 1): Source => ({
  url: `https://${host}.example/${path}`,
  title,
  tier,
});

export const universities: University[] = [
  { id: "steppe-tech", name: "Steppe Technical University", country: "Kazakhstan", city: "Astana" },
  { id: "northfield", name: "Northfield Institute", country: "United States", city: "Boston" },
  { id: "lakeside", name: "Lakeside University", country: "United States", city: "Chicago" },
];

const verifiedDeadline = (date: string, host: string, label: string): Deadline => ({
  date,
  source: src(host, "deadlines", "Official admission calendar"),
  status: "verified",
  verifiedAt: "2026-09-14",
  validUntil: "2027-08-31",
  label,
});

export const programs: Program[] = [
  {
    slug: "steppe-bsc-computer-science",
    name: "BSc Computer Science",
    universityId: "steppe-tech",
    level: "bachelor",
    field: "Computer Science",
    language: "English",
    format: "On campus",
    officialUrl: "https://admissions.steppe-tech.example/bsc-cs",
    summary: "Four-year undergraduate programme in software engineering and computing fundamentals.",
    deadline: verifiedDeadline("2027-06-20", "admissions.steppe-tech", "Application deadline, autumn 2027 intake"),
  },
  {
    slug: "steppe-msc-data-science",
    name: "MSc Data Science",
    universityId: "steppe-tech",
    level: "master",
    field: "Data Science",
    language: "English",
    format: "On campus",
    officialUrl: "https://admissions.steppe-tech.example/msc-ds",
    summary: "Two-year research-oriented Master's programme in data analysis and machine learning.",
    deadline: verifiedDeadline("2027-05-15", "admissions.steppe-tech", "Application deadline, autumn 2027 intake"),
  },
  {
    slug: "steppe-phd-artificial-intelligence",
    name: "PhD Artificial Intelligence",
    universityId: "steppe-tech",
    level: "phd",
    field: "Artificial Intelligence",
    language: "English",
    format: "On campus",
    officialUrl: "https://admissions.steppe-tech.example/phd-ai",
    summary: "Three-year doctoral programme with a supervised research project and a dissertation.",
    deadline: verifiedDeadline("2027-03-01", "admissions.steppe-tech", "Application deadline, 2027 intake"),
  },
  {
    slug: "northfield-bs-economics",
    name: "BS Economics",
    universityId: "northfield",
    level: "bachelor",
    field: "Economics",
    language: "English",
    format: "On campus",
    officialUrl: "https://admissions.northfield.example/bs-economics",
    summary: "Four-year undergraduate programme in economics, statistics and public policy.",
    deadline: verifiedDeadline("2027-01-15", "admissions.northfield", "Regular decision deadline"),
  },
  {
    slug: "northfield-ms-computer-science",
    name: "MS Computer Science",
    universityId: "northfield",
    level: "master",
    field: "Computer Science",
    language: "English",
    format: "Hybrid",
    officialUrl: "https://admissions.northfield.example/ms-cs",
    summary: "Coursework and project-based Master's programme with a systems and AI focus.",
    deadline: verifiedDeadline("2026-12-15", "admissions.northfield", "Priority deadline, fall 2027 intake"),
  },
  {
    slug: "lakeside-phd-education",
    name: "PhD Education Research",
    universityId: "lakeside",
    level: "phd",
    field: "Education",
    language: "English",
    format: "On campus",
    officialUrl: "https://admissions.lakeside.example/phd-education",
    summary: "Doctoral programme in learning sciences and education policy research.",
    deadline: {
      date: "2026-12-01",
      source: src("admissions.lakeside", "phd-education/deadlines", "Department page"),
      status: "conflict",
      verifiedAt: "2026-09-20",
      validUntil: "2027-08-31",
      conflictNote:
        "Two sources disagree: 1 Dec 2026 (department page) and 15 Dec 2026 (graduate school page). Verify before relying on a date.",
      label: "Application deadline, fall 2027 intake",
    },
  },
];

/** A verified requirement, valid for 180 days from its verification date (proposal 6.3). */
function verified(
  id: string,
  programSlug: string,
  kind: Requirement["kind"],
  label: string,
  value: Requirement["value"],
  host: string,
  extra: Partial<Requirement> = {},
  verifiedAt = "2026-09-12",
  validUntil = "2027-03-11",
): Requirement {
  return {
    id,
    programSlug,
    kind,
    label,
    value,
    pathway: "Standard entry",
    source: src(host, `${programSlug}/requirements`, "Official programme requirements"),
    status: "verified",
    verifiedAt,
    validUntil,
    ...extra,
  };
}

const ST = "admissions.steppe-tech";
const NF = "admissions.northfield";
const LK = "admissions.lakeside";

export const requirements: Requirement[] = [
  // BSc Computer Science (Kazakhstan)
  verified("bsc-cs-degree", "steppe-bsc-computer-science", "degree_required", "Secondary education certificate", ["high_school"], ST),
  verified("bsc-cs-gpa", "steppe-bsc-computer-science", "gpa_min", "Minimum school GPA", 3.0, ST),
  verified("bsc-cs-exam", "steppe-bsc-computer-science", "exam_required", "National entrance test (ENT)", "ENT", ST),
  verified("bsc-cs-language", "steppe-bsc-computer-science", "language_min", "English proficiency (IELTS)", 5.5, ST, { test: "ielts", sectionMin: 5.0 }, "2026-03-02", "2026-08-29"),
  verified("bsc-cs-docs", "steppe-bsc-computer-science", "documents_ready", "Application documents", "ready", ST),

  // MSc Data Science (Kazakhstan)
  verified("msc-ds-degree", "steppe-msc-data-science", "degree_required", "Bachelor's degree", ["bachelor"], ST),
  verified("msc-ds-gpa", "steppe-msc-data-science", "gpa_min", "Minimum GPA", 3.0, ST),
  {
    ...verified("msc-ds-language", "steppe-msc-data-science", "language_min", "English proficiency (IELTS)", 6.0, ST, { test: "ielts" }),
    status: "conflict",
    conflictNote: "Two sources disagree: the faculty page says IELTS 6.0, the admissions guide says IELTS 6.5.",
  },
  {
    ...verified("msc-ds-exam", "steppe-msc-data-science", "exam_required", "Mathematics entrance exam", "Mathematics entrance exam", ST),
    source: src("study-forum", "threads/msc-data-science-exam", "Applicant forum thread", 3),
    status: "unverified",
    verifiedAt: null,
    validUntil: null,
  },
  {
    id: "msc-ds-experience",
    programSlug: "steppe-msc-data-science",
    kind: "work_experience_min",
    label: "Research or work experience",
    value: null,
    pathway: "Standard entry",
    source: null,
    status: "missing",
    verifiedAt: null,
    validUntil: null,
  },
  verified("msc-ds-docs", "steppe-msc-data-science", "documents_ready", "Application documents", "ready", ST),

  // PhD Artificial Intelligence (Kazakhstan)
  verified("phd-ai-degree", "steppe-phd-artificial-intelligence", "degree_required", "Master's degree", ["master"], ST),
  verified("phd-ai-gpa", "steppe-phd-artificial-intelligence", "gpa_min", "Minimum Master's GPA", 3.2, ST),
  verified("phd-ai-language", "steppe-phd-artificial-intelligence", "language_min", "English proficiency (IELTS)", 6.5, ST, { test: "ielts" }),
  verified("phd-ai-exam", "steppe-phd-artificial-intelligence", "exam_required", "Doctoral specialty exam", "Doctoral specialty exam", ST),
  verified("phd-ai-docs", "steppe-phd-artificial-intelligence", "documents_ready", "Research proposal and references", "ready", ST),

  // BS Economics (United States)
  verified("bs-econ-degree", "northfield-bs-economics", "degree_required", "High school diploma", ["high_school"], NF),
  verified("bs-econ-gpa", "northfield-bs-economics", "gpa_min", "Minimum high school GPA", 3.3, NF),
  verified("bs-econ-language", "northfield-bs-economics", "language_min", "English proficiency (TOEFL)", 90, NF, { test: "toefl" }, "2026-06-12", "2026-12-10"),
  {
    ...verified("bs-econ-exam", "northfield-bs-economics", "exam_required", "SAT score", "SAT", NF),
    source: src("college-chat", "threads/northfield-sat", "Applicant forum thread", 3),
    status: "unverified",
    verifiedAt: null,
    validUntil: null,
  },
  verified("bs-econ-docs", "northfield-bs-economics", "documents_ready", "Application documents", "ready", NF),

  // MS Computer Science (United States)
  verified("ms-cs-degree", "northfield-ms-computer-science", "degree_required", "Bachelor's degree", ["bachelor"], NF),
  verified("ms-cs-gpa", "northfield-ms-computer-science", "gpa_min", "Minimum GPA", 3.4, NF),
  verified("ms-cs-language", "northfield-ms-computer-science", "language_min", "English proficiency (TOEFL)", 100, NF, { test: "toefl" }),
  verified("ms-cs-exam", "northfield-ms-computer-science", "exam_required", "GRE General Test", "GRE", NF),
  {
    id: "ms-cs-experience",
    programSlug: "northfield-ms-computer-science",
    kind: "work_experience_min",
    label: "Professional experience",
    value: null,
    pathway: "Standard entry",
    source: null,
    status: "missing",
    verifiedAt: null,
    validUntil: null,
  },
  verified("ms-cs-docs", "northfield-ms-computer-science", "documents_ready", "Application documents", "ready", NF),

  // PhD Education Research (United States)
  verified("phd-edu-degree", "lakeside-phd-education", "degree_required", "Master's degree", ["master"], LK),
  verified("phd-edu-gpa", "lakeside-phd-education", "gpa_min", "Minimum Master's GPA", 3.5, LK, {}, "2026-02-10", "2026-08-09"),
  verified("phd-edu-language", "lakeside-phd-education", "language_min", "English proficiency (IELTS)", 7.0, LK, { test: "ielts" }),
  verified("phd-edu-exam", "lakeside-phd-education", "exam_required", "GRE General Test", "GRE", LK),
  verified("phd-edu-docs", "lakeside-phd-education", "documents_ready", "Research statement and references", "ready", LK),
];

export const getProgram = (slug: string) => programs.find((p) => p.slug === slug);
export const getUniversity = (id: string) => universities.find((u) => u.id === id);
export const getRequirements = (slug: string) => requirements.filter((r) => r.programSlug === slug);
export const getRequirement = (id: string) => requirements.find((r) => r.id === id);

export const LEVEL_LABEL = { bachelor: "Bachelor's", master: "Master's", phd: "Doctoral / PhD" } as const;

/** A fictional sample applicant used by the demo. */
export const sampleProfile = {
  currentDegree: "bachelor" as const,
  programme: "Computer Science" as string | null,
  field: "Искусственный интеллект" as string | null,
  targetField: "Искусственный интеллект" as string | null,
  targetLevel: "master" as const,
  targetCountries: ["United States"] as string[],
  gpa: 3.5,
  language: { test: "toefl" as const, score: 96, sections: { listening: null, reading: null, writing: null, speaking: null }, planned: false },
  exams: [{ name: "GRE", state: "planned" as const }],
  workYears: null,
  workField: null,
  workRole: null,
  funding: "scholarship" as const,
  intake: "Fall 2027",
  budgetUsd: 30000,
  documentsReady: false,
};
