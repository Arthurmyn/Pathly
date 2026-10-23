import { describe, expect, it } from "vitest";
import { effectiveStatus } from "@/lib/status";
import type { Checkable } from "@/lib/status";

const tier1 = { url: "https://x.example", title: "Official", tier: 1 as const };

const base: Checkable = { status: "verified", source: tier1, validUntil: "2027-03-11" };

describe("effectiveStatus", () => {
  it("keeps a verified record verified inside its validity window", () => {
    expect(effectiveStatus(base, "2026-10-19")).toBe("verified");
    expect(effectiveStatus(base, "2027-03-11")).toBe("verified");
  });

  it("turns a verified record stale after its validity date (time travel)", () => {
    expect(effectiveStatus(base, "2027-03-12")).toBe("stale");
  });

  it("never shows a record as verified without a Tier 1 source", () => {
    expect(effectiveStatus({ ...base, source: { ...tier1, tier: 2 } }, "2026-10-19")).toBe("unverified");
    expect(effectiveStatus({ ...base, source: null }, "2026-10-19")).toBe("unverified");
  });

  it("does not change the other stored statuses", () => {
    for (const status of ["unverified", "stale", "missing", "conflict"] as const) {
      expect(effectiveStatus({ ...base, status }, "2026-10-19")).toBe(status);
    }
  });
});
