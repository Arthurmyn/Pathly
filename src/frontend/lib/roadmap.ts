import { addDays } from "./dates";
import { effectiveStatus } from "./status";
import type { EligibilityResult, Program, Requirement, RoadmapTask, TaskType } from "./types";

/**
 * Roadmap generation (FR-09): every gap becomes a task with a reason, ordered by date offsets from the
 * verified deadline D and by dependencies. A task is never dated after the deadline. When the deadline is
 * not Verified, no dates are invented: the first task is to verify the deadline and other tasks have no date.
 * A task whose planned date is already in the past is dated today (as soon as possible); it never moves past D.
 */
export function generateRoadmap(
  program: Program,
  requirements: Requirement[],
  results: EligibilityResult[],
  today: string,
): RoadmapTask[] {
  const deadlineStatus = effectiveStatus(program.deadline, today);
  const verifiedDate = deadlineStatus === "verified" ? program.deadline.date : null;
  // A deadline that has already passed cannot date any task; the applicant must check the next intake.
  const passed = verifiedDate !== null && verifiedDate < today;
  const deadline = passed ? null : verifiedDate;
  const tasks: RoadmapTask[] = [];

  const add = (
    id: string,
    title: string,
    reason: string,
    type: TaskType,
    gap: string | null,
    offsetDays: number,
    dependsOn: string[] = [],
  ) => {
    const planned = deadline ? addDays(deadline, -offsetDays) : null;
    const asap = planned !== null && planned < today;
    tasks.push({
      id,
      title,
      reason,
      type,
      gapRequirementId: gap,
      offsetDays,
      dueDate: asap ? today : planned,
      asap,
      dependsOn,
    });
  };

  if (passed) {
    add(
      "deadline-passed",
      "Check the next intake on the official website",
      `The verified deadline (${program.deadline.date}) has passed, so no task can be dated before it.`,
      "verify",
      null,
      365,
    );
  } else if (!deadline) {
    const why =
      deadlineStatus === "conflict"
        ? program.deadline.conflictNote ?? "Two sources disagree about the deadline."
        : `The deadline record is ${deadlineStatus}, so it cannot be used as a fact.`;
    add("verify-deadline", "Verify the application deadline", why, "verify", null, 365);
  }

  for (const r of results) {
    if (r.outcome === "met") continue;
    const req = requirements.find((x) => x.id === r.requirementId);
    if (!req) continue;
    const gap = r.requirementId;
    const label = r.label;

    if (r.outcome === "unknown") {
      if (r.status === "verified") {
        add(`profile-${gap}`, `Add to your profile: ${label}`, r.explanation, "action", gap, 120);
      } else {
        add(`verify-${gap}`, `Verify or confirm: ${label}`, r.explanation, "verify", gap, 60);
      }
      continue;
    }

    const test = String(req.test ?? "").toUpperCase();
    switch (req.kind) {
      case "language_min": {
        if (r.outcome === "not_met") {
          add(`${gap}-register`, `Register for ${test}`, r.explanation, "action", gap, 150);
          add(`${gap}-take`, `Take ${test} (target ${req.value}+)`, r.explanation, "action", gap, 120, [`${gap}-register`]);
        } else {
          add(`${gap}-take`, `Take ${test} (target ${req.value}+)`, r.explanation, "action", gap, 120);
        }
        add(`${gap}-send`, `Send the official ${test} score report`, `Needed for: ${label}`, "action", gap, 60, [`${gap}-take`]);
        break;
      }
      case "exam_required": {
        if (r.outcome === "not_met") {
          add(`${gap}-register`, `Register for the ${req.value}`, r.explanation, "action", gap, 160);
          add(`${gap}-take`, `Take the ${req.value}`, r.explanation, "action", gap, 110, [`${gap}-register`]);
        } else {
          add(`${gap}-take`, `Take the ${req.value}`, r.explanation, "action", gap, 110);
        }
        break;
      }
      case "gpa_min":
        add(`${gap}-ask`, "Ask admissions whether other evidence can offset the GPA", r.explanation, "action", gap, 90);
        break;
      case "degree_required":
        add(`${gap}-check`, "Check whether your degree is accepted", r.explanation, "action", gap, 90);
        break;
      case "work_experience_min":
        add(`${gap}-gain`, "Gain and document the required experience", r.explanation, "action", gap, 90);
        break;
      case "documents_ready":
        add(`${gap}-prepare`, "Prepare and check the application documents", r.explanation, "action", gap, 30);
        break;
    }
  }

  add(
    "submit",
    "Submit the application on the official website",
    "Pathly does not submit applications. Submit on the university's official channel.",
    "submit",
    null,
    3,
    tasks.map((t) => t.id),
  );

  // Earlier tasks first: larger offset means earlier. Dependencies always have a larger offset.
  return tasks.sort((a, b) => b.offsetDays - a.offsetDays);
}
