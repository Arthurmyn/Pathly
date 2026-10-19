"use client";

import { useState } from "react";
import { formatDate } from "@/lib/dates";
import { mockAdvisorReply, type AdvisorReply } from "@/lib/mock-chat";
import { programs } from "@/lib/mock-data";
import { useAppState } from "./app-state";
import { StatusBadge } from "./badges";
import { Select } from "./form-controls";
import { CHAT_FRAME, Composer, MessageList, QuickReplies, nowTime, useDelayed, type ChatMessage } from "./chat";
import { IconLink, IconShieldCheck } from "./icons";
import { Button, Card, EmptyState, LinkButton, PageHeader } from "./ui";

const SUGGESTED = ["What TOEFL score do I need?", "What GPA is required?", "Which exams do I need?", "How much work experience do they want?"];

export function AdvisorChat() {
  const { shortlist, today, requirementsFor, requests, requestVerification, ready } = useAppState();
  const [slug, setSlug] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  // One conversation per programme, so switching the context shows that programme's own thread.
  const [threads, setThreads] = useState<{ [slug: string]: ChatMessage[] }>({});
  const later = useDelayed();
  if (!ready) return <div className="min-h-[60vh]" aria-busy="true" />;

  const applications = shortlist.map((s) => programs.find((p) => p.slug === s)).filter((p): p is (typeof programs)[number] => !!p);
  if (applications.length === 0) {
    return (
      <div>
        <PageHeader title="Advisor" subtitle="Answers use verified records only and always show their source." />
        <EmptyState title="Add a programme to your applications first" action={<LinkButton href="/programs">Browse programmes</LinkButton>}>
          The advisor answers questions about the programmes you applied to, so it needs at least one.
        </EmptyState>
      </div>
    );
  }
  const current = slug && shortlist.includes(slug) ? slug : applications[0].slug;
  const program = applications.find((p) => p.slug === current)!;
  const messages = threads[current] ?? [];
  const addMessage = (to: string, m: Omit<ChatMessage, "id">) => setThreads((t) => ({ ...t, [to]: [...(t[to] ?? []), { ...m, id: (t[to]?.length ?? 0) + 1 }] }));

  function reply(r: AdvisorReply, id: number): ChatMessage {
    const extra = (
      <>
        {r.source ? (
          <div className="rounded-xl border border-line bg-surface p-3 text-sm">
            <p className="flex items-center gap-1.5 font-medium"><IconShieldCheck size={14} /> Source</p>
            <p className="mt-1 text-muted">&quot;{r.source.label}: {r.source.quote}&quot;</p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1 text-primary"><IconLink size={12} /> {r.source.host}</span>
              <span>Tier {r.source.tier}</span>
              <span>Verified {formatDate(r.source.verifiedAt)}</span>
              <StatusBadge status="verified" />
            </p>
          </div>
        ) : null}
        {r.refusal && r.requirementId ? <RequestButton id={r.requirementId} /> : null}
      </>
    );
    return { id, from: "assistant", text: r.text, time: nowTime(), extra: r.source || (r.refusal && r.requirementId) ? extra : undefined };
  }

  function RequestButton({ id }: { id: string }) {
    const sent = requests.includes(id);
    return (
      <Button variant="secondary" disabled={sent} onClick={() => requestVerification(id)}>
        {sent ? "Verification requested" : "Request verification"}
      </Button>
    );
  }

  function ask(text: string) {
    const to = current;
    addMessage(to, { from: "user", text, time: nowTime() });
    setTyping(true);
    later(() => {
      const r = mockAdvisorReply(text, requirementsFor(to), program.name, today);
      setTyping(false);
      const m = reply(r, 0);
      addMessage(to, { from: m.from, text: m.text, time: m.time, extra: m.extra });
    }, 800);
  }

  return (
    <div>
      <PageHeader title="Advisor" subtitle="Answers use verified records only and always show their source. If there is no verified source, the advisor says so." />
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
        <Card className={CHAT_FRAME}>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-medium">
            <span>Context</span>
            <Select
              variant="pill"
              label="Context programme"
              placeholder={null}
              value={current}
              options={applications.map((p) => ({ value: p.slug, label: p.name }))}
              onChange={(v) => setSlug(v)}
            />
          </div>
          <MessageList
            messages={messages}
            typing={typing}
            label="Conversation"
            empty={<p className="rounded-2xl bg-surface-2 px-4 py-3 text-sm">Ask about a requirement of <strong>{program.name}</strong>. I answer from verified records and show where each answer comes from.</p>}
          />
          <div className="mt-4 space-y-3 border-t border-line pt-4">
            <QuickReplies options={SUGGESTED} onPick={ask} disabled={typing} />
            <Composer label="Question" placeholder="Ask about a requirement" button="Ask" onSend={ask} disabled={typing} />
            <p className="text-xs text-muted">Replies are scripted in this demo. Answers use verified records only.</p>
          </div>
        </Card>
        <Card className="text-sm">
          <h2 className="font-semibold">How answers work</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>Only Verified records are used as facts.</li>
            <li>Every answer cites its source and date.</li>
            <li>Outdated, missing or conflicting data is named as such.</li>
            <li>No guesses about deadlines or rules, and no chance-of-admission numbers.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
