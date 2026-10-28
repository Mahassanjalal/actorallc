import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { insights } from "@/lib/insights";
import { process, site, work } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroObject } from "@/components/visuals/HeroObject";
import { WorkCard } from "@/components/cards/WorkCard";
import { InsightCard } from "@/components/cards/InsightCard";
import { ServiceExplorer } from "@/components/sections/ServiceExplorer";
import { Mark } from "@/components/visuals/Mark";

const principles = [
  {
    index: "A",
    title: "Engineered",
    body: "We build software with performance, security, and maintainability at its core — not as afterthoughts.",
  },
  {
    index: "B",
    title: "Scalable",
    body: "Architecture that grows with your business. Systems designed to handle increased load and evolving requirements.",
  },
  {
    index: "C",
    title: "Reliable",
    body: "Thoroughly tested, well-documented software your team can depend on and extend with confidence.",
  },
];

export function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div aria-hidden="true" className="absolute inset-0 aurora opacity-90" />
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-lines opacity-60"
        />
        <div className="container-page relative grid gap-14 pb-16 pt-14 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-20">
          <div className="lg:col-span-7">
            <p className="fade-up label">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              Software & Technology — {site.austin.locality}, {site.austin.region}
            </p>

            <h1
              id="hero-title"
              className="hero-rise display-xl mt-7 text-bone"
            >
              <span className="rise-line">
                <span className="rise-unit">{site.headline.lead}</span>
              </span>
              <span className="rise-line">
                <span className="rise-unit delay-1">
                  <span className="serif-accent">{site.headline.serif}</span>
                  <span className="text-ember">{site.headline.tail}</span>
                </span>
              </span>
            </h1>

            <p className="fade-up lede mt-8 max-w-xl">{site.heroSupport}</p>

            <div className="fade-up mt-10 flex flex-col gap-3 sm:flex-row">
              <Button to="/start-a-project" size="lg" showArrow>
                Start a project
              </Button>
              <Button to="/work" variant="secondary" size="lg">
                Explore our work
              </Button>
            </div>

            <dl className="fade-up mt-14 grid max-w-xl grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-3">
              <div>
                <dt className="label text-faint">Studio</dt>
                <dd className="mt-2 text-sm text-bone">
                  {site.austin.locality}, {site.austin.region}
                </dd>
              </div>
              <div>
                <dt className="label text-faint">Practice</dt>
                <dd className="mt-2 text-sm text-bone">
                  Custom Software, Web Apps, Enterprise Solutions
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="label text-faint">Next step</dt>
                <dd className="mt-2 text-sm">
                  <Link
                    to="/start-a-project"
                    className="link-underline text-bone hover:text-ember-soft"
                  >
                    Send a brief
                  </Link>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5">
            <HeroObject className="mx-auto max-w-[26rem] lg:max-w-[34rem]" />
          </div>
        </div>

        <div className="container-page relative hidden pb-6 lg:block">
          <a
            href="#approach"
            className="label inline-flex items-center gap-2 text-faint transition-colors hover:text-bone"
          >
            <ArrowDown className="size-3.5" aria-hidden="true" />
            Scroll to explore
          </a>
        </div>
      </section>

      <Marquee
        items={[
          "Custom Software Development",
          "Web Applications",
          "Enterprise Solutions",
          "Digital Transformation",
          "API Development",
          "Cloud Infrastructure",
        ]}
      />

      {/* --------------------------------------------------------- manifesto */}
      <section id="approach" className="section border-t border-line">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="label">
                <span className="font-mono text-ember" aria-hidden="true">
                  01
                </span>
                Point of view
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal delay={60}>
              <p className="display-md max-w-[26ch] text-bone">
                {site.statement}
              </p>
            </Reveal>

            <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
              {principles.map((principle, index) => (
                <Reveal key={principle.title} delay={index * 80}>
                  <div>
                    <span className="font-mono text-[11px] tracking-[0.18em] text-faint">
                      {principle.index}
                    </span>
                    <h3 className="mt-4 text-lg tracking-[-0.02em] text-bone">
                      {principle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {principle.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- work */}
      <section className="section border-t border-line" aria-labelledby="work-heading">
        <div className="container-page">
          <SectionHeading
            id="work-heading"
            index="02"
            eyebrow="Selected work"
            title={
              <>
                Software that transforms <span className="serif-accent">businesses</span>.
              </>
            }
            intro="A small, deliberately varied selection. Each project is shown with the technical decisions and business impact, not just the final product."
            action={{ label: "All work", href: "/work" }}
          />

          <div className="mt-16 space-y-16 md:space-y-24">
            {work.map((project, index) => (
              <Reveal key={project.slug} delay={index * 40}>
                <WorkCard project={project} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- services */}
      <section className="section border-t border-line" aria-labelledby="services-heading">
        <div className="container-page">
          <SectionHeading
            id="services-heading"
            index="03"
            eyebrow="What we do"
            title={
              <>
                Four disciplines,
                <br />
                one <span className="serif-accent">integrated</span> practice.
              </>
            }
            intro="Discovery, design, development and deployment are not silos here. They are one continuous engagement, from requirements to production support."
            action={{ label: "Services", href: "/services" }}
          />

          <div className="mt-14">
            <ServiceExplorer />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- process */}
      <section className="section border-t border-line" aria-labelledby="process-heading">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="label">
                  <span className="font-mono text-ember" aria-hidden="true">
                    04
                  </span>
                  How we work
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h2
                  id="process-heading"
                  className="display-md mt-5 max-w-[14ch] text-bone"
                >
                  A process built for <span className="serif-accent">clarity</span>.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="lede mt-6 max-w-sm">
                  Short cycles, visible decisions and working software. You
                  always know where the project stands.
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="lg:col-span-8">
            {process.map((step, index) => (
              <Reveal key={step.index} as="li" delay={index * 60}>
                <div className="grid gap-6 border-t border-line py-8 sm:grid-cols-[auto_1fr] sm:gap-10 sm:py-10">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ember">
                    {step.index}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-xl tracking-[-0.025em] text-bone">
                        {step.title}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                        {step.duration}
                      </span>
                    </div>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="text-[11px] uppercase tracking-[0.1em] text-faint"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- insights */}
      {insights.length > 0 && (
        <section className="section border-t border-line" aria-labelledby="insights-heading">
          <div className="container-page">
            <SectionHeading
              id="insights-heading"
              index="05"
              eyebrow="Insights"
              title={
                <>
                  Insights on <span className="serif-accent">software</span>.
                </>
              }
              intro="Technical writing about software development, architecture decisions, and the technology landscape — from our engineering team."
              action={{ label: "All insights", href: "/insights" }}
            />

            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {insights.slice(0, 3).map((article, index) => (
                <Reveal key={article.slug} delay={index * 70}>
                  <InsightCard article={article} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------------- cta */}
      <section className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="absolute inset-0 aurora opacity-80" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        >
          <Mark className="size-[34rem]" ring={false} />
        </div>
        <div className="container-page relative py-24 text-center md:py-36">
          <Reveal>
            <p className="label justify-center">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              Next
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display mx-auto mt-6 max-w-[18ch] text-bone">
              Have something ambitious in mind?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lede mx-auto mt-7 max-w-xl">
              Tell us where you are trying to go. We will reply with an honest
              read on fit, timing and the next useful step.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/start-a-project" size="lg" showArrow>
                Start a project
              </Button>
              <Button href={`mailto:${site.email.projects}`} variant="secondary" size="lg">
                {site.email.projects}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
