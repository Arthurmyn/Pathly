import type { Profile } from "@/lib/types";

/** True when the profile has at least one value that can be compared with a requirement. */
export function hasProfileData(p: Profile): boolean {
  return (
    p.gpa != null ||
    p.language.score != null ||
    p.language.planned ||
    p.currentDegree != null ||
    p.exams.length > 0 ||
    p.workYears != null ||
    p.documentsReady != null
  );
}
