import { describe, expect, it } from "vitest";
import { DEMO_USERS, searchUsers } from "./admin-users";

describe("searchUsers", () => {
  it("finds by name or email, case-insensitively", () => {
    expect(searchUsers(DEMO_USERS, "ARUZHAN", "all").map((u) => u.id)).toEqual(["u01"]);
    expect(searchUsers(DEMO_USERS, "dana.a@", "all").map((u) => u.id)).toEqual(["u07"]);
  });
  it("filters by account status and combines it with the query", () => {
    expect(searchUsers(DEMO_USERS, "", "suspended").every((u) => u.status === "suspended")).toBe(true);
    expect(searchUsers(DEMO_USERS, "madina", "active")).toHaveLength(0);
  });
});
