import type { Metadata } from "next";
import { AdvisorChat } from "@/components/advisor-chat";

export const metadata: Metadata = { title: "Advisor" };

export default function Page() {
  return <AdvisorChat />;
}
