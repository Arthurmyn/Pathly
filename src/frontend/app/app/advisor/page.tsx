import type { Metadata } from "next";
import { AdvisorPreview } from "@/components/advisor-preview";

export const metadata: Metadata = { title: "Advisor" };

export default function Page() {
  return <AdvisorPreview />;
}
