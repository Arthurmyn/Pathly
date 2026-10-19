import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequirementEditor } from "@/components/requirement-editor";
import { getRequirement, requirements } from "@/lib/mock-data";

export function generateStaticParams() {
  return requirements.map((r) => ({ id: r.id }));
}

export const metadata: Metadata = { title: "Requirement" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getRequirement(id)) notFound();
  return <RequirementEditor id={id} />;
}
