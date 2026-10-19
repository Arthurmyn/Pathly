export type AccountStatus = "active" | "unconfirmed" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  status: AccountStatus;
  /** True for the account of whoever is using this browser in the demo. */
  you?: boolean;
}

/**
 * Illustrative accounts. The demo has no user database or sign-up backend yet, so these rows are invented
 * (reserved example.com addresses) and only show how the page works. The real list comes from the API.
 */
export const DEMO_USERS: AdminUser[] = [
  { id: "u01", name: "Aruzhan N.", email: "aruzhan.n@example.com", registeredAt: "2026-09-02", status: "active" },
  { id: "u02", name: "Daniyar K.", email: "daniyar.k@example.com", registeredAt: "2026-09-04", status: "active" },
  { id: "u03", name: "Madina S.", email: "madina.s@example.com", registeredAt: "2026-09-09", status: "unconfirmed" },
  { id: "u04", name: "Timur B.", email: "timur.b@example.com", registeredAt: "2026-09-11", status: "active" },
  { id: "u05", name: "Aigerim T.", email: "aigerim.t@example.com", registeredAt: "2026-09-15", status: "active" },
  { id: "u06", name: "Nurlan M.", email: "nurlan.m@example.com", registeredAt: "2026-09-18", status: "suspended" },
  { id: "u07", name: "Dana A.", email: "dana.a@example.com", registeredAt: "2026-09-21", status: "active" },
  { id: "u08", name: "Alikhan R.", email: "alikhan.r@example.com", registeredAt: "2026-09-25", status: "unconfirmed" },
  { id: "u09", name: "Zhanel O.", email: "zhanel.o@example.com", registeredAt: "2026-09-28", status: "active" },
  { id: "u10", name: "Yerlan D.", email: "yerlan.d@example.com", registeredAt: "2026-10-01", status: "active" },
  { id: "u11", name: "Assel Z.", email: "assel.z@example.com", registeredAt: "2026-10-06", status: "active" },
  { id: "u12", name: "Bekzat U.", email: "bekzat.u@example.com", registeredAt: "2026-10-12", status: "unconfirmed" },
];

export const STATUS_LABEL: { [K in AccountStatus]: string } = { active: "Active", unconfirmed: "Email not confirmed", suspended: "Suspended" };

export function searchUsers(users: AdminUser[], query: string, status: AccountStatus | "all"): AdminUser[] {
  const q = query.trim().toLowerCase();
  return users.filter((u) => (status === "all" || u.status === status) && (!q || `${u.name} ${u.email}`.toLowerCase().includes(q)));
}
