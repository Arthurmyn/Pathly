"use client";

import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { getProgram } from "@/lib/mock-data";
import { useAppState } from "./app-state";
import { StatusBadge } from "./badges";
import { EmptyState, PageHeader } from "./ui";

export function AuditLog() {
  const { audit, getRequirementById } = useAppState();
  return (
    <div>
      <PageHeader title="Audit log" subtitle="Every status change: who, when, from, to and why (FR-06)." />
      {audit.length === 0 ? (
        <EmptyState title="No changes yet">Verify, edit or mark a requirement to see it here.</EmptyState>
      ) : (
        <div className="relative overflow-x-auto rounded-[20px] border border-line bg-surface shadow-[var(--shadow)]">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr><th className="px-3 py-2 font-medium">Date</th><th className="px-3 py-2 font-medium">Requirement</th><th className="px-3 py-2 font-medium">From</th><th className="px-3 py-2 font-medium">To</th><th className="px-3 py-2 font-medium">By</th><th className="px-3 py-2 font-medium">Note</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {audit.map((a) => {
                const r = getRequirementById(a.requirementId);
                return (
                  <tr key={a.id}>
                    <td className="px-3 py-3">{formatDate(a.at)}</td>
                    <td className="px-3 py-3"><Link href={`/admin/requirements/${a.requirementId}`} className="text-primary hover:underline">{r?.label}</Link><br /><span className="text-xs text-muted">{r ? getProgram(r.programSlug)?.name : ""}</span></td>
                    <td className="px-3 py-3"><StatusBadge status={a.from} /></td>
                    <td className="px-3 py-3"><StatusBadge status={a.to} /></td>
                    <td className="px-3 py-3">{a.by}</td>
                    <td className="px-3 py-3 text-muted">{a.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
