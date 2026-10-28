import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectInquiryForm } from "@/components/forms/ProjectInquiryForm";
import { Reveal } from "@/components/ui/Reveal";

const helps = [
  "What you are making, and who it is for",
  "The decision this work needs to unlock",
  "Any hard constraints: date, budget, existing stack",
  "Links to anything already in the world",
];

export function StartProject() {
  return (
    <>
      <PageHeader
        eyebrow="Start a project"
        title={
          <>
            A better first
            <br />
            <span className="serif-accent">conversation</span>.
          </>
        }
        intro="Tell us enough to be useful. The brief takes about two minutes and goes straight to the people who would do the work — no sales layer, no discovery call required."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="rounded-lg border border-line bg-ink-raised p-6 md:p-9">
                <ProjectInquiryForm />
              </div>
            </Reveal>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-10 lg:sticky lg:top-28">
              <Reveal delay={60}>
                <div>
                  <h2 className="label text-faint">What happens next</h2>
                  <ol className="mt-5 space-y-5 border-l border-line pl-5">
                    {[
                      {
                        title: "We read it",
                        body: "Within two business days, a person who would work on the project replies.",
                      },
                      {
                        title: "We get specific",
                        body: "A short call or a written response with questions, a point of view and an honest fit assessment.",
                      },
                      {
                        title: "We scope it",
                        body: "If it makes sense, you receive a clear scope, timing and investment range before any contract.",
                      },
                    ].map((step, index) => (
                      <li key={step.title} className="relative">
                        <span className="absolute -left-[1.55rem] top-1.5 size-2 rounded-full bg-ember" aria-hidden="true" />
                        <h3 className="text-sm font-medium text-bone">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                          {step.body}
                        </p>
                        <span className="sr-only">Step {index + 1}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="rounded-lg border border-line p-6">
                  <h2 className="label text-faint">What helps most</h2>
                  <ul className="mt-4 space-y-2.5">
                    {helps.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[13px] leading-snug text-muted">
                        <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 rounded-full bg-ember/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="border-t border-line pt-6">
                  <p className="text-[13px] leading-relaxed text-muted">
                    Prefer email? Write to{" "}
                    <a
                      href={`mailto:${site.email.projects}`}
                      className="link-underline text-bone"
                    >
                      {site.email.projects}
                    </a>
                    . We never share briefs outside the company.
                  </p>
                  <p className="mt-4 text-[11px] leading-relaxed text-faint">
                    By submitting a brief you agree to our{" "}
                    <Link to="/privacy" className="link-underline text-muted hover:text-bone">
                      privacy policy
                    </Link>
                    . Enquiry details are retained for up to{" "}
                    {site.legal.retentionMonths} months.
                  </p>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
