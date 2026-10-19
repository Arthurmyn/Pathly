import type { Metadata } from "next";
import { Suspense } from "react";
import { ProgrammesHub } from "@/components/programmes-hub";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Programmes" };

export default function Programs() {
  return (
    <>
      <PageHeader title="Programmes" subtitle="Programmes with verified requirements, and the priority specialities of the Bolashak scholarship." />
      <Suspense fallback={<p className="text-sm text-muted" aria-busy="true">Loading programmes…</p>}>
        <ProgrammesHub />
      </Suspense>
    </>
  );
}
