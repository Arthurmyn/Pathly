import { Shell } from "@/components/shell";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <Shell area="app">{children}</Shell>;
}
