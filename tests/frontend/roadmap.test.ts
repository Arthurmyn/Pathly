import { describe, expect, it } from "vitest";
import { DEMO_TODAY } from "@/lib/dates";
import { evaluateProgram } from "@/lib/eligibility";
import { getProgram, getRequirements, programs, sampleProfile } from "@/lib/mock-data";
import { generateRoadmap } from "@/lib/roadmap";
import type { Profile } from "@/lib/types";

const profile = sampleProfile as Profile;

function build(slug: string, today = DEMO_TODAY, p: Profile = profile) {
  const program = getProgram(slug)!;
  const reqs = getRequirements(slug);
  const results = evaluateProgram(p, reqs, today);
  return { program, results, tasks: generateRoadmap(program, reqs, results, today) };
}

describe("generateRoadmap", () => {
  it("creates a task for every gap (every non-Met requirement)", () => {
    for (const program of programs) {
      const { results, tasks } = build(program.slug);
      for (const r of results.filter((x) => x.outcome !== "met")) {
        expect(tasks.some((t) => t.gapRequirementId === r.requirementId), `${program.slug}: ${r.requirementId}`).toBe(true);
      }
    }
  });

  it("never dates a task after the verified deadline", () => {
    for (const program of programs) {
      const { program: p, tasks } = build(program.slug);
      for (const t of tasks) {
        if (t.dueDate && p.deadline.date) expect(t.dueDate <= p.deadline.date).toBe(true);
      }
    }
  });

  it("puts every task after the tasks it depends on", () => {
    for (const program of programs) {
      const { tasks } = build(program.slug);
      const index = new Map(tasks.map((t, i) => [t.id, i]));
      for (const t of tasks) {
        for (const dep of t.dependsOn) {
          expect(index.has(dep), `${t.id} depends on missing ${dep}`).toBe(true);
          expect(index.get(dep)!).toBeLessThan(index.get(t.id)!);
          const depTask = tasks[index.get(dep)!];
          if (depTask.dueDate && t.dueDate) expect(depTask.dueDate <= t.dueDate).toBe(true);
        }
      }
    }
  });

  it("gives every task a reason and ends with the submission on the official channel", () => {
    const { tasks } = build("northfield-ms-computer-science");
    expect(tasks.every((t) => t.reason.length > 0)).toBe(true);
    expect(tasks[tasks.length - 1].type).toBe("submit");
  });

  it("turns Unknown requirements into 'verify' tasks instead of guessing", () => {
    const { tasks } = build("steppe-msc-data-science", DEMO_TODAY, { ...profile, targetLevel: "master" });
    expect(tasks.some((t) => t.type === "verify" && t.gapRequirementId === "msc-ds-language")).toBe(true);
    expect(tasks.some((t) => t.type === "verify" && t.gapRequirementId === "msc-ds-experience")).toBe(true);
  });

  it("does not invent dates when the deadline is not Verified (conflict)", () => {
    const { tasks } = build("lakeside-phd-education");
    expect(tasks[0].id).toBe("verify-deadline");
    expect(tasks.every((t) => t.dueDate === null)).toBe(true);
  });

  it("never dates a task in the past: late tasks are dated today and flagged as soon as possible", () => {
    const { tasks } = build("northfield-ms-computer-science");
    expect(tasks.every((t) => t.dueDate !== null && t.dueDate >= DEMO_TODAY)).toBe(true);
    expect(tasks.some((t) => t.asap)).toBe(true);
    const submit = tasks.find((t) => t.type === "submit")!;
    expect(submit.dueDate).toBe("2026-12-12");
  });

  it("does not date tasks when the deadline has already passed", () => {
    const { tasks } = build("northfield-ms-computer-science", "2027-01-10");
    expect(tasks[0].id).toBe("deadline-passed");
    expect(tasks.every((t) => t.dueDate === null)).toBe(true);
  });

  it("recomputes when the profile changes", () => {
    const before = build("northfield-ms-computer-science").tasks.map((t) => t.id);
    const improved: Profile = { ...profile, documentsReady: true, exams: [{ name: "GRE", state: "passed" }] };
    const after = build("northfield-ms-computer-science", DEMO_TODAY, improved).tasks.map((t) => t.id);
    expect(after.length).toBeLessThan(before.length);
    expect(after).not.toContain("ms-cs-exam-take");
  });
});
