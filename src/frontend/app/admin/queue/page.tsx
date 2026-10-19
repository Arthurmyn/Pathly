import type { Metadata } from "next";
import { AdminQueue } from "@/components/admin-queue";

export const metadata: Metadata = { title: "Verification queue" };

export default function Page() {
  return <AdminQueue />;
}
