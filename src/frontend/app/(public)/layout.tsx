import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="content" className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
