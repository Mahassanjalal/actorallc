import { work } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/cards/WorkCard";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function Work() {
  const hasSamples = work.some((project) => project.sample);

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title={
          <>
            Built to be <span className="serif-accent">remembered</span>.
          </>
        }
        intro="A deliberately small selection of brand, product and platform work. Each case study focuses on the decisions, not just the outcome."
        meta={
          <p className="label">
            {String(work.length).padStart(2, "0")} projects · Austin, Texas
          </p>
        }
      />

      <section className="pb-20 md:pb-28" aria-label="Case studies">
        <div className="container-page">
          {hasSamples && (
            <div className="mb-14">
              <StatusMessage tone="info" title="Sample case studies">
                The projects below are layout samples, not client engagements.
                Replace them in <code>src/config/site.ts</code> with verified
                project details before launch.
              </StatusMessage>
            </div>
          )}

          {work.length > 0 ? (
            <div className="space-y-16 md:space-y-24">
              {work.map((project, index) => (
                <Reveal key={project.slug} delay={index * 40}>
                  <WorkCard project={project} index={index} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-line-strong py-20 text-center">
              <p className="serif text-2xl text-bone">Work in progress.</p>
              <p className="mt-3 text-sm text-muted">
                Case studies will appear here once client approvals are in place.
              </p>
            </div>
          )}
        </div>
      </section>

      <ClosingCTA
        title="Your project could be next."
        intro="We take on a small number of engagements at a time. Tell us what you are building and we will be direct about fit."
      />
    </>
  );
}
