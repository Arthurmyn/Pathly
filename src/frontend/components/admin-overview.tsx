"use client";

import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { getProgram } from "@/lib/mock-data";
import { effectiveStatus } from "@/lib/status";
import { buildQueue, QUEUE_ORDER } from "./admin-data";
import { useAppState } from "./app-state";
import { StatusBadge } from "./badges";
import { DemoControls } from "./demo-controls";
import { Callout, Card, EmptyState, PageHeader } from "./ui";
import { programs } from "@/lib/mock-data";

export function AdminOverview() {
  const state = useAppState();
  const { today, audit, requests } = state;
  const all = state.allRequirements();
  const queue = buildQueue(all, today);
  const verified = all.length - queue.length;
  const deadlineIssues = programs.filter((p) => effectiveStatus(p.deadline, today) !== "verified");

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle="Keep admission data verified. Conflicts come first because they block matching." />

      <section aria-label="Queues" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {QUEUE_ORDER.map((s) => (
          <Link key={s} href="/admin/queue" className="rounded-[20px] border border-line bg-surface shadow-[var(--shadow)] p-4 hover:border-primary">
            <StatusBadge status={s} />
            <p className="mt-3 text-3xl font-semibold tabular-nums">{queue.filter((q) => q.status === s).length}</p>
            <p className="text-sm text-muted">record{queue.filter((q) => q.status === s).length === 1 ? "" : "s"}</p>
          </Link>
        ))}
      </section>

      <Card>
        <h2 className="font-semibold">Data health</h2>
        <p className="mt-1 text-sm text-muted">{verified} of {all.length} requirements are Verified on {formatDate(today)}.</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`${verified} of ${all.length} verified`}>
          <div className="h-full" style={{ width: `${(verified / all.length) * 100}%`, background: "var(--text)" }} />
        </div>
      </Card>

      {deadlineIssues.length > 0 ? (
        <Callout tone="warn" title="Deadline records that are not Verified">
          <ul className="mt-1 list-disc pl-5">
            {deadlineIssues.map((p) => (
              <li key={p.slug}>{p.name}: {effectiveStatus(p.deadline, today)}. {p.deadline.conflictNote ?? ""}</li>
            ))}
          </ul>
        </Callout>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Verification requests from applicants</h2>
          {requests.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No requests yet. Applicants can request verification from a requirement.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {requests.map((id) => {
                const r = all.find((x) => x.id === id);
                if (!r) return null;
                return (
                  <li key={id} className="flex items-center justify-between gap-2">
                    <span>{r.label} <span className="text-muted">· {getProgram(r.programSlug)?.name}</span></span>
                    <Link href={`/admin/requirements/${id}`} className="text-primary hover:underline">Open</Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="font-semibold">Recent changes</h2>
          {audit.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No changes yet. Verify or edit a record to see it here.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {audit.slice(0, 5).map((a) => (
                <li key={a.id}>{all.find((r) => r.id === a.requirementId)?.label}: {a.from} → <strong>{a.to}</strong> <span className="text-muted">({formatDate(a.at)})</span></li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <DemoControls />

      {queue.length === 0 ? <EmptyState title="Everything is verified">Nothing needs attention on this date.</EmptyState> : null}
    </div>
  );
}
