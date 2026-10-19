const SEASONS = [
  { name: "Spring", month: 1 },
  { name: "Summer", month: 6 },
  { name: "Fall", month: 9 },
] as const;

/** Intakes that start after `today`, up to three years ahead, for example "Fall 2027". */
export function intakeOptions(today: string): string[] {
  const t = new Date(today + "T00:00:00Z");
  const out: string[] = [];
  for (let year = t.getUTCFullYear(); year <= t.getUTCFullYear() + 3; year++) {
    for (const s of SEASONS) {
      const start = Date.UTC(year, s.month - 1, 1);
      const limit = Date.UTC(t.getUTCFullYear() + 3, t.getUTCMonth(), t.getUTCDate());
      if (start > t.getTime() && start <= limit) out.push(`${s.name} ${year}`);
    }
  }
  return out;
}
