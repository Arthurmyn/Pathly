"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/dates";
import { describeRequired } from "@/lib/eligibility";
import { STATUS_LABEL } from "@/lib/status";
import { buildQueue, QUEUE_ORDER, type QueueItem } from "./admin-data";
import { useAppState } from "./app-state";
import { StatusBadge } from "./badges";
import { PillTabs } from "./pill-tabs";
import { EmptyState, PageHeader } from "./ui";

export function AdminQueue() {
  const state = useAppState();
  const queue = buildQueue(state.allRequirements(), state.today);
  const [tab, setTab] = useState<QueueItem["status"]>(() => QUEUE_ORDER.find((s) => queue.some((q) => q.status === s)) ?? "conflict");
  const rows = queue.filter((q) => q.status === tab);

  return (
    <div>
      <PageHeader title="Verification queue" subtitle="Records that cannot be used as facts. Open one to review the source, fix the value and change its status." />
      <PillTabs<QueueItem["status"]>
        label="Queues"
        value={tab}
        onChange={setTab}
        tabs={QUEUE_ORDER.map((s) => ({ id: s, label: STATUS_LABEL[s], count: queue.filter((q) => q.status === s).length }))}
      />
      <div className="mt-5" />

      {rows.length === 0 ? (
        <EmptyState title={`No ${STATUS_LABEL[tab].toLowerCase()} records`}>Nothing in this queue on {formatDate(state.today)}.</EmptyState>
      ) : (
        <div className="relative overflow-x-auto rounded-[20px] border border-line bg-surface shadow-[var(--shadow)]">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Programme</th>
                <th className="px-3 py-2 font-medium">Requirement</th>
                <th className="px-3 py-2 font-medium">Value</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Last verified</th>
                <th className="px-3 py-2 font-medium">Why it is here</th>
                <th className="px-3 py-2"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(({ requirement: r, program, status, reason }) => (
                <tr key={r.id}>
                  <td className="px-3 py-3 align-top">{program.name}</td>
                  <td className="px-3 py-3 align-top font-medium">
                    {r.label}
                    {state.requests.includes(r.id) ? <span className="ml-2 rounded bg-primary-soft px-1.5 py-0.5 text-xs">Requested</span> : null}
                  </td>
                  <td className="px-3 py-3 align-top">{describeRequired(r)}</td>
                  <td className="px-3 py-3 align-top"><StatusBadge status={status} /></td>
                  <td className="px-3 py-3 align-top text-muted">{r.source ? `${r.source.url.replace(/^https?:\/\//, "").split("/")[0]} · Tier ${r.source.tier}` : "none"}</td>
                  <td className="px-3 py-3 align-top text-muted">{formatDate(r.verifiedAt)}</td>
                  <td className="px-3 py-3 align-top text-muted">{reason}</td>
                  <td className="px-3 py-3 align-top"><Link href={`/admin/requirements/${r.id}`} className="font-medium text-primary hover:underline">Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
