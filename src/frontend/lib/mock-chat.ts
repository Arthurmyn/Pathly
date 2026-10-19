import { describeRequired } from "./eligibility";
import { formatDate } from "./dates";
import { effectiveStatus } from "./status";
import type { Profile, Requirement } from "./types";

/** Mock "extraction" for onboarding: simple patterns, not a language model. Always returns a reply. */
export function mockOnboardingReply(text: string, profile: Profile): { patch: Partial<Profile>; reply: string } {
  const t = text.toLowerCase();
  const patch: Partial<Profile> = {};
  const got: string[] = [];

  if (/high school|school|школ/.test(t)) { patch.currentDegree = "high_school"; patch.targetLevel = "bachelor"; got.push("current degree: High school"); }
  else if (/master'?s? (degree|graduate)|магистр.*(окончил|закончил)|finished a master/.test(t)) { patch.currentDegree = "master"; got.push("current degree: Master's"); }
  else if (/bachelor|бакалавр/.test(t) && /(finished|have|graduated|окончил|закончил|completed)/.test(t)) { patch.currentDegree = "bachelor"; got.push("current degree: Bachelor's"); }

  if (/want.*(master|магистр)|master'?s? in|магистратур/.test(t)) { patch.targetLevel = "master"; got.push("target: Master's"); }
  else if (/phd|doctor|докторантур/.test(t)) { patch.targetLevel = "phd"; got.push("target: Doctoral / PhD"); }
  else if (/want.*bachelor|bachelor'?s? in/.test(t)) { patch.targetLevel = "bachelor"; got.push("target: Bachelor's"); }

  if (/\b(us|usa|united states|america|сша)\b/.test(t)) { patch.targetCountry = "United States"; got.push("country: United States"); }
  else if (/kazakhstan|казахстан/.test(t)) { patch.targetCountry = "Kazakhstan"; got.push("country: Kazakhstan"); }

  const gpa = t.match(/gpa\s*(?:of|is|:)?\s*(\d(?:[.,]\d{1,2})?)/);
  if (gpa) { const v = Number(gpa[1].replace(",", ".")); if (v >= 0 && v <= 4) { patch.gpa = v; got.push(`GPA: ${v}`); } }

  const ielts = t.match(/ielts\s*(?:of|is|:)?\s*(\d(?:\.\d)?)/);
  const toefl = t.match(/toefl\s*(?:of|is|:)?\s*(\d{2,3})/);
  if (ielts) { patch.language = { ...profile.language, test: "ielts", score: Number(ielts[1]), planned: false }; got.push(`IELTS: ${ielts[1]}`); }
  else if (toefl) { patch.language = { ...profile.language, test: "toefl", score: Number(toefl[1]), planned: false }; got.push(`TOEFL: ${toefl[1]}`); }

  const budget = t.match(/\$\s*(\d[\d,]*)\s*(k)?/) ?? t.match(/(\d[\d,]*)\s*(k|тыс)?\s*(?:usd|dollars|долл)/);
  if (budget) {
    let v = Number(budget[1].replace(/[\s,]/g, ""));
    if (budget[2]) v *= 1000;
    if (v > 0) { patch.budgetUsd = v; got.push(`budget: $${v.toLocaleString("en-US")}`); }
  }

  const intake = t.match(/(spring|summer|fall|autumn|осень|весн|лет)\D{0,6}(20\d\d)/);
  if (intake) {
    const season = /spring|весн/.test(intake[1]) ? "Spring" : /summer|лет/.test(intake[1]) ? "Summer" : "Fall";
    patch.intake = `${season} ${intake[2]}`; got.push(`intake: ${patch.intake}`);
  }

  const years = t.match(/(\d+(?:\.\d)?)\s*(?:years?|лет|года?)\s*(?:of\s*)?(?:work|experience|опыт)/);
  if (years) { patch.workYears = Number(years[1]); got.push(`work: ${years[1]} year(s)`); }

  const field = t.match(/(?:in|по)\s+(computer science|data science|economics|education|artificial intelligence|информатик\w*)/);
  if (field) { patch.field = field[1].replace(/\b\w/g, (c) => c.toUpperCase()); got.push(`field: ${patch.field}`); }

  const merged = { ...profile, ...patch };
  const next = nextQuestion(merged);
  const head = got.length ? `Got it: ${got.join("; ")}. I added this to your profile.` : "I could not pick any profile fields out of that, but you can tell me in your own words or use the quick answers.";
  return { patch, reply: `${head} ${next}` };
}

export function nextQuestion(p: Profile): string {
  if (!p.currentDegree) return "What is your current education: high school, a Bachelor's or a Master's degree?";
  if (!p.targetLevel) return "Which degree do you want to study next?";
  if (!p.targetCountry) return "Which country are you aiming for?";
  if (p.gpa == null) return "What is your GPA on a 4.0 scale?";
  if (!p.language.test) return "Did you take an English test, such as IELTS or TOEFL?";
  if (!p.intake) return "Which intake do you plan to start in, for example Fall 2027?";
  if (p.budgetUsd == null) return "What is your budget per year, in US dollars?";
  if (p.currentDegree !== "high_school" && p.workYears == null) return "How many years of work experience do you have, and is it close to your field?";
  return "Your profile has everything needed for matching. Review it on the right, or open the Profile page to fine-tune it.";
}

export interface AdvisorReply {
  text: string;
  /** Present when the answer comes from a Verified record. */
  source?: { label: string; quote: string; host: string; tier: number; verifiedAt: string };
  /** True when the advisor refuses because there is no verified source. */
  refusal?: boolean;
  requirementId?: string;
}

const TOPICS: { re: RegExp; kinds: Requirement["kind"][]; test?: string }[] = [
  { re: /toefl/, kinds: ["language_min"], test: "toefl" },
  { re: /ielts/, kinds: ["language_min"], test: "ielts" },
  { re: /english|language|язык|англий/, kinds: ["language_min"] },
  { re: /gpa|grade|балл|оценк/, kinds: ["gpa_min"] },
  { re: /exam|test|gre|sat|ent|экзамен/, kinds: ["exam_required"] },
  { re: /work|experience|опыт/, kinds: ["work_experience_min"] },
  { re: /document|документ/, kinds: ["documents_ready"] },
  { re: /degree|diploma|bachelor|master|диплом/, kinds: ["degree_required"] },
];

/** Mock advisor: answers only from the programme's requirements, and only when the record is Verified. */
export function mockAdvisorReply(question: string, reqs: Requirement[], programName: string, today: string): AdvisorReply {
  const q = question.toLowerCase();

  if (/deadline|дедлайн|срок|when/.test(q) && !/work/.test(q)) {
    return { text: "Deadlines are shown on the programme page with their own source and date. Open the programme to see the verified deadline, or the roadmap to see dated tasks." };
  }
  if (/chance|probab|will i (get|be accepted)|шанс|поступлю/.test(q)) {
    return { refusal: true, text: "I do not estimate a chance of admission. I can tell you which requirements you meet, which you do not, and which cannot be confirmed yet." };
  }

  const topic = TOPICS.find((t) => t.re.test(q));
  if (!topic) {
    return { text: `I can answer questions about the requirements of ${programName}: language tests, GPA, exams, work experience, documents and accepted degrees. Try “What TOEFL score do I need?”.` };
  }
  const candidates = reqs.filter((r) => topic.kinds.includes(r.kind) && (!topic.test || r.test === topic.test));
  if (candidates.length === 0) {
    return { refusal: true, text: `${programName} has no ${topic.test ? topic.test.toUpperCase() + " " : ""}requirement stored for this topic, so I will not guess.` };
  }
  const verified = candidates.find((r) => effectiveStatus(r, today) === "verified" && r.source);
  if (!verified) {
    const r = candidates[0];
    const st = effectiveStatus(r, today);
    const reason: { [k: string]: string } = {
      missing: "No value is stored for this requirement yet.",
      unverified: "The stored value has not been verified against an official source.",
      stale: `The source expired on ${formatDate(r.validUntil)}.`,
      conflict: r.conflictNote ?? "Two sources disagree.",
    };
    return { refusal: true, requirementId: r.id, text: `I can't answer this from verified sources. ${reason[st] ?? ""} I won't guess; you can ask an administrator to re-verify it.` };
  }
  return {
    text: `${programName}: ${describeRequired(verified)}.`,
    requirementId: verified.id,
    source: {
      label: verified.label,
      quote: describeRequired(verified),
      host: verified.source!.url.replace(/^https?:\/\//, "").split("/")[0],
      tier: verified.source!.tier,
      verifiedAt: verified.verifiedAt ?? "",
    },
  };
}
