import { formatDate } from "@/lib/dates";
import type { Source } from "@/lib/types";
import { IconLink } from "./icons";

/** Source link with its tier and an absolute verification date. */
export function SourceChip({ source, date, dateLabel = "Verified" }: { source: Source | null; date: string | null; dateLabel?: string }) {
  if (!source) {
    return <span className="text-xs text-muted">No source stored</span>;
  }
  const host = source.url.replace(/^https?:\/\//, "").split("/")[0];
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
        title={source.title}
      >
        <IconLink size={12} />
        {host}
      </a>
      <span>Tier {source.tier}</span>
      {date ? <span>{dateLabel} {formatDate(date)}</span> : <span>not verified</span>}
    </span>
  );
}
