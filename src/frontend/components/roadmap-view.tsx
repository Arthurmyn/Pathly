"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { daysBetween, formatDate } from "@/lib/dates";
import { evaluateProgram } from "@/lib/eligibility";
import { getProgram } from "@/lib/mock-data";
import { completeness } from "@/lib/profile-fields";
import { generateRoadmap } from "@/lib/roadmap";
import { effectiveStatus } from "@/lib/status";
import type { RoadmapTask } from "@/lib/types";
import { useAppState } from "./app-state";
import { IconChevron } from "./icons";
import { PillTabs } from "./pill-tabs";
import { EmptyState, LinkButton, PageHeader, Tag } from "./ui";

interface Row {
  task: RoadmapTask;
  done: boolean;
  blockedBy: string[];
}

interface Block {
  slug: string;
  name: string;
  deadline: string | null;
  rows: Row[];
}

/** Round checkbox with a tick that draws itself. The motion is switched off for reduced-motion users in CSS. */
function TaskCheck({ id, checked, disabled, label, onChange }: { id: string; checked: boolean; disabled?: boolean; label: string; onChange: () => void }) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="task-check mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-strong bg-surface disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-fg)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path className="task-tick" d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </button>
  );
}

function TaskRow({ r, slug, today, flash, onToggle }: { r: Row; slug: string; today: string; flash: boolean; onToggle: () => void }) {
  const blocked = r.blockedBy.length > 0 && !r.done;
  const overdue = !r.done && r.task.dueDate !== null && r.task.dueDate < today;
  const id = `rm-${slug}-${r.task.id}`;
  return (
    <li className={`rounded-2xl border border-line bg-surface p-4 transition-opacity duration-200 ${r.done ? "opacity-70" : ""} ${flash ? "task-flash" : ""}`}>
      <div className="flex items-start gap-3">
        <TaskCheck id={id} checked={r.done} disabled={blocked} label={r.task.title} onChange={onToggle} />
        <div className="min-w-0 flex-1">
          <p className={`font-medium ${r.done ? "line-through" : ""}`}>{r.task.title}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>{r.task.dueDate ? `${formatDate(r.task.dueDate)}${r.task.asap ? " · as soon as possible" : ""}` : "Deadline not verified"}</span>
            {overdue ? <span className="font-medium text-danger">Overdue by {daysBetween(r.task.dueDate!, today)} day(s)</span> : null}
          </p>
          {blocked ? <p className="mt-1 text-xs text-muted">Locked until: {r.blockedBy.join(", ")}</p> : null}
        </div>
        <Tag>{r.task.type === "verify" ? "Verify data" : r.task.type === "submit" ? "Submit officially" : "Action"}</Tag>
      </div>
    </li>
  );
}

/** Roadmap tasks, one block per shortlisted programme, plus general tasks that belong to no programme. */
export function RoadmapView() {
  const state = useAppState();
  const { shortlist, today, profile } = state;
  const [show, setShow] = useState<"todo" | "all">("todo");
  const [flash, setFlash] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const blocks = useMemo<Block[]>(
    () =>
      shortlist.flatMap((slug) => {
        const program = getProgram(slug);
        if (!program) return [];
        const reqs = state.requirementsFor(slug);
        const tasks = generateRoadmap(program, reqs, evaluateProgram(profile, reqs, today), today);
        const done = state.done[slug] ?? [];
        const rows = tasks
          .map((task) => ({ task, done: done.includes(task.id), blockedBy: task.dependsOn.filter((d) => !done.includes(d)).map((d) => tasks.find((t) => t.id === d)?.title ?? d) }))
          .sort((a, b) => (a.task.dueDate ?? "9999").localeCompare(b.task.dueDate ?? "9999"));
        return [{ slug, name: program.name, deadline: effectiveStatus(program.deadline, today) === "verified" ? program.deadline.date : null, rows }];
      }),
    // requirementsFor changes with administrator edits, which are part of the state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shortlist, profile, today, state.done, state.overrides],
  );

  const prof = completeness(profile);
  const profileDone = prof.percent === 100;
  const totalTasks = blocks.reduce((n, b) => n + b.rows.length, 0);
  const openTasks = blocks.reduce((n, b) => n + b.rows.filter((r) => !r.done).length, 0) + (profileDone ? 0 : 1);

  function toggle(slug: string, row: Row) {
    state.toggleTask(slug, row.task.id);
    if (!row.done) {
      window.clearTimeout(timer.current);
      setFlash(`${slug}-${row.task.id}`);
      timer.current = window.setTimeout(() => setFlash(null), 750);
    }
  }

  const showGeneral = show === "all" || !profileDone;

  return (
    <div>
      <PageHeader title="Roadmap" subtitle="Your tasks by programme. Dates are counted back from each verified deadline." actions={<LinkButton href="/app/applications" variant="secondary">Applications</LinkButton>} />
      {shortlist.length === 0 && profileDone ? (
        <EmptyState title="No roadmap yet" action={<LinkButton href="/programs">Browse programmes</LinkButton>}>Add a programme to your applications and its tasks appear here.</EmptyState>
      ) : (
        <>
          <PillTabs label="Roadmap filter" value={show} onChange={setShow} tabs={[{ id: "todo", label: "To do", count: openTasks }, { id: "all", label: "All tasks", count: totalTasks + 1 }]} />
          <div className="mt-5 space-y-5">
            {showGeneral ? (
              <section aria-labelledby="rm-general" className="rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow)]">
                <h2 id="rm-general" className="font-semibold">General</h2>
                <p className="text-sm text-muted">Tasks that do not belong to one programme.</p>
                <ul className="mt-3 space-y-2">
                  <li className="rounded-2xl border border-line p-4">
                    <div className="flex items-start gap-3">
                      <TaskCheck id="rm-profile" checked={profileDone} disabled label="Complete your profile" onChange={() => {}} />
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium ${profileDone ? "line-through" : ""}`}>Complete your profile</p>
                        <p className="mt-1 text-sm text-muted">{prof.filled} of {prof.total} fields filled. This task completes itself when the profile is full. <Link href="/app/profile" className="text-primary hover:underline">Open profile</Link></p>
                      </div>
                    </div>
                  </li>
                </ul>
              </section>
            ) : null}

            {blocks.map((b) => {
              const doneN = b.rows.filter((r) => r.done).length;
              // A task just ticked stays visible for the length of its animation before it leaves the "To do" list.
              const rows = show === "todo" ? b.rows.filter((r) => !r.done || flash === `${b.slug}-${r.task.id}`) : b.rows;
              if (show === "todo" && rows.length === 0) return null;
              const pct = b.rows.length ? (doneN / b.rows.length) * 100 : 0;
              return (
                <details key={b.slug} open className="group rounded-[20px] border border-line bg-surface shadow-[var(--shadow)]">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-muted transition-transform duration-150 group-open:rotate-90"><IconChevron size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold">{b.name}</h2>
                      <p className="text-sm text-muted">{b.deadline ? `Deadline ${formatDate(b.deadline)}` : "Deadline not verified"} · {doneN} of {b.rows.length} tasks</p>
                    </div>
                    <div className="hidden w-32 sm:block" role="progressbar" aria-label={`${b.name} progress`} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} /></div>
                    </div>
                  </summary>
                  <ul className="space-y-2 px-5 pb-5">
                    {rows.map((r) => (
                      <TaskRow key={r.task.id} r={r} slug={b.slug} today={today} flash={flash === `${b.slug}-${r.task.id}`} onToggle={() => toggle(b.slug, r)} />
                    ))}
                    {rows.length === 0 ? <li className="text-sm text-muted">Everything is done here. Submit on the official website.</li> : null}
                  </ul>
                  <div className="border-t border-line px-5 py-3 text-sm"><Link href={`/app/applications/${b.slug}`} className="font-medium text-primary hover:underline">Open application</Link></div>
                </details>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
