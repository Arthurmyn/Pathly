import type { Metadata } from "next";
import { InstitutionsBrowser } from "@/components/institutions-browser";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Institutions" };

export default function Institutions() {
  return (
    <>
      <PageHeader title="Institutions" subtitle="Universities with their country and official website. Open one to see which programmes Pathly has data for." />
      <InstitutionsBrowser />
    </>
  );
}
