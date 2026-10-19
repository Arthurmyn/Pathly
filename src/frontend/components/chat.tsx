"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { IconSend } from "./icons";

export interface ChatMessage {
  id: number;
  from: "assistant" | "user";
  text: string;
  /** Local time of day, set when the message is sent. */
  time?: string;
  extra?: ReactNode;
}

export const nowTime = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

function Avatar({ from }: { from: ChatMessage["from"] }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${from === "assistant" ? "bg-primary text-primary-fg" : "bg-surface-2 text-ink"}`}
    >
      {from === "assistant" ? "P" : "You"}
    </span>
  );
}

/** Scrolls inside its own box, so the page and the chat frame keep their size as messages arrive. */
export function MessageList({ messages, typing, label, empty }: { messages: ChatMessage[]; typing: boolean; label: string; empty?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);
  return (
    <div ref={box} className="min-h-0 flex-1 overflow-y-auto pr-1">
      {messages.length === 0 && empty ? (
        empty
      ) : (
        <ol className="space-y-4" aria-label={label}>
          {messages.map((m) => (
            <li key={m.id} className={`pop flex items-start gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar from={m.from} />
              <div className={`max-w-[85%] ${m.from === "user" ? "items-end text-right" : ""}`}>
                <div className={`inline-block rounded-2xl px-3.5 py-2 text-left text-sm ${m.from === "user" ? "bg-primary text-primary-fg" : "bg-surface-2"}`}>{m.text}</div>
                {m.extra ? <div className="mt-2 text-left">{m.extra}</div> : null}
                <p className="mt-1 text-[11px] text-muted-2">{m.from === "assistant" ? "Pathly" : "You"}{m.time ? ` · ${m.time}` : ""}</p>
              </div>
            </li>
          ))}
          {typing ? (
            <li className="flex items-center gap-3" aria-live="polite">
              <Avatar from="assistant" />
              <span className="rounded-2xl bg-surface-2 px-3.5 py-2 text-sm text-muted">Typing…</span>
            </li>
          ) : null}
        </ol>
      )}
    </div>
  );
}

/** Fixed-height frame for a chat card. */
export const CHAT_FRAME = "flex h-[min(38rem,calc(100vh-13rem))] min-h-[28rem] flex-col";

export function Composer({ placeholder, label, button = "Send", onSend, disabled }: { placeholder: string; label: string; button?: string; onSend: (text: string) => void; disabled?: boolean }) {
  const [text, setText] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t || disabled) return;
    setText("");
    onSend(t);
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label={label}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-sm transition-colors focus:border-primary"
      />
      <button type="submit" disabled={!text.trim() || disabled} className="btn inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover disabled:opacity-50">
        {button} <IconSend size={14} />
      </button>
    </form>
  );
}

export function QuickReplies({ options, onPick, disabled }: { options: string[]; onPick: (t: string) => void; disabled?: boolean }) {
  if (options.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2" aria-label="Quick answers" role="group">
      {options.map((o) => (
        <button key={o} type="button" disabled={disabled} onClick={() => onPick(o)} className="press rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium hover:border-primary hover:bg-primary-soft disabled:opacity-50">
          {o}
        </button>
      ))}
    </div>
  );
}

/** Runs a reply after a short delay and cleans up on unmount. */
export function useDelayed() {
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  return (fn: () => void, ms = 700) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
}
