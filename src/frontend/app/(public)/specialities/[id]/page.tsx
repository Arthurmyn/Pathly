import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpecialityView } from "@/components/speciality-view";
import programmes from "@/lib/data/bolashak-specialities-programmes.json";
import { getSpeciality, specialities } from "@/lib/specialities";

export function generateStaticParams() {
  return specialities.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = getSpeciality(id);
  return { title: s ? `${s.code} ${s.nameRu}` : "Speciality not found" };
}

export default async function SpecialityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getSpeciality(id);
  if (!s) notFound();
  return <SpecialityView speciality={s} programmes={(programmes as { [id: string]: string[] })[id] ?? []} />;
}
