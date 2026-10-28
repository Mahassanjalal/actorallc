import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { process, services } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

export function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Software that solves
            <br />
            <span className="serif-accent">real problems</span>.
          </>
        }
        intro="Four disciplines, delivered as one engagement. We scope around your business needs, not a menu of technical deliverables."
        meta={
          <ul className="flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <a
                  href={`#${service.slug}`}
                  className="inline-flex rounded-full border border-line px-3.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-line-strong hover:text-bone"
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        }
      />

      <div className="container-page">
        {services.map((service) => (
          <section
            key={service.slug}
            id={service.slug}
            aria-labelledby={`${service.slug}-heading`}
            className="scroll-mt-28 border-t border-line py-14 md:py-20"
          >
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <Reveal>
                  <div>
                    <span className="font-mono text-[11px] tracking-[0.18em] text-ember">
                      {service.index}
                    </span>
                    <h2
                      id={`${service.slug}-heading`}
                      className="display-md mt-4 text-bone"
                    >
                      {service.title}
                    </h2>
                    <p className="mt-5 max-w-[24ch] text-[13px] leading-relaxed text-faint">
                      {service.idealFor}
                    </p>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-5">
                <Reveal delay={60}>
                  <div>
                    <p className="text-lg leading-relaxed text-bone">
                      {service.summary}
                    </p>
                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
                      {service.description.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                      ))}
                    </div>
                    <Button
                      to={`/start-a-project?service=${service.slug}`}
                      variant="secondary"
                      size="md"
                      className="mt-8"
                      showArrow
                    >
                      Discuss a {service.title.toLowerCase()} project
                    </Button>
                  </div>
                </Reveal>
              </div>

              <aside className="lg:col-span-3">
                <Reveal delay={120}>
                  <div className="rounded-lg border border-line bg-ink-raised p-6">
                    {service.technologies && (
                      <div className="mb-5">
                        <h3 className="label text-faint">Technologies</h3>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {service.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-line/60 bg-surface/50 px-2.5 py-1 text-[11px] text-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <h3 className="label text-faint">Outcomes</h3>
                    <ul className="mt-4 space-y-3">
                      {service.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="flex gap-2.5 text-[13px] leading-snug text-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[7px] size-1 shrink-0 rounded-full bg-ember/70"
                          />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                    <h3 className="label mt-7 text-faint">Deliverables</h3>
                    <ul className="mt-4 space-y-2">
                      {service.deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="border-t border-line pt-2 text-[13px] leading-snug text-muted first:border-0 first:pt-0"
                        >
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </aside>
            </div>
          </section>
        ))}
      </div>

      <section className="section border-t border-line" aria-labelledby="engagement-heading">
        <div className="container-page">
          <Reveal>
            <p className="label">Working together</p>
          </Reveal>
          <Reveal delay={50}>
            <h2
              id="engagement-heading"
              className="display-md mt-5 max-w-[22ch] text-bone"
            >
              Four phases. No black <span className="serif-accent">boxes</span>.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <Reveal key={step.index} delay={index * 50}>
                <div className="h-full bg-ink-raised p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-[0.18em] text-ember">
                      {step.index}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      {step.duration}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg tracking-[-0.02em] text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              Not sure which of these you need? Start with the brief. We will
              tell you what we think the real work is — even if that is less than
              you expected.
            </p>
            <Link
              to="/start-a-project"
              className="label inline-flex shrink-0 items-center gap-2 text-bone hover:text-ember-soft"
            >
              Start a project
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Which discipline is the real problem?"
        intro="Send us the situation, not a scope. We will help you find the smallest engagement that answers it."
      />
    </>
  );
}
