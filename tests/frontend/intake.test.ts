import { describe, expect, it } from "vitest";
import { intakeOptions } from "@/lib/intake";

describe("intakeOptions", () => {
  it("lists only future intakes within three years", () => {
    const o = intakeOptions("2026-10-19");
    expect(o[0]).toBe("Spring 2027");
    expect(o).not.toContain("Fall 2026");
    expect(o).toContain("Fall 2029");
    expect(o).not.toContain("Spring 2030");
  });
});
