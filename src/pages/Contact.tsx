import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Tell us what you are{" "}
            <span className="serif-accent">building</span>.
          </>
        }
        intro="A few sentences are enough to start. We read every enquiry and reply within two business days — including when the answer is no."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="label text-faint">Email</h2>
                  <ul className="mt-4 space-y-3">
                    <li>
                      <a
                        href={`mailto:${site.email.general}`}
                        className="group inline-flex items-start gap-3 text-bone"
                      >
                        <Mail className="mt-0.5 size-4 text-ember" aria-hidden="true" strokeWidth={1.6} />
                        <span className="link-underline text-[15px]">
                          {site.email.general}
                        </span>
                      </a>
                      <p className="ml-7 mt-1 text-xs text-faint">General enquiries</p>
                    </li>
                    <li>
                      <a
                        href={`mailto:${site.email.projects}`}
                        className="group inline-flex items-start gap-3 text-bone"
                      >
                        <Mail className="mt-0.5 size-4 text-ember" aria-hidden="true" strokeWidth={1.6} />
                        <span className="link-underline text-[15px]">
                          {site.email.projects}
                        </span>
                      </a>
                      <p className="ml-7 mt-1 text-xs text-faint">New project briefs</p>
                    </li>
                  </ul>
                </div>

                {site.phone && (
                  <div>
                    <h2 className="label text-faint">Phone</h2>
                    <a
                      href={`tel:${site.phone.replace(/\s+/g, "")}`}
                      className="mt-4 inline-flex items-center gap-3 text-bone"
                    >
                      <Phone className="size-4 text-ember" aria-hidden="true" strokeWidth={1.6} />
                      {site.phone}
                    </a>
                  </div>
                )}

                <div>
                  <h2 className="label text-faint">Studio</h2>
                  <p className="mt-4 flex items-start gap-3 text-[15px] text-bone">
                    <MapPin className="mt-0.5 size-4 text-ember" aria-hidden="true" strokeWidth={1.6} />
                    <span>
                      {site.austin.locality}, {site.austin.regionName}
                      <br />
                      United States
                    </span>
                  </p>
                  <p className="ml-7 mt-2 font-mono text-[10px] tracking-[0.18em] text-faint">
                    {site.austin.coordinates.lat} / {site.austin.coordinates.lng}
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-ink-raised p-6">
                  <h2 className="text-sm font-medium text-bone">
                    Prefer a guided brief?
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    The project form collects goals, budget and timing up front, so
                    the first reply is more useful.
                  </p>
                  <Link
                    to="/start-a-project"
                    className="label mt-4 inline-flex items-center gap-2 text-ember hover:text-ember-soft"
                  >
                    Start a project
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <p className="text-[11px] leading-relaxed text-faint">
                  We do not accept contracts, signatures or identity documents by
                  email. See{" "}
                  <Link to="/contracts" className="link-underline text-muted hover:text-bone">
                    contracts
                  </Link>{" "}
                  for the secure workflow.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={80}>
              <div className="rounded-lg border border-line bg-ink-raised p-6 md:p-9">
                <h2 className="text-xl tracking-[-0.02em] text-bone">
                  Send a message
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Fields marked <span className="text-ember">*</span> are required.
                </p>
                <InquiryForm className="mt-8" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
