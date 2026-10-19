"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { programs, universities } from "@/lib/mock-data";
import type { Settings } from "@/lib/settings";
import type { DegreeLevel } from "@/lib/types";
import { useSettingsQuery } from "@/lib/search-store";
import { useAppState } from "./app-state";
import { DemoControls } from "./demo-controls";
import { NumberField, Pills, Section, Select, SelectField, TextField, Toggle, inputClass } from "./form-controls";
import { Button, PageHeader } from "./ui";

const DEADLINE_DAYS = [30, 14, 7, 1];
const COUNTRIES = Array.from(new Set(universities.map((u) => u.country)));
const FIELDS = Array.from(new Set(programs.map((p) => p.field))).sort();
const LANGS = Array.from(new Set(programs.map((p) => p.language)));
const LEVELS: { value: DegreeLevel; label: string }[] = [
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "Doctoral / PhD" },
];

/** Demo tools only appear outside production. Set NEXT_PUBLIC_DEMO_MODE=false to hide them. */
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const NAV = [
  ["account", "Account"],
  ["notifications", "Notifications"],
  ["study", "Study preferences"],
  ["ai", "AI preferences"],
  ["privacy", "Privacy and data"],
  ...(DEMO_MODE ? [["developer", "Developer tools"]] : []),
] as const;

/** Chips for picking several values from a short list. */
function MultiChips({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((x) => x !== o.value) : [...value, o.value])}
              className={`press rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${on ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface hover:bg-surface-2"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const KEYWORDS: { [id: string]: string[] } = {
  account: ["account", "name", "email", "google", "profile"],
  notifications: ["notification", "notifications", "reminder", "deadline", "email", "roadmap", "requirement", "updates", "marketing", "days"],
  study: ["study", "study preferences", "preferences", "country", "degree", "field", "language", "budget", "currency"],
  ai: ["ai", "advisor", "answer", "citation", "language", "style", "personalised"],
  privacy: ["privacy", "data", "export", "delete", "account", "download"],
  developer: ["developer", "demo", "date", "reset", "test data"],
};

function Anchor({ id, show = true, children }: { id: string; show?: boolean; children: ReactNode }) {
  return show ? <div id={id} className="scroll-mt-6">{children}</div> : null;
}

export function SettingsPanel() {
  const { settings, updateSettings, resetDemo, ready, role, profile } = useAppState();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [typed, setTyped] = useState("");
  const [exported, setExported] = useState(false);
  const query = useSettingsQuery().trim().toLowerCase();
  const visible = (id: string) => !query || KEYWORDS[id].some((k) => k.includes(query));
  const n = settings.notifications;
  const st = settings.study;

  function exportData() {
    const data = { exportedFrom: "Pathly demo", account: settings.account, profile, settings };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathly-my-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
  }

  if (!ready) return <div className="min-h-[60vh]" aria-busy="true" />;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Changes are saved as you make them." />
      <div className="grid gap-6 lg:grid-cols-[13rem_1fr] lg:items-start">
        <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:sticky lg:top-6 lg:flex-col">
          {NAV.filter(([id]) => visible(id)).map(([id, label]) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2">{label}</a>
          ))}
        </nav>

        <div className="max-w-3xl space-y-5">
          {NAV.every(([id]) => !visible(id)) ? <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-muted">No settings match &quot;{query}&quot;.</p> : null}
          <Anchor id="account" show={visible("account")}>
            <Section title="Account" description={role === "guest" ? "You are browsing as a guest." : `Signed in as ${role}. Sign-in is simulated in this demo.`}>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Name" value={settings.account.name || null} placeholder="Your name" onChange={(v) => updateSettings("account", { name: v ?? "" })} />
                <TextField label="Email" value={settings.account.email || null} placeholder="you@example.com" onChange={(v) => updateSettings("account", { email: v ?? "" })} />
              </div>
              <div className="mt-4 border-t border-line pt-2">
                <Toggle
                  label="Google account"
                  description="Simulated: nothing is sent to Google in this demo."
                  checked={settings.account.googleConnected}
                  onChange={(v) => updateSettings("account", { googleConnected: v })}
                />
              </div>
            </Section>
          </Anchor>

          <Anchor id="notifications" show={visible("notifications")}>
            <Section title="Notifications" description="Nothing is sent in this demo; these choices are saved for when reminders are connected.">
              <Toggle label="Deadline reminders" description="For verified deadlines of programmes on your shortlist." checked={n.deadlines} onChange={(v) => updateSettings("notifications", { deadlines: v })} />
              {n.deadlines ? (
                <div className="mb-2 space-y-3 rounded-2xl bg-surface-2 p-4">
                  <MultiChips
                    label="Remind me this many days before"
                    options={DEADLINE_DAYS.map((d) => ({ value: String(d), label: d === 1 ? "1 day" : `${d} days` }))}
                    value={n.deadlineDays.map(String)}
                    onChange={(v) => updateSettings("notifications", { deadlineDays: v.map(Number).sort((a, b) => b - a) })}
                  />
                  <div className="divide-y divide-line">
                    <Toggle label="By email" checked={n.email} onChange={(v) => updateSettings("notifications", { email: v })} />
                    <Toggle label="In the app" checked={n.inApp} onChange={(v) => updateSettings("notifications", { inApp: v })} />
                  </div>
                </div>
              ) : null}
              <div className="divide-y divide-line border-t border-line">
                <Toggle label="Requirement updates" description="When a requirement of a shortlisted programme changes or becomes outdated." checked={n.requirementUpdates} onChange={(v) => updateSettings("notifications", { requirementUpdates: v })} />
                <Toggle label="Roadmap reminders" description="When a task on your roadmap is due soon." checked={n.roadmapReminders} onChange={(v) => updateSettings("notifications", { roadmapReminders: v })} />
                <Toggle label="Product updates" checked={n.productUpdates} onChange={(v) => updateSettings("notifications", { productUpdates: v })} />
                <Toggle label="Marketing emails" checked={n.marketing} onChange={(v) => updateSettings("notifications", { marketing: v })} />
              </div>
            </Section>
          </Anchor>

          <Anchor id="study" show={visible("study")}>
            <Section title="Study preferences" description="What you are looking for. These are kept apart from your Profile and are used to highlight matching programmes in the catalogue. Leave a group empty for no preference.">
              <div className="space-y-5">
                <MultiChips label="Countries" options={COUNTRIES.map((c) => ({ value: c, label: c }))} value={st.countries} onChange={(v) => updateSettings("study", { countries: v })} />
                <MultiChips label="Degree levels" options={LEVELS} value={st.levels} onChange={(v) => updateSettings("study", { levels: v as DegreeLevel[] })} />
                <MultiChips label="Fields of study" options={FIELDS.map((f) => ({ value: f, label: f }))} value={st.fields} onChange={(v) => updateSettings("study", { fields: v })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField label="Language of instruction" value={st.teachingLanguage} placeholder="Any" options={LANGS.map((l) => ({ value: l, label: l }))} onChange={(v) => updateSettings("study", { teachingLanguage: v })} />
                  <div className="text-sm font-medium">
                    <span>Currency</span>
                    <Select label="Currency" placeholder={null} value={st.currency} options={[{ value: "USD", label: "USD" }, { value: "KZT", label: "KZT" }, { value: "EUR", label: "EUR" }]} onChange={(v) => updateSettings("study", { currency: (v ?? "USD") as Settings["study"]["currency"] })} />
                  </div>
                  <NumberField label={`Budget from (${st.currency}, per year)`} value={st.budgetMin} min={0} max={10000000} step={500} onCommit={(v) => updateSettings("study", { budgetMin: v })} />
                  <NumberField label={`Budget up to (${st.currency}, per year)`} value={st.budgetMax} min={0} max={10000000} step={500} onCommit={(v) => updateSettings("study", { budgetMax: v })} />
                </div>
                <p className="text-xs text-muted">The budget range is saved but not applied yet, because programmes in the demo carry no tuition data. Your funding preference lives in the Profile.</p>
              </div>
            </Section>
          </Anchor>

          <Anchor id="ai" show={visible("ai")}>
            <Section title="AI preferences" description="How the advisor and onboarding talk to you. They never change what is verified.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Response language</p>
                  <div className="mt-2.5">
                    <Pills label="Response language" value={settings.ai.language} options={[{ value: "en", label: "English" }, { value: "ru", label: "Русский" }, { value: "kk", label: "Қазақша" }]} onChange={(v) => updateSettings("ai", { language: v })} />
                  </div>
                  {settings.ai.language !== "en" ? <p className="mt-2 text-xs text-muted">Saved. The demo advisor still answers in English.</p> : null}
                </div>
                <div>
                  <p className="text-sm font-medium">Answer style</p>
                  <div className="mt-2.5">
                    <Pills label="Answer style" value={settings.ai.style} options={[{ value: "short", label: "Short" }, { value: "detailed", label: "Detailed" }]} onChange={(v) => updateSettings("ai", { style: v })} />
                  </div>
                </div>
              </div>
              <div className="mt-3 divide-y divide-line border-t border-line">
                <Toggle label="Show source citations" description="Verified answers always keep their source; this only controls how prominent it is." checked={settings.ai.citations} onChange={(v) => updateSettings("ai", { citations: v })} />
                <Toggle label="Personalised answers" description="Use your Profile to tailor answers." checked={settings.ai.personalised} onChange={(v) => updateSettings("ai", { personalised: v })} />
                <Toggle label="Suggest alternatives" description="Mention similar programmes when one does not fit." checked={settings.ai.alternatives} onChange={(v) => updateSettings("ai", { alternatives: v })} />
              </div>
            </Section>
          </Anchor>

          <Anchor id="privacy" show={visible("privacy")}>
            <Section title="Privacy and data">
              <div className="space-y-5 text-sm">
                <div>
                  <h3 className="font-medium">How your data is used</h3>
                  <p className="mt-1 text-muted">Pathly keeps only the profile fields needed to compare you with requirements. In this demo everything stays in your browser. See the <a href="/privacy" className="underline">privacy page</a>.</p>
                </div>
                <div>
                  <h3 className="font-medium">Export my data</h3>
                  <p className="mt-1 text-muted">Download your account, profile and settings as a JSON file.</p>
                  <div className="mt-2 flex items-center gap-3">
                    <Button variant="secondary" onClick={exportData}>Export my data</Button>
                    {exported ? <span className="text-success" role="status">File downloaded.</span> : null}
                  </div>
                </div>
                <div className="rounded-2xl border border-danger/40 p-4">
                  <h3 className="font-medium text-danger">Delete my account and data</h3>
                  <p className="mt-1 text-muted">Removes your profile, shortlist, task progress and settings. This cannot be undone. In the demo this clears the browser; a real account would also be deleted on the server.</p>
                  {!confirm ? (
                    <div className="mt-3"><Button variant="secondary" onClick={() => setConfirm(true)}>Delete my account and data</Button></div>
                  ) : (
                    <div role="alertdialog" aria-labelledby="del-title" className="slide-down mt-3 rounded-xl border border-line bg-surface p-4">
                      <p id="del-title" className="font-medium">Delete everything?</p>
                      <ul className="mt-1 list-disc pl-5 text-muted">
                        <li>Profile and settings</li>
                        <li>Shortlist and roadmap progress</li>
                        <li>Chat history</li>
                      </ul>
                      <label className="mt-3 block font-medium">
                        Type DELETE to confirm
                        <input value={typed} onChange={(e) => setTyped(e.target.value)} className={inputClass} autoComplete="off" />
                      </label>
                      <div className="mt-3 flex gap-2">
                        <Button disabled={typed !== "DELETE"} onClick={() => { resetDemo(); router.push("/"); }}>Yes, delete</Button>
                        <Button variant="ghost" onClick={() => { setConfirm(false); setTyped(""); }}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          </Anchor>

          {DEMO_MODE ? (
            <Anchor id="developer" show={visible("developer")}>
              <DemoControls />
            </Anchor>
          ) : null}
        </div>
      </div>
    </div>
  );
}
