import Link from "next/link";

/** Wordmark with a small "path" mark: a line that connects points. */
export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-semibold tracking-tight" aria-label="Pathly home">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect width="26" height="26" rx="7" fill="var(--primary)" />
        <path d="M6 18c4 0 3-8 7-8s3 5 7 5" fill="none" stroke="var(--primary-fg)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="6" cy="18" r="2" fill="var(--primary-fg)" />
        <circle cx="20" cy="15" r="2" fill="var(--primary-fg)" />
      </svg>
      <span className="text-lg">Pathly</span>
    </Link>
  );
}
