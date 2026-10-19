import type { Metadata } from "next";
import { OnboardingChat } from "@/components/onboarding-chat";

export const metadata: Metadata = { title: "AI onboarding" };

export default function Page() {
  return <OnboardingChat />;
}
