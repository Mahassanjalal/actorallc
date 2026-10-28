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
        eyebrow="Portfolio"
        title={
          <>
            Software that delivers <span className="serif-accent">results</span>.
          </>
        }
        intro="Ten substantial projects built for real businesses — from SaaS platforms to AI-powered tools, enterprise systems to social applications. Each project represents our commitment to engineering excellence."
        meta={
          <div className="flex flex-wrap gap-3">
            <span className="label">{work.length} projects</span>
            <span className="label">·</span>
            <span className="label">Multiple industries</span>
            <span className="label">·</span>
            <span className="label">Austin, Texas</span>
          </div>
        }
      />

      <section className="pb-20 md:pb-28" aria-label="Portfolio">
        <div className="container-page">
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {work.map((project, index) => (
              <Reveal key={project.slug} delay={index * 40}>
                <div className="p-4 sm:p-5">
                  <WorkCard project={project} index={index} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="technologies-heading">
        <div className="container-page py-16 md:py-20">
          <Reveal>
            <p className="label">Technologies we work with</p>
          </Reveal>
          <Reveal delay={60}>
            <h2
              id="technologies-heading"
              className="display-md mt-5 max-w-[24ch] text-bone"
            >
              Building with <span className="serif-accent">modern</span> stacks.
            </h2>
          </Reveal>

          <div className="mt-12 flex flex-wrap gap-6">
            {[
              "React / Next.js",
              "TypeScript",
              "Node.js / NestJS",
              "Python / FastAPI",
              "PostgreSQL / MongoDB",
              "Stripe / Payments",
              "WebRTC / Real-Time",
              "AI / ML Integration",
              "AWS / Cloud",
              "Docker / Kubernetes",
              "Expo / React Native",
              "GraphQL / REST APIs",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line px-4 py-2 text-sm text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Ready to build something great?"
        intro="We take on a limited number of engagements each quarter to ensure every project gets the attention it deserves. Tell us about your project and we will be direct about fit."
      />
    </>
  );
}
