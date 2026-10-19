"use client";

import { daysBetween, formatDate } from "@/lib/dates";
import type { RoadmapTask } from "@/lib/types";
import { IconClock, IconLock, IconShieldCheck } from "./icons";
import { Tag } from "./ui";

const TYPE_LABEL = { action: "Action", verify: "Verify data", submit: "Submit on the official site" } as const;

export function TaskCard({
  task,
  done,
  blockedBy,
  gapLabel,
  today,
  onToggle,
}: {
  task: RoadmapTask;
  done: boolean;
  /** Titles of unfinished tasks this task depends on. */
  blockedBy: string[];
  gapLabel: string | null;
  today: string;
  onToggle: () => void;
}) {
  const blocked = blockedBy.length > 0 && !done;
  const overdue = !done && task.dueDate !== null && task.dueDate < today;
  const id = `task-${task.id}`;
  return (
    <li className={`rounded-xl border bg-surface p-4 ${done ? "opacity-70" : ""} ${task.type === "verify" ? "border-dashed" : ""}`} style={{ borderColor: "var(--border)" }} data-task={task.id}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={done}
          disabled={blocked}
          onChange={onToggle}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]"
          aria-describedby={`${id}-meta`}
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className={`font-medium ${done ? "line-through" : ""}`}>{task.title}</label>
          <p id={`${id}-meta`} className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <IconClock size={14} />
              {task.dueDate ? (task.asap ? `${formatDate(task.dueDate)} · as soon as possible (planned D−${task.offsetDays})` : `${formatDate(task.dueDate)} · D−${task.offsetDays}`) : "Date pending: deadline not verified"}
            </span>
            {overdue ? <span style={{ color: "var(--st-conflict-fg)" }} className="font-medium">Overdue by {daysBetween(task.dueDate!, today)} day(s)</span> : null}
            <Tag>{task.type === "verify" ? <><IconShieldCheck size={12} />&nbsp;{TYPE_LABEL[task.type]}</> : TYPE_LABEL[task.type]}</Tag>
          </p>
          <p className="mt-2 text-sm"><span className="text-muted">Why: </span>{task.reason}</p>
          {gapLabel ? <p className="mt-1 text-xs text-muted">Gap: {gapLabel}</p> : null}
          {blocked ? (
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
              <IconLock size={12} /> After: {blockedBy.join(", ")}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}
