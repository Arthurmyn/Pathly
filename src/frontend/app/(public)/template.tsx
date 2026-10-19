/** Re-mounts on every navigation, so the page content (not the sidebar) plays a short entrance. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="enter">{children}</div>;
}
