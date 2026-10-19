import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationView } from "@/components/application-view";
import { getProgram, programs } from "@/lib/mock-data";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export const metadata: Metadata = { title: "Application" };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProgram(slug)) notFound();
  return <ApplicationView slug={slug} />;
}
