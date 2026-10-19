"use client";

import { useState, type ReactNode } from "react";
import { requirements } from "@/lib/mock-data";
import type { ExamState, Profile } from "@/lib/types";
import { useAppState } from "./app-state";
import { Button, Callout, Card, LinkButton, PageHeader } from "./ui";

const KNOWN_EXAMS = Array.from(new Set(requirements.filter((r) => r.kind === "exam_required").map((r) => String(r.value))));
const COUNTRIES = ["Kazakhstan", "United States"];

const inputClass = "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm";

function Field({ label, help, error, children }: { label: string; help?: string; error?: string | null; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {help && !error ? <span className="mt-1 block text-xs font-normal text-muted">{help}</span> : null}
      {error ? <span role="alert" className="mt-1 block text-xs font-normal" style={{ color: "var(--st-conflict-fg)" }}>{error}</span> : null}
    </label>
  );
}

/** Number field that commits on blur and rejects values outside the range with a message. */
function NumberField({ label, value, min, max, step = 1, help, onCommit }: { label: string; value: number | null; min: number; max: number; step?: number; help?: string; onCommit: (v: number | null) => void }) {
  const [error, setError] = useState<string | null>(null);
  return (
    <Field label={label} help={help} error={error}>
      <input
        key={String(value)}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        defaultValue={value ?? ""}
        className={inputClass}
        onBlur={(e) => {
          const raw = e.target.value.trim();
          if (raw === "") { setError(null); return onCommit(null); }
          const n = Number(raw);
          if (Number.isNaN(n) || n < min || n > max) return setError(`Enter a number from ${min} to ${max}.`);
          setError(null);
          onCommit(n);
        }}
      />
    </Field>
  );
}

export function ProfileForm() {
  const { profile, updateProfile, loadSampleProfile, clearProfile } = useAppState();
  const set = (patch: Partial<Profile>) => updateProfile(patch);
  const lang = profile.language;

  function setExam(name: string, state: ExamState | "none") {
    const rest = profile.exams.filter((e) => e.name !== name);
    set({ exams: state === "none" ? rest : [...rest, { name, state }] });
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Only the fields needed to compare you with requirements. Every change updates your eligibility results and roadmaps."
        actions={
          <>
            <LinkButton href="/app/onboarding" variant="secondary">AI onboarding</LinkButton>
            <Button variant="secondary" onClick={loadSampleProfile}>Use a sample profile</Button>
            <Button variant="ghost" onClick={clearProfile}>Clear</Button>
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-semibold">Education and goals</h2>
          <Field label="Current degree">
            <select className={inputClass} value={profile.currentDegree ?? ""} onChange={(e) => set({ currentDegree: (e.target.value || null) as Profile["currentDegree"] })}>
              <option value="">Not set</option>
              <option value="high_school">High school</option>
              <option value="bachelor">Bachelor&apos;s degree</option>
              <option value="master">Master&apos;s degree</option>
            </select>
          </Field>
          <Field label="Field of study">
            <input className={inputClass} value={profile.field ?? ""} onChange={(e) => set({ field: e.target.value || null })} placeholder="For example Computer Science" />
          </Field>
          <Field label="Target degree">
            <select className={inputClass} value={profile.targetLevel ?? ""} onChange={(e) => set({ targetLevel: (e.target.value || null) as Profile["targetLevel"] })}>
              <option value="">Not set</option>
              <option value="bachelor">Bachelor&apos;s</option>
              <option value="master">Master&apos;s</option>
              <option value="phd">Doctoral / PhD</option>
            </select>
          </Field>
          <Field label="Target country">
            <select className={inputClass} value={profile.targetCountry ?? ""} onChange={(e) => set({ targetCountry: e.target.value || null })}>
              <option value="">Any</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Intake">
            <input className={inputClass} value={profile.intake ?? ""} onChange={(e) => set({ intake: e.target.value || null })} placeholder="For example Fall 2027" />
          </Field>
          <NumberField label="Budget per year (USD)" value={profile.budgetUsd} min={0} max={1000000} step={500} onCommit={(v) => set({ budgetUsd: v })} />
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold">Results and experience</h2>
          <NumberField label="GPA (4.0 scale)" value={profile.gpa} min={0} max={4} step={0.01} help="Convert your grades to a 4.0 scale." onCommit={(v) => set({ gpa: v })} />
          <Field label="Language test">
            <select
              className={inputClass}
              value={lang.test ?? ""}
              onChange={(e) => set({ language: { ...lang, test: (e.target.value || null) as "ielts" | "toefl" | null, score: null } })}
            >
              <option value="">None</option>
              <option value="ielts">IELTS</option>
              <option value="toefl">TOEFL</option>
            </select>
          </Field>
          {lang.test ? (
            <>
              <NumberField
                label={`${lang.test.toUpperCase()} score`}
                value={lang.score}
                min={0}
                max={lang.test === "ielts" ? 9 : 120}
                step={lang.test === "ielts" ? 0.5 : 1}
                onCommit={(v) => set({ language: { ...lang, score: v } })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={lang.planned} onChange={(e) => set({ language: { ...lang, planned: e.target.checked } })} className="h-4 w-4 accent-[var(--primary)]" />
                I plan to take it (no score yet)
              </label>
            </>
          ) : null}
          <fieldset>
            <legend className="text-sm font-medium">Exams</legend>
            <div className="mt-2 space-y-2">
              {KNOWN_EXAMS.map((name) => {
                const current = profile.exams.find((e) => e.name === name)?.state ?? "none";
                return (
                  <div key={name} className="flex items-center justify-between gap-3 text-sm">
                    <span>{name}</span>
                    <select aria-label={`${name} status`} className="rounded-lg border border-line bg-bg px-2 py-1.5 text-sm" value={current} onChange={(e) => setExam(name, e.target.value as ExamState | "none")}>
                      <option value="none">Not taken</option>
                      <option value="planned">Planned</option>
                      <option value="passed">Taken</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </fieldset>
          <NumberField label="Work experience (years)" value={profile.workYears} min={0} max={60} step={0.5} onCommit={(v) => set({ workYears: v })} />
          <fieldset>
            <legend className="text-sm font-medium">Application documents ready?</legend>
            <div className="mt-2 flex gap-4 text-sm">
              {([["Yes", true], ["No", false], ["Not sure", null]] as const).map(([label, val]) => (
                <label key={label} className="flex items-center gap-1.5">
                  <input type="radio" name="docs" checked={profile.documentsReady === val} onChange={() => set({ documentsReady: val })} className="accent-[var(--primary)]" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </Card>
      </div>

      <div className="mt-5">
        <Callout>Changes are saved automatically in this browser. Open a programme to see how they change your results.</Callout>
      </div>
    </div>
  );
}
