"use client";

import { useState } from "react";
import { completeness, profileFields, type FieldGroup } from "@/lib/profile-fields";
import { mockOnboardingReply, nextQuestion } from "@/lib/mock-chat";
import type { Profile } from "@/lib/types";
import { useAppState } from "./app-state";
import { CHAT_FRAME, Composer, MessageList, QuickReplies, nowTime, useDelayed, type ChatMessage } from "./chat";
import { IconPencil } from "./icons";
import { ProgressRing } from "./rail";
import { Card, LinkButton, PageHeader } from "./ui";

const GROUPS: FieldGroup[] = ["Education", "Study goals", "Test scores and budget", "Work and documents"];

const QUICK: { [key: string]: string[] } = {
  degree: ["I finished high school", "I have a Bachelor's degree", "I have a Master's degree"],
  target: ["I want a Master's", "I want a Bachelor's", "I want a PhD"],
  country: ["United States", "Kazakhstan"],
  gpa: ["My GPA is 3.5", "My GPA is 3.0"],
  language: ["IELTS 6.5", "TOEFL 96", "I have not taken a test yet"],
  intake: ["Fall 2027", "Spring 2027"],
  budget: ["$30,000 per year", "$15,000 per year"],
  work: ["2 years of work experience", "No work experience"],
};

export function OnboardingChat() {
  const { profile, updateProfile, ready } = useAppState();
  if (!ready) return <div className="min-h-[60vh]" aria-busy="true" />;
  return <Chat profile={profile} updateProfile={updateProfile} />;
}

function Chat({ profile, updateProfile }: { profile: Profile; updateProfile: (p: Partial<Profile>) => void }) {
  const later = useDelayed();
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 1, from: "assistant", text: `Hi! Tell me about your studies and what you want to study next. ${nextQuestion(profile)}` },
  ]);

  const fields = profileFields(profile);
  const { filled, total, percent } = completeness(profile);
  const firstGap = fields.find((f) => f.value == null);
  const quick = firstGap ? QUICK[firstGap.key] ?? [] : [];

  function send(text: string) {
    setMessages((m) => [...m, { id: m.length + 1, from: "user", text, time: nowTime() }]);
    setTyping(true);
    later(() => {
      const { patch, reply } = mockOnboardingReply(text, profile);
      if (Object.keys(patch).length) updateProfile(patch);
      setTyping(false);
      setMessages((m) => [...m, { id: m.length + 1, from: "assistant", text: reply, time: nowTime() }]);
    });
  }

  function askAbout(label: string) {
    setMessages((m) => [...m, { id: m.length + 1, from: "assistant", text: `Please tell me your ${label.toLowerCase()}.`, time: nowTime() }]);
  }

  return (
    <div>
      <PageHeader title="AI onboarding" subtitle="Describe your background in your own words. Your profile fills in on the right and you can edit every field." />

      <div className="mb-5 rounded-[20px] border border-line bg-surface p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="font-medium">Profile setup · {filled} of {total} fields collected</p>
          <p className="font-semibold tabular-nums">{percent}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Profile setup" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="bar-reveal h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-start">
        <Card className={CHAT_FRAME}>
          <MessageList messages={messages} typing={typing} label="Conversation" />
          <div className="mt-4 space-y-3 border-t border-line pt-4">
            <QuickReplies options={quick} onPick={send} disabled={typing} />
            <Composer label="Your answer" placeholder="Type your answer, for example “GPA 3.5, IELTS 6.5, Fall 2027”" onSend={send} disabled={typing} />
            <p className="text-xs text-muted">Replies are scripted in this demo. We only keep fields needed to match requirements.</p>
          </div>
        </Card>

        <aside aria-label="Your profile" className="space-y-4">
          <Card>
            <div className="flex items-center gap-4">
              <ProgressRing percent={percent} size={60} />
              <div>
                <h2 className="font-semibold">Your profile</h2>
                <p className="text-sm text-muted">{filled} of {total} fields</p>
              </div>
            </div>
            <div className="mt-4 space-y-5">
              {GROUPS.map((g) => (
                <div key={g}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium uppercase tracking-[0.08em] text-muted">{g}</h3>
                    <LinkButton href="/app/profile" variant="ghost" className="!min-h-8 !px-2 !py-1 !text-xs">
                      <IconPencil size={13} /> Edit
                    </LinkButton>
                  </div>
                  <dl className="mt-1 divide-y divide-line text-sm">
                    {fields.filter((f) => f.group === g).map((f) => (
                      <div key={f.key} className="flex items-center justify-between gap-3 py-2">
                        <dt className="text-muted">{f.label}</dt>
                        <dd className="text-right">
                          {f.value ? (
                            <span className="font-medium">{f.value}</span>
                          ) : (
                            <button type="button" onClick={() => askAbout(f.label)} disabled={typing} className="text-muted-2 hover:text-primary">
                              Not provided yet · <span className="underline">Add answer</span>
                            </button>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <LinkButton href="/app/profile">Edit profile</LinkButton>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
