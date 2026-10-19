import type { Metadata } from "next";
import { OnboardingPreview } from "@/components/onboarding-preview";

export const metadata: Metadata = { title: "AI onboarding" };

export default function Page() {
  return <OnboardingPreview />;
}
