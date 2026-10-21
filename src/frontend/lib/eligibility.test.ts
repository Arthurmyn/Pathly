import { describe, expect, it } from "vitest";
import { DEMO_TODAY } from "./dates";
import { evaluateProgram, evaluateRequirement, summarize } from "./eligibility";
import { getRequirement, requirements, sampleProfile } from "./mock-data";
import { effectiveStatus } from "./status";
import type { Profile } from "./types";

const emptyProfile: Profile = {
  currentDegree: null,
  programme: null,
  field: null,
  targetField: null,
  targetLevel: null,
  targetCountries: [],
  gpa: null,
  language: { test: null, score: null, sections: { listening: null, reading: null, writing: null, speaking: null }, planned: false },
  exams: [],
  workYears: null,
  workField: null,
  workRole: null,
  funding: null,
  intake: null,
  budgetUsd: null,
  documentsReady: null,
};

const strongProfile: Profile = {
  currentDegree: "bachelor",
  programme: "Computer Science",
  field: "Computer Science",
  targetField: "Computer Science",
  targetLevel: "master",
  targetCountries: ["United States"],
  gpa: 4.0,
  language: { test: "toefl", score: 120, sections: { listening: null, reading: null, writing: null, speaking: null }, planned: false },
  exams: [{ name: "GRE", state: "passed" }],
  workYears: 10,
  workField: "same",
  workRole: null,
  funding: "self",
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
    const tl = { ...emptyProfile, language: { test: "toefl" as const, score: null, sections: emptyProfile.language.sections, planned: true } };
    expect(evaluateRequirement(tl, req("ms-cs-language"), DEMO_TODAY).outcome).toBe("pending");
  });

  it("does not convert between language tests automatically", () => {
    const ielts = { ...emptyProfile, language: { test: "ielts" as const, score: 8, sections: emptyProfile.language.sections, planned: false } };
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

describe("IELTS sections and work experience", () => {
  const workReq = {
    ...req("ms-cs-experience"),
    value: 2,
    status: "verified" as const,
    verifiedAt: "2026-09-12",
    validUntil: "2099-01-01",
    source: req("ms-cs-docs").source,
  };
  const ielts = (sections: Partial<Profile["language"]["sections"]>, score = 6.5): Profile => ({
    ...emptyProfile,
    language: { test: "ielts", score, sections: { listening: 6, reading: 6, writing: 6, speaking: 6, ...sections }, planned: false },
  });

  it("is Not met when one section is below the section minimum", () => {
    const r = req("bsc-cs-language");
    expect(evaluateRequirement(ielts({ writing: 4.5 }, 6), { ...r, validUntil: "2099-01-01" }, DEMO_TODAY).outcome).toBe("not_met");
  });

  it("is Unknown when sections are required but missing", () => {
    const r = { ...req("bsc-cs-language"), validUntil: "2099-01-01" };
    const p = ielts({ listening: null });
    expect(evaluateRequirement(p, r, DEMO_TODAY).outcome).toBe("unknown");
  });

  it("is Met when the overall score and every section pass", () => {
    const r = { ...req("bsc-cs-language"), validUntil: "2099-01-01" };
    expect(evaluateRequirement(ielts({}, 6), r, DEMO_TODAY).outcome).toBe("met");
  });

  it("does not count work in an unrelated field", () => {
    const r = workReq;
    const other = { ...strongProfile, workYears: 10, workField: "other" as const };
    expect(evaluateRequirement(other, r, DEMO_TODAY).outcome).not.toBe("met");
    const same = { ...strongProfile, workYears: 10, workField: "same" as const };
    expect(evaluateRequirement(same, r, DEMO_TODAY).outcome).toBe("met");
  });

  it("asks for the field of work before deciding", () => {
    const r = workReq;
    expect(evaluateRequirement({ ...strongProfile, workField: null }, r, DEMO_TODAY).outcome).toBe("unknown");
  });
});
