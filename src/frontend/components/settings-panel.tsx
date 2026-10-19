"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppState } from "./app-state";
import { DemoControls } from "./demo-controls";
import { Button, Card, PageHeader } from "./ui";

export function SettingsPanel() {
  const { resetDemo } = useAppState();
  const router = useRouter();
  const [days, setDays] = useState("14");
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="Settings" />
      <DemoControls />
      <Card>
        <h2 className="font-semibold">Email reminders</h2>
        <p className="mt-1 text-sm text-muted">Choose how many days before a verified deadline you want a reminder. (Planned feature; nothing is sent in this demo.)</p>
        <label className="mt-3 block text-sm font-medium">
          Remind me
          <select value={days} onChange={(e) => setDays(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm sm:w-64">
            <option value="0">Never</option>
            <option value="3">3 days before</option>
            <option value="7">7 days before</option>
            <option value="14">14 days before</option>
            <option value="30">30 days before</option>
          </select>
        </label>
      </Card>

      <Card className="border-[var(--st-conflict-bd)]">
        <h2 className="font-semibold" style={{ color: "var(--st-conflict-fg)" }}>Delete my account and data</h2>
        <p className="mt-1 text-sm text-muted">Removes your profile, shortlist, task progress and chat history. This cannot be undone.</p>
        {!confirming ? (
          <div className="mt-3"><Button variant="secondary" onClick={() => setConfirming(true)}>Delete my account and data</Button></div>
        ) : (
          <div role="alertdialog" aria-labelledby="del-title" className="mt-3 rounded-lg border border-line bg-bg p-4">
            <p id="del-title" className="font-medium">Delete everything?</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted">
              <li>Profile</li>
              <li>Shortlist and roadmap progress</li>
              <li>Chat history</li>
            </ul>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => { resetDemo(); router.push("/"); }}>Yes, delete</Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
