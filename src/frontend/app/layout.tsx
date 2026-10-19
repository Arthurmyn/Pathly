import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { AppStateProvider } from "@/components/app-state";
import "./globals.css";

const onest = Onest({ variable: "--font-onest", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: { default: "Pathly", template: "%s · Pathly" },
  description:
    "Verified admission requirements, an honest eligibility check and a step-by-step plan for higher-education programmes in Kazakhstan and abroad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.variable}>
      <body className="min-h-screen">
        <AppStateProvider>
          {children}
        </AppStateProvider>
      </body>
    </html>
  );
}
