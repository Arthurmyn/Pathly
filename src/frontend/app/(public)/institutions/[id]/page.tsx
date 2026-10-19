import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstitutionView } from "@/components/institution-view";
import { getInstitution, institutions } from "@/lib/institutions";

export function generateStaticParams() {
  return institutions.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getInstitution(id)?.name ?? "Institution not found" };
}

export default async function InstitutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getInstitution(id)) notFound();
  return <InstitutionView id={id} />;
}
