import { describe, expect, it } from "vitest";
import { searchUsers, type AdminUser } from "@/lib/admin-users";

const users: AdminUser[] = [
  { id: "a", name: "Test One", email: "one@example.com", registeredAt: "2026-09-02", status: "active" },
  { id: "b", name: "Test Two", email: "two@example.com", registeredAt: "2026-09-04", status: "suspended" },
];

describe("searchUsers", () => {
  it("finds by name or email, case-insensitively", () => {
    expect(searchUsers(users, "ONE", "all").map((u) => u.id)).toEqual(["a"]);
    expect(searchUsers(users, "two@", "all").map((u) => u.id)).toEqual(["b"]);
  });
  it("filters by account status and combines it with the query", () => {
    expect(searchUsers(users, "", "suspended").map((u) => u.id)).toEqual(["b"]);
    expect(searchUsers(users, "one", "suspended")).toHaveLength(0);
  });
  it("returns nothing for an empty list", () => {
    expect(searchUsers([], "", "all")).toEqual([]);
  });
});
