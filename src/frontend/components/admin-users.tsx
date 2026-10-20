"use client";

import { useState } from "react";
import { STATUS_LABEL, searchUsers, type AccountStatus, type AdminUser } from "@/lib/admin-users";
import { formatDate } from "@/lib/dates";
import { Select } from "./form-controls";
import { IconSearch } from "./icons";
import { EmptyState, PageHeader } from "./ui";

const PAGE_SIZE = 8;

/** Accounts. The demo has no user database or sign-up backend yet, so the list is empty until the API provides it. */
const USERS: AdminUser[] = [];
const TONE: { [K in AccountStatus]: string } = {
  active: "bg-success-bg text-success",
  unconfirmed: "bg-surface-2 text-muted",
  suspended: "bg-danger-bg text-danger",
};

/** Administrator view of accounts. Access is enforced by the admin layout (RequireRole). */
export function AdminUsers() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AccountStatus | "all">("all");
  const [page, setPage] = useState(1);

  const rows = searchUsers(USERS, query, status);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Users" subtitle="Registered accounts: name, email, registration date and status." />
      {USERS.length === 0 ? (
        <EmptyState title="No registered users yet">Accounts will appear here once sign-up is connected to the backend. The demo has no user database.</EmptyState>
      ) : null}

      {USERS.length > 0 ? (
      <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative block min-w-0 flex-1 basis-64">
          <span className="sr-only">Search users</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"><IconSearch size={16} /></span>
          <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search by name or email" className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-primary" />
        </label>
        <Select
          variant="pill"
          label="Account status"
          placeholder={null}
          value={status}
          options={[{ value: "all", label: "All statuses" }, ...(Object.keys(STATUS_LABEL) as AccountStatus[]).map((s) => ({ value: s, label: STATUS_LABEL[s] }))]}
          onChange={(v) => { setStatus((v ?? "all") as AccountStatus | "all"); setPage(1); }}
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No users match">Try another name, email or status.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-[20px] border border-line bg-surface shadow-[var(--shadow)]">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Registered</th><th className="px-4 py-3 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shown.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">{formatDate(u.registeredAt)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[u.status]}`}>{STATUS_LABEL[u.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 ? (
        <nav aria-label="Pages" className="mt-4 flex items-center justify-between gap-3 text-sm">
          <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} className="press rounded-full border border-line bg-surface px-4 py-2 font-medium disabled:opacity-50">Previous</button>
          <span className="text-muted">Page {current} of {pages} · {rows.length} users</span>
          <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)} className="press rounded-full border border-line bg-surface px-4 py-2 font-medium disabled:opacity-50">Next</button>
        </nav>
      ) : null}
      </>
      ) : null}
    </div>
  );
}
