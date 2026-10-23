import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { work, workBySlug } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { AbstractArt } from "@/components/visuals/AbstractArt";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { NotFound } from "@/pages/NotFound";

export function WorkDetail() {
  const { slug = "" } = useParams();
  const project = workBySlug(slug);

  if (!project) {
    return <NotFound />;
  }

  const index = work.findIndex((item) => item.slug === project.slug);
  const next = work[(index + 1) % work.length];

  return (
    <>
      <PageHeader
        eyebrow={project.discipline}
        title={project.title}
        intro={project.summary}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {project.year}
            </span>
            {project.sample && (
              <span className="rounded-full border border-ember/40 bg-ember/[0.07] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ember-soft">
                Sample case study
              </span>
            )}
            <Link
              to="/work"
              className="label ml-1 inline-flex items-center gap-1.5 text-muted hover:text-bone"
            >
              <ArrowLeft className="size-3" aria-hidden="true" /> All work
            </Link>
          </div>
        }
      />

      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-lg border border-line">
            <AbstractArt
              from={project.art.from}
              to={project.art.to}
              accent={project.art.accent}
              seed={project.art.seed}
              className="aspect-[16/9] md:aspect-[21/9]"
              label={`Abstract artwork for the ${project.title} case study`}
            />
          </div>
        </Reveal>
      </div>

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-3">
            <div className="space-y-8 lg:sticky lg:top-28">
              <div>
                <h2 className="label text-faint">Project</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-faint">
                      Discipline
                    </dt>
                    <dd className="mt-1 text-bone">{project.discipline}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-faint">
                      Year
                    </dt>
                    <dd className="mt-1 text-bone">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-faint">
                      Capabilities
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {project.capabilities.map((capability) => (
                        <span
                          key={capability}
                          className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
                        >
                          {capability}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            {project.sample && (
              <StatusMessage tone="info" title="Placeholder content" className="mb-10">
                This page demonstrates the case-study layout. It contains no
                real client work, quotes or metrics. Replace the project data in{" "}
                <code>src/config/site.ts</code> with verified information and
                client-approved results.
              </StatusMessage>
            )}

            <div className="space-y-14">
              <Reveal>
                <section aria-labelledby="context-heading">
                  <h2 id="context-heading" className="label text-ember">
                    Context
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-bone">
                    {project.context}
                  </p>
                </section>
              </Reveal>

              <Reveal>
                <section aria-labelledby="approach-heading">
                  <h2 id="approach-heading" className="label text-ember">
                    Approach
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-muted">
                    {project.approach}
                  </p>
                </section>
              </Reveal>

              <Reveal>
                <section aria-labelledby="outcome-heading">
                  <h2 id="outcome-heading" className="label text-ember">
                    Outcome
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-muted">
                    {project.outcome}
                  </p>
                </section>
              </Reveal>
            </div>

            <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/work"
                className="label inline-flex items-center gap-2 text-muted hover:text-bone"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to work
              </Link>
              <Link
                to={`/work/${next.slug}`}
                className="group inline-flex items-center gap-3 text-sm text-bone"
              >
                <span className="label text-faint">Next</span>
                <span className="link-underline">{next.title}</span>
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="A similar problem, or a different one?"
        intro="We like problems that need both judgement and engineering. Tell us what you are facing."
      />
    </>
  );
}
