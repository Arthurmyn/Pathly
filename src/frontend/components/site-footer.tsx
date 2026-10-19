import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
        <p>Pathly · Diploma project, Astana IT University. Pathly does not submit applications and does not predict admission.</p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link href="/how-it-works" className="hover:text-ink">How it works</Link>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
