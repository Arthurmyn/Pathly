"use client";

import { useState } from "react";
import { formatDate } from "@/lib/dates";
import { describeRequired } from "@/lib/eligibility";
import { getProgram } from "@/lib/mock-data";
import { effectiveStatus, STATUS_HELP } from "@/lib/status";
import { Select } from "./form-controls";
import type { Requirement, SourceTier } from "@/lib/types";
import { useAppState } from "./app-state";
import { StatusBadge } from "./badges";
import { Button, Callout, Card, EmptyState, LinkButton, PageHeader } from "./ui";

/** A short deterministic hash so the snapshot panel looks like an archived page. Illustrative only. */
function fakeHash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0") + "…";
}

export function RequirementEditor({ id }: { id: string }) {
  const state = useAppState();
  const req = state.getRequirementById(id);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [note, setNote] = useState("");
  const [pickedTier, setTier] = useState<string | null>(null);

  if (!req) return <EmptyState title="Requirement not found" action={<LinkButton href="/admin/queue">Back to the queue</LinkButton>} />;

  const r = req;
  const tier = pickedTier ?? String(req.source?.tier ?? 1);
  const program = getProgram(r.programSlug)!;
  const status = effectiveStatus(req, state.today);
  const history = state.audit.filter((a) => a.requirementId === id);
  const snapshot = req.source ? `${req.label}: ${describeRequired(req)}` : null;

  function act(next: Parameters<typeof state.setRequirementStatus>[1]) {
    const err = state.setRequirementStatus(id, next, note);
    setMessage(err ? { kind: "error", text: err } : { kind: "ok", text: `Status changed to ${next}. The change is in the audit log.` });
    if (!err) setNote("");
  }

  function save(form: FormData) {
    const rawValue = String(form.get("value") ?? "").trim();
    const url = String(form.get("url") ?? "").trim();
    const tier = Number(form.get("tier")) as SourceTier;
    let value: Requirement["value"] = rawValue === "" ? null : rawValue;
    if (Array.isArray(r.value) && rawValue) value = rawValue.split(",").map((x) => x.trim());
    else if (rawValue !== "" && r.kind !== "exam_required" && r.kind !== "documents_ready" && !Number.isNaN(Number(rawValue))) value = Number(rawValue);
    const err = state.saveRequirement(id, { value, source: url ? { url, tier, title: r.source?.title ?? "Source added by administrator" } : null, note });
    setMessage(err ? { kind: "error", text: err } : { kind: "ok", text: "Saved as Unverified. Review the source, then mark it Verified." });
  }

  const input = "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm";

  return (
    <div>
      <PageHeader title={req.label} subtitle={`${program.name} · ${req.pathway}`} actions={<StatusBadge status={status} />} />

      {message ? <div className="mb-4"><Callout tone={message.kind === "error" ? "warn" : "info"}><span role={message.kind === "error" ? "alert" : "status"}>{message.text}</span></Callout></div> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Record</h2>
          <form key={`${req.value}-${req.source?.url}-${req.source?.tier}`} className="mt-3 space-y-3" action={save}>
            <label className="block text-sm font-medium">Value
              <input name="value" defaultValue={Array.isArray(req.value) ? req.value.join(", ") : req.value ?? ""} className={input} placeholder="Required value" />
              <span className="mt-1 block text-xs font-normal text-muted">Currently: {describeRequired(req)}</span>
            </label>
            <label className="block text-sm font-medium">Source URL
              <input name="url" defaultValue={req.source?.url ?? ""} className={input} placeholder="https://" />
            </label>
            <div className="text-sm font-medium">
              <span>Source tier</span>
              <input type="hidden" name="tier" value={tier} />
              <Select
                label="Source tier"
                placeholder={null}
                value={tier}
                options={[{ value: "1", label: "Tier 1: official page or document" }, { value: "2", label: "Tier 2: official secondary material" }, { value: "3", label: "Tier 3: third party or forum" }]}
                onChange={(v) => setTier(v ?? "1")}
              />
            </div>
            <Button type="submit" variant="secondary">Save as Unverified</Button>
          </form>
        </Card>

        <Card>
          <h2 className="font-semibold">Status</h2>
          <p className="mt-1 text-sm text-muted">{STATUS_HELP[status]}</p>
          <dl className="mt-3 grid grid-cols-[8rem_1fr] gap-y-1 text-sm">
            <dt className="text-muted">Verified on</dt><dd>{formatDate(req.verifiedAt)}</dd>
            <dt className="text-muted">Valid until</dt><dd>{formatDate(req.validUntil)}</dd>
            {status === "conflict" ? (<><dt className="text-muted">Conflict</dt><dd>{req.conflictNote}</dd></>) : null}
          </dl>
          <label className="mt-4 block text-sm font-medium">Note for the audit log
            <input value={note} onChange={(e) => setNote(e.target.value)} className={input} placeholder="What did you check?" />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => act("verified")} disabled={!req.source || req.source.tier !== 1 || req.value == null} title={!req.source || req.source.tier !== 1 ? "Only a Tier 1 source can produce Verified" : undefined}>Mark Verified</Button>
            <Button variant="secondary" onClick={() => act("stale")}>Mark Stale</Button>
            <Button variant="secondary" onClick={() => act("conflict")}>Mark Conflict</Button>
            <Button variant="ghost" onClick={() => act("unverified")}>Mark Unverified</Button>
          </div>
          {!req.source || req.source.tier !== 1 ? <p className="mt-2 text-xs text-muted">Verified is disabled until the record has a Tier 1 source and a value.</p> : null}
        </Card>

        <Card>
          <h2 className="font-semibold">Archived source snapshot</h2>
          {snapshot && req.source ? (
            <>
              <p className="mt-1 text-xs text-muted">Illustrative: Pathly stores a snapshot of the official page with a content hash, so every value can be traced to what it was verified against.</p>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-line bg-bg p-3 text-xs">{`${req.source.url}\nCaptured: ${formatDate(req.verifiedAt)}\nContent hash: ${fakeHash(req.source.url + snapshot)}\n\n“${snapshot}”`}</pre>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">No source is stored, so there is no snapshot to compare with.</p>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold">Status history</h2>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No changes recorded for this requirement in this demo.</p>
          ) : (
            <ol className="mt-3 space-y-2 text-sm">
              {history.map((h) => (
                <li key={h.id}><strong>{h.from} → {h.to}</strong> · {formatDate(h.at)} · {h.by}<br /><span className="text-muted">{h.note}</span></li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}
