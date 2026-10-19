"use client";

import Link from "next/link";
import { LEVEL_LABEL } from "@/lib/mock-data";
import { getInstitution, hostOf, institutions, programsOf } from "@/lib/institutions";
import { specialities } from "@/lib/specialities";
import { InstitutionTile } from "./institutions-browser";
import { EmptyState, LinkButton, Tag } from "./ui";

export function InstitutionView({ id }: { id: string }) {
  const i = getInstitution(id)!;
  const programs = programsOf(id);
  const same = institutions.filter((x) => x.country === i.country && x.id !== i.id && x.origin === i.origin);
  return (
    <div className="max-w-4xl">
      <div className="flex items-start gap-4">
        <InstitutionTile name={i.name} size={72} />
        <div className="min-w-0">
          <h1 className="text-[28px] font-medium leading-tight tracking-tight">{i.name}</h1>
          {i.nameRu ? <p className="text-muted">{i.nameRu}</p> : null}
          <p className="mt-1 text-sm text-muted">{i.city ? `${i.city}, ` : ""}{i.country}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {i.origin === "bolashak" ? <Tag>Bolashak 2024–2026 list, no. {i.listNo}</Tag> : <Tag>Demo university, invented data</Tag>}
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow)]" aria-labelledby="about">
        <h2 id="about" className="font-semibold">About</h2>
        <dl className="mt-3 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[9rem_1fr]">
          <dt className="text-muted">Country</dt><dd>{i.country}</dd>
          {i.city ? <><dt className="text-muted">City</dt><dd>{i.city}</dd></> : null}
          <dt className="text-muted">Website</dt>
          <dd>{i.websiteUrl ? <a href={i.websiteUrl} target="_blank" rel="noreferrer noopener" className="text-primary underline-offset-2 hover:underline">{hostOf(i.websiteUrl)}</a> : <span className="text-muted">not stored</span>}</dd>
          <dt className="text-muted">Source</dt>
          <dd>{i.origin === "bolashak" ? "List of leading foreign universities recommended to Bolashak scholarship winners for 2024–2026. Name, country and website are copied from the list." : "Invented for the Pathly demo."}</dd>
        </dl>
        <p className="mt-4 text-sm leading-relaxed">
          {i.name} is {i.city ? `a university in ${i.city}, ${i.country}` : `a university in ${i.country}`}.
          {i.origin === "bolashak"
            ? ` It is number ${i.listNo} in the list of foreign universities recommended to winners of the Bolashak international scholarship for 2024–2026, among ${same.length + 1} listed in ${i.country}.`
            : " It is a demo university with invented programmes, used to show how requirements, deadlines and sources work."}
        </p>
        <p className="mt-2 text-xs text-muted">Pathly states only what its sources state. A fuller profile of this university is not available yet.</p>
      </section>

      {i.origin === "bolashak" ? (
        <section className="mt-6 rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow)]" aria-labelledby="spec">
          <h2 id="spec" className="font-semibold">What you can study with Bolashak</h2>
          <p className="mt-1 text-sm text-muted">
            The scholarship supports {specialities.length} priority specialities in 2026, for example {specialities.slice(0, 3).map((s) => `“${s.nameRu}”`).join(", ")}. The list does not state which of them this university teaches, so check {hostOf(i.websiteUrl) ?? "its official website"}.
          </p>
          <div className="mt-3"><LinkButton href="/programs?tab=specialities" variant="secondary">See priority specialities</LinkButton></div>
        </section>
      ) : null}

      <section className="mt-6" aria-labelledby="progs">
        <h2 id="progs" className="mb-3 text-lg font-semibold">Programmes in Pathly</h2>
        {programs.length === 0 ? (
          <EmptyState title="No programmes loaded yet" action={<LinkButton href="/institutions" variant="secondary">Back to institutions</LinkButton>}>
            Pathly has no verified requirements for this university yet. Check its official website.
          </EmptyState>
        ) : (
          <ul className="space-y-3">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link href={`/programs/${p.slug}`} className="lift flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-line bg-surface p-4 shadow-[var(--shadow)] hover:border-primary">
                  <span className="font-semibold">{p.name}</span>
                  <span className="flex flex-wrap gap-2"><Tag>{LEVEL_LABEL[p.level]}</Tag><Tag>{p.field}</Tag><Tag>{p.format}</Tag></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {same.length > 0 ? (
        <section className="mt-8" aria-labelledby="more">
          <h2 id="more" className="mb-3 text-lg font-semibold">More in {i.country}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {same.slice(0, 8).map((x) => (
              <li key={x.id}><Link href={`/institutions/${x.id}`} className="block rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-medium hover:border-primary">{x.name}</Link></li>
            ))}
          </ul>
          {same.length > 8 ? <p className="mt-2 text-sm text-muted">and {same.length - 8} more. <Link href="/institutions" className="text-primary hover:underline">Browse all institutions</Link></p> : null}
        </section>
      ) : null}
    </div>
  );
}
