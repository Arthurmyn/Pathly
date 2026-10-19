import type { ComponentType } from "react";
import { IconCalendar, IconCap, IconChecklist, IconSeal, IconShieldCheck } from "./icons";

export interface Station {
  title: string;
  text: string;
  icon: ComponentType<{ size?: number }>;
}

/** The five stations of an applicant's admission route, shared by the home page and the sign-up page. */
export const STATIONS: Station[] = [
  { title: "Profile", text: "Degree, GPA, language test and exams in your own words.", icon: IconCap },
  { title: "Requirements", text: "Every requirement with its source, tier and verification date.", icon: IconShieldCheck },
  { title: "Gaps", text: "Met, Not met, Pending or Unknown, with the rule behind each.", icon: IconChecklist },
  { title: "Roadmap", text: "Tasks dated back from a verified deadline.", icon: IconCalendar },
  { title: "Official website", text: "You submit there. Pathly never does it for you.", icon: IconSeal },
];

/** Horizontal route on wide screens, vertical on narrow ones. */
export function RouteStrip() {
  return (
    <ol className="stagger relative grid gap-8 lg:grid-cols-5 lg:gap-6" aria-label="Admission route">
      <span className="absolute left-[23px] top-6 h-[calc(100%-3rem)] w-[3px] rounded-full bg-line lg:left-6 lg:right-6 lg:top-[23px] lg:h-[3px] lg:w-auto" aria-hidden="true" />
      {STATIONS.map((s, i) => {
        const Icon = s.icon;
        return (
          <li key={s.title} className="relative flex items-start gap-5 lg:block">
            <span className={`relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] ${i === 0 ? "border-primary bg-primary text-primary-fg" : "border-strong bg-sheet text-ink"}`}>
              <Icon size={20} />
            </span>
            <div className="lg:mt-5">
              <p className="text-lg font-medium leading-tight text-heading">{s.title}</p>
              <p className="mt-1.5 max-w-[16rem] text-[15px] leading-snug text-muted">{s.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
