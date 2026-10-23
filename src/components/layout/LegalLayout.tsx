import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/PageHeader";

interface LegalLayoutProps {
  title: ReactNode;
  intro: string;
  updated: string;
  sections: Array<{ id: string; title: string }>;
  children: ReactNode;
}

export function LegalLayout({
  title,
  intro,
  updated,
  sections,
  children,
}: LegalLayoutProps) {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={title}
        intro={intro}
        meta={
          <p className="label">
            Last updated{" "}
            <time dateTime={updated} className="ml-1 text-bone">
              {formatDate(updated)}
            </time>
          </p>
        }
      />

      <section className="pb-24 md:pb-32">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav aria-label="On this page" className="lg:sticky lg:top-28">
              <h2 className="label text-faint">On this page</h2>
              <ol className="mt-4 space-y-2">
                {sections.map((section, index) => (
                  <li key={section.id} className="flex gap-2.5 text-[12px]">
                    <span className="font-mono text-[10px] text-faint" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${section.id}`}
                      className="text-muted transition-colors hover:text-bone"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="prose-actora max-w-[68ch]">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}
