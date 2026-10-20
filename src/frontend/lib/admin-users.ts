export type AccountStatus = "active" | "unconfirmed" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  status: AccountStatus;
}

export const STATUS_LABEL: { [K in AccountStatus]: string } = { active: "Active", unconfirmed: "Email not confirmed", suspended: "Suspended" };

export function searchUsers(users: AdminUser[], query: string, status: AccountStatus | "all"): AdminUser[] {
  const q = query.trim().toLowerCase();
  return users.filter((u) => (status === "all" || u.status === status) && (!q || `${u.name} ${u.email}`.toLowerCase().includes(q)));
}
