import { describe, expect, it } from "vitest";
import { institutions } from "@/lib/institutions";

describe("institutions", () => {
  const listed = institutions.filter((i) => i.origin === "bolashak");

  it("holds the 489 rows of the Bolashak list, each once", () => {
    expect(listed).toHaveLength(489);
    expect(new Set(institutions.map((i) => i.id)).size).toBe(institutions.length);
    expect(new Set(listed.map((i) => i.listNo)).size).toBe(489);
  });

  it("has no duplicate (name, country) pair", () => {
    const keys = institutions.map((i) => `${i.name.toLowerCase()}|${i.country}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("copies name, country and an http(s) website for every listed institution", () => {
    for (const i of listed) {
      expect(i.name.trim()).not.toBe("");
      expect(i.country).toMatch(/^[A-Z]/);
      expect(i.websiteUrl).toMatch(/^https?:\/\/[^/]+\.[^/]+/);
    }
  });
});
