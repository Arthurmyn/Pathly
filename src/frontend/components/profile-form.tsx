"use client";

import Link from "next/link";
import { useState } from "react";
import { sampleProfile } from "@/lib/mock-data";
import { allCountries } from "@/lib/countries";
import { specialities } from "@/lib/specialities";
import { EXAMS, effectiveTarget, examsFor, type ExamMeta } from "@/lib/exams";
import { intakeOptions } from "@/lib/intake";
import { completeness, profileFields } from "@/lib/profile-fields";
import type { ExamState, IeltsSections, Profile, WorkField } from "@/lib/types";
import { EMPTY_PROFILE, useAppState } from "./app-state";
import { Combobox, CompleteBadge, Field, MultiSelect, NumberField, Pills, Select, SelectField, Section, TextField } from "./form-controls";
import { ProgressRing } from "./rail";
import { Button, Card, CardLabel, LinkButton, PageHeader } from "./ui";

const COUNTRIES = allCountries();
const OTHER = "__other";
const SPECIALITY_OPTIONS = specialities.map((s) => ({ value: s.nameRu, label: `${s.code} ${s.nameRu}`, hint: s.examples.join(", ") }));
const SECTION_NAMES: (keyof IeltsSections)[] = ["listening", "reading", "writing", "speaking"];

const DEGREES = [
  { value: "high_school", label: "High school" },
  { value: "bachelor", label: "Bachelor's degree" },
  { value: "master", label: "Master's degree" },
];

const TARGETS_BY_DEGREE: { [k: string]: { value: string; label: string }[] } = {
  high_school: [{ value: "bachelor", label: "Bachelor's" }],
  bachelor: [{ value: "master", label: "Master's" }, { value: "phd", label: "Doctoral / PhD" }],
  master: [{ value: "master", label: "Master's" }, { value: "phd", label: "Doctoral / PhD" }],
};
const ALL_TARGETS = [{ value: "bachelor", label: "Bachelor's" }, ...TARGETS_BY_DEGREE.bachelor];

const WORK_FIELD = [
  { value: "same", label: "Same field as my target programme" },
  { value: "related", label: "A related field" },
  { value: "other", label: "A different field" },
];

/** IELTS overall band: the mean of the four sections, rounded to the nearest half band. */
function ieltsOverall(s: IeltsSections): number | null {
  const v = Object.values(s);
  if (v.some((x) => x == null)) return null;
  const mean = (v as number[]).reduce((a, b) => a + b, 0) / 4;
  return Math.round(mean * 2) / 2;
}

function sameProfile(a: Profile, b: Profile) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function ProfileForm() {
  const { profile, ready } = useAppState();
  // The editor starts from the saved profile once it is loaded from the browser.
  if (!ready) return <div className="min-h-[60vh]" aria-busy="true" />;
  return <ProfileEditor saved={profile} />;
}

function ProfileEditor({ saved }: { saved: Profile }) {
  const { updateProfile, today } = useAppState();
  const [draft, setDraft] = useState<Profile>(saved);
  const [justSaved, setJustSaved] = useState(false);
  const dirty = !sameProfile(draft, saved);

  const set = (patch: Partial<Profile>) => {
    setJustSaved(false);
    setDraft((d) => ({ ...d, ...patch }));
  };
  const lang = draft.language;
  const isSchool = draft.currentDegree === "high_school";
  const fields = profileFields(draft);
  const { percent } = completeness(draft);
  const groupStat = (keys: string[]) => {
    const f = fields.filter((x) => keys.includes(x.key));
    return { filled: f.filter((x) => x.value != null).length, total: f.length };
  };
  const stat = {
    education: groupStat(["degree", "programme", "gpa", "speciality"]),
    goals: groupStat(["target", "targetField", "intake", "country"]),
    language: groupStat(["language"]),
    exams: groupStat(["exams"]),
    budget: groupStat(["budget", "funding"]),
    work: groupStat(["work"]),
    docs: groupStat(["documents"]),
  };

  const intakes = intakeOptions(today);
  if (draft.intake && !intakes.includes(draft.intake)) intakes.unshift(draft.intake);

  function changeDegree(v: string | null) {
    const deg = v as Profile["currentDegree"];
    const allowed = deg ? TARGETS_BY_DEGREE[deg] : ALL_TARGETS;
    const keep = draft.targetLevel && allowed.some((t) => t.value === draft.targetLevel);
    const only = deg === "high_school" ? ("bachelor" as const) : null;
    set({ currentDegree: deg, targetLevel: keep ? draft.targetLevel : only });
  }

  function changeTarget(v: string | null) {
    set({ targetLevel: v as Profile["targetLevel"] });
  }

  function setTest(test: "ielts" | "toefl", state: "none" | "planned" | "taken") {
    if (state === "none") {
      if (lang.test === test) set({ language: { ...lang, test: null, score: null, planned: false, sections: { listening: null, reading: null, writing: null, speaking: null } } });
      return;
    }
    const fresh = lang.test === test ? lang : { ...lang, score: null, sections: { listening: null, reading: null, writing: null, speaking: null } };
    set({ language: { ...fresh, test, planned: state === "planned" } });
  }
  const testState = (test: "ielts" | "toefl") =>
    lang.test !== test ? "none" : lang.planned && lang.score == null ? "planned" : "taken";

  function setSection(name: keyof IeltsSections, v: number | null) {
    const sections = { ...lang.sections, [name]: v };
    const overall = ieltsOverall(sections);
    set({ language: { ...lang, sections, score: overall ?? lang.score } });
  }

  function setExam(name: string, state: ExamState | "none", score?: number | null) {
    const rest = draft.exams.filter((e) => e.name !== name);
    const prev = draft.exams.find((e) => e.name === name);
    set({ exams: state === "none" ? rest : [...rest, { name, state, score: state === "passed" ? (score !== undefined ? score : prev?.score ?? null) : null }] });
  }

  const relevant = examsFor(draft);
  const shownExams: ExamMeta[] = [
    ...relevant,
    ...draft.exams.filter((e) => !relevant.some((r) => r.name === e.name)).map((e) => EXAMS.find((x) => x.name === e.name) ?? { name: e.name, levels: [] }),
  ];
  const addable = EXAMS.filter((e) => !shownExams.some((s) => s.name === e.name));
  const [adding, setAdding] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  function addExam() {
    const name = pick === OTHER ? custom.trim() : pick;
    if (!name) return;
    setExam(name, "planned");
    setAdding(false); setPick(null); setCustom("");
  }
  const targetLabel = ALL_TARGETS.find((t) => t.value === effectiveTarget(draft))?.label;

  function save() {
    updateProfile(draft);
    setJustSaved(true);
  }

  const checklist = [
    { label: "Education", ...stat.education },
    { label: "Target", ...stat.goals },
    { label: "Language tests", ...stat.language },
    ...(stat.exams.total ? [{ label: "Entrance exams", ...stat.exams }] : []),
    { label: "Budget and funding", ...stat.budget },
    ...(isSchool ? [] : [{ label: "Work experience", ...stat.work }]),
    { label: "Documents", ...stat.docs },
  ];

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Only the fields needed to compare you with requirements. Save your changes to update your results and roadmaps."
        actions={
          <>
            <Button variant="ghost" onClick={() => { setDraft(saved); setJustSaved(false); }} disabled={!dirty}>Discard</Button>
            <Button onClick={save} disabled={!dirty}>Save Changes</Button>
          </>
        }
      />
      <p className="-mt-3 mb-5 min-h-5 text-sm" role="status" aria-live="polite">
        {justSaved && !dirty ? <span className="text-success">Changes saved.</span> : dirty ? <span className="text-muted">You have unsaved changes.</span> : null}
      </p>

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
        <form className="stagger space-y-5" onSubmit={(e) => { e.preventDefault(); if (dirty) save(); }}>
          <Section title="Education" badge={<CompleteBadge {...stat.education} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Current degree" value={draft.currentDegree} options={DEGREES} onChange={changeDegree} />
              {isSchool ? null : <TextField label="Educational programme" value={draft.programme} placeholder="The programme you studied, for example Computer Science" onChange={(v) => set({ programme: v })} />}
              <NumberField label={isSchool ? "School GPA (4.0 scale)" : "GPA (4.0 scale)"} value={draft.gpa} min={0} max={4} step={0.01} help="Convert your grades to a 4.0 scale." onCommit={(v) => set({ gpa: v })} />
              {isSchool ? null : <Combobox label="Speciality" value={draft.field} options={SPECIALITY_OPTIONS} placeholder="Choose from the list or type your own" help="The speciality of your degree." onChange={(v) => set({ field: v })} />}
            </div>
          </Section>

          <Section title="Target" badge={<CompleteBadge {...stat.goals} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Target degree" value={draft.targetLevel} options={draft.currentDegree ? TARGETS_BY_DEGREE[draft.currentDegree] : ALL_TARGETS} onChange={changeTarget} />
              <Combobox label="Field of study" value={draft.targetField} options={SPECIALITY_OPTIONS} placeholder="Choose from the list or type your own" help="What you want to study next." onChange={(v) => set({ targetField: v })} />
              <SelectField label="Intake" value={draft.intake} placeholder="Choose an intake" options={intakes.map((i) => ({ value: i, label: i }))} help="The next three years of Spring, Summer and Fall intakes." onChange={(v) => set({ intake: v })} />
              <div className="text-sm font-medium">
                <span>Target countries</span>
                <MultiSelect label="Target countries" placeholder="Any country" value={draft.targetCountries} options={COUNTRIES} onChange={(v) => set({ targetCountries: v })} />
              </div>
            </div>
          </Section>

          <Section title="Language tests" badge={<CompleteBadge {...stat.language} />} description="Pathly does not convert between tests. A programme that asks for IELTS is compared with an IELTS score.">
            <div className="divide-y divide-line">
              {(["ielts", "toefl"] as const).map((t) => {
                const st = testState(t);
                return (
                  <div key={t} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium">{t.toUpperCase()}</p>
                      <Select
                        variant="compact"
                        label={`${t.toUpperCase()} status`}
                        placeholder={null}
                        value={st}
                        options={[{ value: "none", label: "Not taken" }, { value: "planned", label: "Planned" }, { value: "taken", label: "Taken" }]}
                        onChange={(v) => setTest(t, (v ?? "none") as "none" | "planned" | "taken")}
                      />
                    </div>
                    {st === "taken" && t === "ielts" ? (
                      <div className="mt-3">
                        <p className="text-xs text-muted">Some programmes ask for a minimum in every section, so enter all four.</p>
                        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
                          {SECTION_NAMES.map((n) => (
                            <NumberField key={n} compact label={n[0].toUpperCase() + n.slice(1)} value={lang.sections[n]} min={0} max={9} step={0.5} onCommit={(v) => setSection(n, v)} />
                          ))}
                          <NumberField compact label="Overall" value={lang.score} min={0} max={9} step={0.5} help={ieltsOverall(lang.sections) != null ? "Calculated" : undefined} onCommit={(v) => set({ language: { ...lang, score: v } })} />
                        </div>
                      </div>
                    ) : null}
                    {st === "taken" && t === "toefl" ? (
                      <div className="mt-3 max-w-40">
                        <NumberField compact label="Total score" value={lang.score} min={0} max={120} onCommit={(v) => set({ language: { ...lang, score: v } })} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Section>

          <Section
            title="Entrance exams"
            badge={<CompleteBadge {...stat.exams} />}
            description={targetLabel ? `Showing the exams that ${targetLabel} programmes ask for.` : "Showing all exams. Choose a current degree to see only the relevant ones."}
          >
            <div className="divide-y divide-line">
              {shownExams.map((meta) => {
                const entry = draft.exams.find((e) => e.name === meta.name);
                const st = entry?.state ?? "none";
                return (
                  <div key={meta.name} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium">{meta.name}</p>
                      <Select
                        variant="compact"
                        label={`${meta.name} status`}
                        placeholder={null}
                        value={st}
                        options={[{ value: "none", label: "Not taken" }, { value: "planned", label: "Planned" }, { value: "passed", label: "Taken" }]}
                        onChange={(v) => setExam(meta.name, (v ?? "none") as ExamState | "none")}
                      />
                    </div>
                    {st === "passed" && meta.score ? (
                      <div className="mt-3 max-w-48">
                        <NumberField compact label={meta.score.label} value={entry?.score ?? null} min={meta.score.min} max={meta.score.max} onCommit={(v) => setExam(meta.name, "passed", v)} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {adding ? (
              <div className="slide-down mt-4 rounded-2xl bg-surface-2 p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="text-sm font-medium">
                    <span>Exam</span>
                    <Select
                      label="Exam to add"
                      placeholder="Choose an exam"
                      value={pick}
                      options={[...addable.map((e) => ({ value: e.name, label: e.name })), { value: OTHER, label: "Other exam…" }]}
                      onChange={setPick}
                    />
                  </div>
                  {pick === OTHER ? (
                    <div className="min-w-48 flex-1">
                      <TextField label="Exam name" value={custom || null} placeholder="For example TestAS" onChange={(v) => setCustom(v ?? "")} />
                    </div>
                  ) : null}
                  <Button onClick={addExam} disabled={!pick || (pick === OTHER && !custom.trim())}>Add</Button>
                  <Button variant="ghost" onClick={() => { setAdding(false); setPick(null); setCustom(""); }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="mt-4"><Button variant="secondary" onClick={() => setAdding(true)}>Add exam</Button></div>
            )}
          </Section>

          <Section title="Budget and funding" badge={<CompleteBadge {...stat.budget} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Budget per year (USD)" value={draft.budgetUsd} min={0} max={1000000} step={500} onCommit={(v) => set({ budgetUsd: v })} />
              <div>
                <p className="text-sm font-medium">Funding preference</p>
                <div className="mt-2.5">
                  <Pills
                    label="Funding preference"
                    value={draft.funding}
                    options={[{ value: "self", label: "Self-funded" }, { value: "scholarship", label: "Scholarship" }, { value: "unsure", label: "Not sure" }]}
                    onChange={(v) => set({ funding: v })}
                  />
                </div>
              </div>
            </div>
          </Section>

          {isSchool ? null : (
            <Section title="Work experience" badge={<CompleteBadge {...stat.work} />} description="Some programmes count only experience that is close to the field, so say what kind of work it was.">
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField label="Years of work" value={draft.workYears} min={0} max={60} step={0.5} onCommit={(v) => set({ workYears: v })} />
                <SelectField label="How close is it to your target programme?" value={draft.workField} placeholder="Not set" options={WORK_FIELD} onChange={(v) => set({ workField: v as WorkField | null })} />
                <TextField label="Role or sector (optional)" value={draft.workRole} placeholder="For example Backend developer, retail, teaching" onChange={(v) => set({ workRole: v })} />
              </div>
            </Section>
          )}

          <Section title="Application documents" badge={<CompleteBadge {...stat.docs} />}>
            <Field label="Are your application documents ready?">
              <div className="mt-2.5">
                <Pills label="Documents ready" value={draft.documentsReady} options={[{ value: true, label: "Yes" }, { value: false, label: "No" }, { value: null, label: "Not sure" }]} onChange={(v) => set({ documentsReady: v })} />
              </div>
            </Field>
          </Section>

          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <Button variant="ghost" onClick={() => { setDraft(saved); setJustSaved(false); }} disabled={!dirty}>Discard</Button>
            <Button onClick={save} disabled={!dirty}>Save Changes</Button>
          </div>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <Card>
            <div className="flex items-center gap-4">
              <ProgressRing percent={percent} size={64} />
              <div>
                <CardLabel>Profile completeness</CardLabel>
                <p className="mt-1 text-sm text-muted">{fields.filter((f) => f.value != null).length} of {fields.length} fields filled</p>
              </div>
            </div>
            <ul className="mt-4 divide-y divide-line text-sm">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center justify-between gap-3 py-2">
                  <span>{c.label}</span>
                  <span className={c.filled === c.total ? "font-medium text-success" : "text-muted"}>{c.filled === c.total ? "Complete" : `${c.filled} of ${c.total}`}</span>
                </li>
              ))}
            </ul>
          </Card>
          {percent < 100 ? (
            <Card>
              <h2 className="font-semibold">Speed it up with AI</h2>
              <p className="mt-1 text-sm text-muted">Describe your background in your own words and the fields fill in on this page.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkButton href="/app/onboarding">Edit with AI</LinkButton>
                <LinkButton href="/programs" variant="secondary">Find matching programmes</LinkButton>
              </div>
            </Card>
          ) : (
            <Card>
              <h2 className="font-semibold">Your profile is complete</h2>
              <p className="mt-1 text-sm text-muted">See which programmes fit. You can still <Link href="/app/onboarding" className="underline">update it with AI</Link> when something changes.</p>
              <div className="mt-4"><LinkButton href="/programs">Find matching programmes</LinkButton></div>
            </Card>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => { setDraft({ ...sampleProfile }); setJustSaved(false); }}>Use a sample profile</Button>
            <Button variant="ghost" onClick={() => { setDraft(EMPTY_PROFILE); setJustSaved(false); }}>Clear</Button>
          </div>
          <p className="px-1 text-xs text-muted">
            Your profile stays in this browser in the demo. <Link href="/privacy" className="underline">What we keep</Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
