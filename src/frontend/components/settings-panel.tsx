"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { programs } from "@/lib/mock-data";
import { useSettingsQuery } from "@/lib/search-store";
import { REMINDER_DAY_OPTIONS } from "@/lib/settings";
import type { DegreeLevel } from "@/lib/types";
import { useAppState } from "./app-state";
import { DemoControls } from "./demo-controls";
import { Section, SelectField, TextField, Toggle, inputClass } from "./form-controls";
import { Button, PageHeader } from "./ui";

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
  ["privacy", "Privacy and data"],
  ...(DEMO_MODE ? [["developer", "Developer tools"]] : []),
] as const;

const KEYWORDS: { [id: string]: string[] } = {
  account: ["account", "name", "email", "profile"],
  notifications: ["notification", "notifications", "reminder", "reminders", "deadline", "email", "roadmap", "requirement", "days", "bell"],
  study: ["study", "study preferences", "preferences", "degree", "field", "language", "highlight"],
  privacy: ["privacy", "data", "export", "delete", "account", "download"],
  developer: ["developer", "demo", "date", "reset", "test data"],
};

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
            </Section>
          </Anchor>

          <Anchor id="notifications" show={visible("notifications")}>
            <Section title="Notifications">
              <Toggle label="Email reminders before a deadline" description="Your choice is saved. Emails are not sent in the demo because no email service is connected." checked={n.emailReminders} onChange={(v) => updateSettings("notifications", { emailReminders: v })} />
              {n.emailReminders ? (
                <div className="mb-3 rounded-2xl bg-surface-2 p-4">
                  <MultiChips
                    label="Remind me this many days before the deadline"
                    options={REMINDER_DAY_OPTIONS.map((d) => ({ value: String(d), label: d === 1 ? "1 day" : `${d} days` }))}
                    value={n.reminderDays.map(String)}
                    onChange={(v) => updateSettings("notifications", { reminderDays: v.map(Number).sort((a, b) => b - a) })}
                  />
                </div>
              ) : null}
              <div className="divide-y divide-line border-t border-line">
                <Toggle label="Notifications in the app" description="Shows the bell with reminders, requirement changes and tasks due soon. The same days apply to deadline notices." checked={n.inApp} onChange={(v) => updateSettings("notifications", { inApp: v })} />
                <Toggle label="Requirement updates" description="When a requirement of a programme you applied to changes or becomes outdated." checked={n.requirementUpdates} onChange={(v) => updateSettings("notifications", { requirementUpdates: v })} />
                <Toggle label="Roadmap reminders" description="When a task on your roadmap is due within two weeks." checked={n.roadmapReminders} onChange={(v) => updateSettings("notifications", { roadmapReminders: v })} />
              </div>
            </Section>
          </Anchor>

          <Anchor id="study" show={visible("study")}>
            <Section title="Study preferences" description="What you are looking for. Programmes that fit get a “Matches your preferences” tag in the catalogue. Your target countries are set in the Profile. Leave a group empty for no preference.">
              <div className="space-y-5">
                <MultiChips label="Degree levels" options={LEVELS} value={st.levels} onChange={(v) => updateSettings("study", { levels: v as DegreeLevel[] })} />
                <MultiChips label="Fields of study" options={FIELDS.map((f) => ({ value: f, label: f }))} value={st.fields} onChange={(v) => updateSettings("study", { fields: v })} />
                <div className="max-w-xs">
                  <SelectField label="Language of instruction" value={st.teachingLanguage} placeholder="Any" options={LANGS.map((l) => ({ value: l, label: l }))} onChange={(v) => updateSettings("study", { teachingLanguage: v })} />
                </div>
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
