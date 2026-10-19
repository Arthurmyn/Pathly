import type { Metadata } from "next";
import { Catalogue } from "@/components/catalogue";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Programmes" };

export default function Programs() {
  return (
    <>
      <PageHeader title="Programmes" subtitle="Every requirement shows its source, tier and verification date. Open a programme to see what is verified and what is not." />
      <Catalogue />
    </>
  );
}
