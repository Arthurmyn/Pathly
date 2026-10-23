import { describe, expect, it } from "vitest";
import programmes from "@/lib/data/bolashak-specialities-programmes.json";
import { specialities } from "@/lib/specialities";

describe("Bolashak priority specialities", () => {
  it("has the 93 rows of the list with unique codes", () => {
    expect(specialities).toHaveLength(93);
    expect(new Set(specialities.map((s) => s.code)).size).toBe(93);
  });

  it("gives every speciality a name, at least one level and programme names", () => {
    const names = programmes as { [id: string]: string[] };
    for (const s of specialities) {
      expect(s.nameRu.trim()).not.toBe("");
      expect(s.levels.length).toBeGreaterThan(0);
      expect(names[s.id].length).toBe(s.programmeCount);
      expect(s.programmeCount).toBeGreaterThan(0);
    }
  });

  it("keeps each code under its field (code prefix = field number)", () => {
    for (const s of specialities) expect(s.code.startsWith(`${s.groupNo}.`)).toBe(true);
  });
});
