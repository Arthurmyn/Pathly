"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { specialities } from "@/lib/specialities";
import { programs } from "@/lib/mock-data";
import { Catalogue } from "./catalogue";
import { PillTabs } from "./pill-tabs";
import { SpecialitiesBrowser } from "./specialities-browser";

type Tab = "programmes" | "specialities";

/** Programmes with requirements, and the Bolashak priority specialities, on one page. */
export function ProgrammesHub() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(params.get("tab") === "specialities" ? "specialities" : "programmes");
  return (
    <div>
      <div className="mb-5">
        <PillTabs<Tab>
          label="Programme sections"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "programmes", label: "Programmes with requirements", count: programs.length },
            { id: "specialities", label: "Bolashak priority specialities", count: specialities.length },
          ]}
        />
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "programmes" ? <Catalogue /> : <SpecialitiesBrowser />}
      </div>
    </div>
  );
}
