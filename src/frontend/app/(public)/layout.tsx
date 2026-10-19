import { Shell } from "@/components/shell";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <Shell area="public">{children}</Shell>;
}
