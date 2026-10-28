import { site, values } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="About the company"
        title={
          <>
            A company for software that has to{" "}
            <span className="serif-accent">matter</span>.
          </>
        }
        intro="Actora is a software and technology company in Austin, Texas. We work with businesses that need custom software solutions — and who are ready to make the decisions that transforms their operations."
      />

      <section className="section border-t border-line">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="label">Who we are</p>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <div className="grid gap-10 md:grid-cols-2">
              <Reveal delay={40}>
                <div className="space-y-5 text-[0.95rem] leading-relaxed text-muted">
                  <p className="text-lg leading-relaxed text-bone">
                    We build custom software that solves real business problems.
                    From internal tools to customer-facing applications, we create
                    solutions that streamline operations and drive growth.
                  </p>
                  <p>
                    Our work starts with understanding your business. What workflows
                    need automation? What data needs better management? What would
                    make your team more effective? The answers become the requirements,
                    and the requirements keep the project focused.
                  </p>
                  <p>
                    From there we architect and build — database design, API development,
                    front-end interfaces, and deployment pipelines — so the software
                    that ships is the solution you needed.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="space-y-6">
                  <figure className="rounded-lg border border-line bg-ink-raised p-7">
                    <blockquote className="serif text-2xl leading-[1.35] text-bone">
                      “Good software should feel inevitable — as though it could not
                      reasonably have been anything else.”
                    </blockquote>
                    <figcaption className="label mt-6 text-faint">
                      Actora — engineering principle
                    </figcaption>
                  </figure>
                  <dl className="grid grid-cols-2 gap-6">
                    <div>
                      <dt className="label text-faint">Based in</dt>
                      <dd className="mt-2 text-sm text-bone">
                        {site.austin.locality}, {site.austin.regionName}
                      </dd>
                    </div>
                    <div>
                      <dt className="label text-faint">Services</dt>
                      <dd className="mt-2 text-sm text-bone">
                        Custom Software, Web Apps, Enterprise Solutions
                      </dd>
                    </div>
                    <div>
                      <dt className="label text-faint">Working with</dt>
                      <dd className="mt-2 text-sm text-bone">
                        Founders and in-house teams
                      </dd>
                    </div>
                    <div>
                      <dt className="label text-faint">Enquiries</dt>
                      <dd className="mt-2 text-sm">
                        <a
                          href={`mailto:${site.email.general}`}
                          className="link-underline text-bone hover:text-ember-soft"
                        >
                          {site.email.general}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="values-heading">
        <div className="container-page">
          <Reveal>
            <p className="label">What we hold to</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 id="values-heading" className="display-md mt-5 max-w-[20ch] text-bone">
              Values that change the <span className="serif-accent">work</span>.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 60}>
                <div className="h-full bg-ink-raised p-7 md:p-9">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ember">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-xl tracking-[-0.025em] text-bone">
                    {value.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                    {value.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="team-heading">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="label">Team</p>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal delay={50}>
              <h2 id="team-heading" className="display-md max-w-[20ch] text-bone">
                Senior engineers, <span className="serif-accent">close</span> to the
                code.
              </h2>
            </Reveal>

            {site.team.length > 0 ? (
              <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {site.team.map((member) => (
                  <li key={member.name} className="border-t border-line pt-5">
                    <h3 className="text-lg text-bone">{member.name}</h3>
                    <p className="label mt-2">{member.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {member.bio}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-10 rounded-lg border border-dashed border-line-strong bg-ink-raised/60 p-7">
                <p className="text-sm leading-relaxed text-muted">
                  Team profiles will appear here once the company supplies names,
                  roles and approved photography. Add them to{" "}
                  <code className="rounded border border-line bg-surface px-1.5 py-0.5 text-[12px] text-bone">
                    src/config/site.ts
                  </code>{" "}
                  — no names or credentials have been invented.
                </p>
              </div>
            )}

            <div className="mt-12 border-t border-line pt-8">
              <p className="lede max-w-2xl">
                We keep engagements focused on purpose. The engineers in the first
                conversation are the engineers doing the work.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Let's build software that works."
        intro="If you need custom software, a web application, or help modernizing your systems, we would like to hear about it."
      />
    </>
  );
}
