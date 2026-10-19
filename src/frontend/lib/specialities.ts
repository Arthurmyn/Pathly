import light from "./data/bolashak-specialities.json";

export type SpecialityLevel = "bachelor" | "master" | "phd" | "residency";

export interface Speciality {
  id: string;
  no: number;
  /** Code in the list, for example "1.1". */
  code: string;
  group: string;
  groupNo: number;
  /** Name as written in the Bolashak list (Russian). */
  nameRu: string;
  levels: { level: SpecialityLevel; code: string }[];
  /** How many English programme names the list gives as equivalents. */
  programmeCount: number;
  examples: string[];
}

export const specialities = light as Speciality[];

export const getSpeciality = (id: string) => specialities.find((s) => s.id === id);

export const LEVEL_NAME: { [K in SpecialityLevel]: string } = {
  bachelor: "Bachelor's",
  master: "Master's",
  phd: "Doctoral / PhD",
  residency: "Residency",
};

export const SPECIALITY_GROUPS = Array.from(new Map(specialities.map((s) => [s.groupNo, s.group])).entries()).sort((a, b) => a[0] - b[0]).map(([, g]) => g);
