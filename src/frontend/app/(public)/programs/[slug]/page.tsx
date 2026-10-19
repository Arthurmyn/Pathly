import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramView } from "@/components/program-view";
import { getProgram, getUniversity, programs } from "@/lib/mock-data";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProgram(slug);
  if (!p) return { title: "Programme not found" };
  return { title: `${p.name}, ${getUniversity(p.universityId)?.name}` };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProgram(slug)) notFound();
  return <ProgramView slug={slug} />;
}
