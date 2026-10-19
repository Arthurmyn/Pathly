import { describe, expect, it } from "vitest";
import { DEMO_TODAY } from "./dates";
import { evaluateProgram, evaluateRequirement, summarize } from "./eligibility";
import { getRequirement, requirements, sampleProfile } from "./mock-data";
import { effectiveStatus } from "./status";
import type { Profile } from "./types";

const emptyProfile: Profile = {
  currentDegree: null,
  field: null,
  targetLevel: null,
  targetCountry: null,
  gpa: null,
  language: { test: null, score: null, planned: false },
  exams: [],
  workYears: null,
  intake: null,
  budgetUsd: null,
  documentsReady: null,
};

const strongProfile: Profile = {
  currentDegree: "bachelor",
  field: "Computer Science",
  targetLevel: "master",
  targetCountry: "United States",
  gpa: 4.0,
  language: { test: "toefl", score: 120, planned: false },
  exams: [{ name: "GRE", state: "passed" }],
  workYears: 10,
  intake: "Fall 2027",
  budgetUsd: 100000,
  documentsReady: true,
};

const req = (id: string) => {
  const r = getRequirement(id);
  if (!r) throw new Error("unknown requirement " + id);
  return r;
};

describe("evaluateRequirement", () => {
  it("is Met or Not met for a verified requirement (GPA)", () => {
    const r = req("ms-cs-gpa");
    expect(evaluateRequirement({ ...emptyProfile, gpa: 3.5 }, r, DEMO_TODAY).outcome).toBe("met");
    expect(evaluateRequirement({ ...emptyProfile, gpa: 3.0 }, r, DEMO_TODAY).outcome).toBe("not_met");
  });

  it("is Unknown when the profile has no value yet", () => {
    expect(evaluateRequirement(emptyProfile, req("ms-cs-gpa"), DEMO_TODAY).outcome).toBe("unknown");
  });

  it("is Pending for a planned exam or language test", () => {
    const planned = { ...emptyProfile, exams: [{ name: "GRE", state: "planned" as const }] };
    expect(evaluateRequirement(planned, req("ms-cs-exam"), DEMO_TODAY).outcome).toBe("pending");
    const tl = { ...emptyProfile, language: { test: "toefl" as const, score: null, planned: true } };
    expect(evaluateRequirement(tl, req("ms-cs-language"), DEMO_TODAY).outcome).toBe("pending");
  });

  it("does not convert between language tests automatically", () => {
    const ielts = { ...emptyProfile, language: { test: "ielts" as const, score: 8, planned: false } };
    expect(evaluateRequirement(ielts, req("ms-cs-language"), DEMO_TODAY).outcome).toBe("unknown");
  });

  it("is Unknown for a Stale record, even if the applicant clearly qualifies", () => {
    const stale = req("bsc-cs-language");
    expect(effectiveStatus(stale, DEMO_TODAY)).toBe("stale");
    const result = evaluateRequirement(strongProfile, stale, DEMO_TODAY);
    expect(result.outcome).toBe("unknown");
    expect(result.explanation).toMatch(/expired/);
  });

  it("is Unknown for Missing, Conflict and Unverified records", () => {
    for (const id of ["msc-ds-experience", "msc-ds-language", "msc-ds-exam"]) {
      expect(evaluateRequirement(strongProfile, req(id), DEMO_TODAY).outcome).toBe("unknown");
    }
  });

  it("explains every result with rule, applicant value and the source details (NFR-04)", () => {
    for (const r of requirements) {
      const res = evaluateRequirement(sampleProfile, r, DEMO_TODAY);
      expect(res.rule.length).toBeGreaterThan(0);
      expect(res.applicantText.length).toBeGreaterThan(0);
      expect(res.explanation.length).toBeGreaterThan(0);
      if (res.status === "verified") {
        expect(res.source).not.toBeNull();
        expect(res.verifiedAt).not.toBeNull();
      }
    }
  });
});

describe("a non-Verified record is never Met", () => {
  const profiles = [emptyProfile, strongProfile, sampleProfile as Profile];
  const dates = [DEMO_TODAY, "2026-12-20", "2027-04-01", "2027-09-30"];

  it("holds for every requirement, profile and date", () => {
    for (const today of dates) {
      for (const profile of profiles) {
        for (const r of requirements) {
          const res = evaluateRequirement(profile, r, today);
          if (res.status !== "verified") expect(res.outcome).toBe("unknown");
        }
      }
    }
  });

  it("moves a record to Stale when the date passes (time travel)", () => {
    const toefl = req("bs-econ-language");
    expect(evaluateRequirement(strongProfile, toefl, "2026-11-01").status).toBe("verified");
    expect(evaluateRequirement(strongProfile, toefl, "2026-12-11").status).toBe("stale");
    expect(evaluateRequirement(strongProfile, toefl, "2026-12-11").outcome).toBe("unknown");
  });
});

describe("summarize", () => {
  it("never claims eligibility while a requirement is Unknown", () => {
    const results = evaluateProgram(strongProfile, requirements.filter((r) => r.programSlug === "steppe-msc-data-science"), DEMO_TODAY);
    const s = summarize(results);
    expect(s.unknown).toBeGreaterThan(0);
    expect(s.sentence).toMatch(/cannot say you are eligible/);
  });

  it("counts every requirement exactly once", () => {
    const list = requirements.filter((r) => r.programSlug === "northfield-ms-computer-science");
    const s = summarize(evaluateProgram(sampleProfile as Profile, list, DEMO_TODAY));
    expect(s.met + s.not_met + s.pending + s.unknown).toBe(list.length);
  });
});
