"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { daysBetween, formatDate } from "@/lib/dates";
import { evaluateProgram } from "@/lib/eligibility";
import { getProgram } from "@/lib/mock-data";
import { generateRoadmap } from "@/lib/roadmap";
import type { RoadmapTask } from "@/lib/types";
import { useAppState } from "./app-state";
import { PillTabs } from "./pill-tabs";
import { EmptyState, LinkButton, PageHeader, Tag } from "./ui";

interface Row {
  task: RoadmapTask;
  slug: string;
  program: string;
  done: boolean;
  blockedBy: string[];
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function groupKey(r: Row, today: string): string {
  if (!r.task.dueDate) return "Date pending";
  if (!r.done && r.task.dueDate < today) return "Overdue";
  const [y, m] = r.task.dueDate.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** All roadmap tasks of the shortlisted programmes in one timeline. */
export function RoadmapView() {
  const state = useAppState();
  const { shortlist, today, profile } = state;
  const [show, setShow] = useState<"todo" | "all">("todo");

  const rows = useMemo<Row[]>(
    () =>
      shortlist.flatMap((slug) => {
        const program = getProgram(slug);
        if (!program) return [];
        const reqs = state.requirementsFor(slug);
        const tasks = generateRoadmap(program, reqs, evaluateProgram(profile, reqs, today), today);
        const done = state.done[slug] ?? [];
        return tasks.map((task) => ({
          task,
          slug,
          program: program.name,
          done: done.includes(task.id),
          blockedBy: task.dependsOn.filter((d) => !done.includes(d)).map((d) => tasks.find((t) => t.id === d)?.title ?? d),
        }));
      }),
    // state.requirementsFor changes with admin overrides, which are part of state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shortlist, profile, today, state.done, state.overrides],
  );

  const open = rows.filter((r) => !r.done).length;
  const visible = (show === "todo" ? rows.filter((r) => !r.done) : rows).sort((a, b) => (a.task.dueDate ?? "9999").localeCompare(b.task.dueDate ?? "9999"));
  const groups = new Map<string, Row[]>();
  for (const r of visible) groups.set(groupKey(r, today), [...(groups.get(groupKey(r, today)) ?? []), r]);
  const order = ["Overdue", ...Array.from(groups.keys()).filter((k) => k !== "Overdue" && k !== "Date pending"), "Date pending"].filter((k) => groups.has(k));

  return (
    <div>
      <PageHeader title="Roadmap" subtitle="Every task of your shortlisted programmes in date order. Dates are counted back from each verified deadline." actions={<LinkButton href="/app/applications" variant="secondary">Applications</LinkButton>} />
      {shortlist.length === 0 ? (
        <EmptyState title="No roadmap yet" action={<LinkButton href="/programs">Browse programmes</LinkButton>}>Add a programme to your shortlist and its tasks appear here.</EmptyState>
      ) : (
        <>
          <PillTabs
            label="Roadmap filter"
            value={show}
            onChange={setShow}
            tabs={[{ id: "todo", label: "To do", count: open }, { id: "all", label: "All tasks", count: rows.length }]}
          />
          {order.length === 0 ? (
            <div className="mt-5"><EmptyState title="Everything is done">Nothing is left on your roadmap. Submit on each official website.</EmptyState></div>
          ) : (
            <div className="mt-5 space-y-6">
              {order.map((g) => (
                <section key={g} aria-label={g}>
                  <h2 className={`mb-2 text-sm font-semibold ${g === "Overdue" ? "text-danger" : ""}`}>{g}</h2>
                  <ul className="stagger space-y-2">
                    {groups.get(g)!.map((r) => {
                      const blocked = r.blockedBy.length > 0 && !r.done;
                      return (
                        <li key={`${r.slug}-${r.task.id}`} className={`rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow)] ${r.done ? "opacity-70" : ""}`}>
                          <div className="flex items-start gap-3">
                            <input
                              id={`rm-${r.slug}-${r.task.id}`}
                              type="checkbox"
                              checked={r.done}
                              disabled={blocked}
                              onChange={() => state.toggleTask(r.slug, r.task.id)}
                              className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]"
                            />
                            <div className="min-w-0 flex-1">
                              <label htmlFor={`rm-${r.slug}-${r.task.id}`} className={`font-medium ${r.done ? "line-through" : ""}`}>{r.task.title}</label>
                              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                                <span>{r.task.dueDate ? `${formatDate(r.task.dueDate)}${r.task.asap ? " · as soon as possible" : ""}` : "Deadline not verified"}</span>
                                {!r.done && r.task.dueDate && r.task.dueDate < today ? <span className="font-medium text-danger">Overdue by {daysBetween(r.task.dueDate, today)} day(s)</span> : null}
                                <Link href={`/app/applications/${r.slug}`} className="text-primary hover:underline">{r.program}</Link>
                              </p>
                              {blocked ? <p className="mt-1 text-xs text-muted">Locked until: {r.blockedBy.join(", ")}</p> : null}
                            </div>
                            <Tag>{r.task.type === "verify" ? "Verify data" : r.task.type === "submit" ? "Submit officially" : "Action"}</Tag>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
