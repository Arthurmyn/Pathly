"use client";

import Link from "next/link";
import { LEVEL_LABEL } from "@/lib/mock-data";
import { getInstitution, hostOf, programsOf } from "@/lib/institutions";
import { InstitutionTile } from "./institutions-browser";
import { EmptyState, LinkButton, Tag } from "./ui";

export function InstitutionView({ id }: { id: string }) {
  const i = getInstitution(id)!;
  const programs = programsOf(id);
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
        <p className="mt-4 text-sm text-muted">No description has been added yet. Pathly shows only what a source states.</p>
      </section>

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
    </div>
  );
}
