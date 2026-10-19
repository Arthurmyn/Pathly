import { daysBetween, formatDate } from "./dates";
import { evaluateProgram } from "./eligibility";
import { completeness } from "./profile-fields";
import { getProgram } from "./mock-data";
import { generateRoadmap } from "./roadmap";
import type { Settings } from "./settings";
import { effectiveStatus } from "./status";
import type { Profile, Requirement } from "./types";

export interface Notice {
  id: string;
  kind: "profile" | "requirement" | "roadmap" | "deadline" | "verification";
  title: string;
  text: string;
  href: string;
}

interface Input {
  profile: Profile;
  shortlist: string[];
  today: string;
  done: { [slug: string]: string[] };
  requests: string[];
  settings: Settings;
  requirementsFor: (slug: string) => Requirement[];
}

/** In-app notifications, derived from the current state. Each one respects the matching setting. */
export function buildNotices(i: Input): Notice[] {
  const n = i.settings.notifications;
  const out: Notice[] = [];
  const { percent } = completeness(i.profile);

  if (percent < 100) {
    out.push({ id: "profile", kind: "profile", title: "Complete your profile", text: `Your profile is ${percent}% complete. Until it is filled, requirements show as Unknown.`, href: "/app/profile" });
  }

  for (const slug of i.shortlist) {
    const program = getProgram(slug);
    if (!program) continue;
    const reqs = i.requirementsFor(slug);

    if (n.requirementUpdates) {
      const bad = reqs.filter((r) => ["stale", "conflict", "missing"].includes(effectiveStatus(r, i.today))).length;
      if (bad > 0) {
        out.push({ id: `req-${slug}-${bad}`, kind: "requirement", title: program.name, text: `${bad} requirement${bad > 1 ? "s are" : " is"} outdated, missing or conflicting.`, href: `/programs/${slug}` });
      }
    }

    if (n.deadlines && n.inApp && effectiveStatus(program.deadline, i.today) === "verified" && program.deadline.date) {
      const left = daysBetween(i.today, program.deadline.date);
      const window = [...n.deadlineDays].sort((a, b) => a - b).find((d) => left >= 0 && left <= d);
      if (window !== undefined) {
        out.push({ id: `deadline-${slug}-${window}`, kind: "deadline", title: `${program.name}: deadline in ${left} day${left === 1 ? "" : "s"}`, text: `Verified deadline ${formatDate(program.deadline.date)}.`, href: `/app/applications/${slug}` });
      }
    }

    if (n.roadmapReminders) {
      const results = evaluateProgram(i.profile, reqs, i.today);
      const done = i.done[slug] ?? [];
      const soon = generateRoadmap(program, reqs, results, i.today).filter(
        (t) => !done.includes(t.id) && t.dueDate && daysBetween(i.today, t.dueDate) >= 0 && daysBetween(i.today, t.dueDate) <= 14,
      );
      for (const t of soon.slice(0, 2)) {
        out.push({ id: `task-${slug}-${t.id}`, kind: "roadmap", title: t.title, text: `${program.name} · due ${formatDate(t.dueDate)}`, href: `/app/applications/${slug}` });
      }
    }
  }

  for (const id of i.requests) {
    out.push({ id: `verify-${id}`, kind: "verification", title: "Verification requested", text: "An administrator will check this requirement against the official source.", href: "/app" });
  }
  return out;
}
