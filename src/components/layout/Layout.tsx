import type { ReactNode } from "react";
import { ContentNotice } from "@/components/layout/ContentNotice";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="relative flex min-h-dvh flex-col bg-ink">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-bone px-5 py-3 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ContentNotice />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  );
}
