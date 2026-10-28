import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

interface ThankYouState {
  id?: string;
  name?: string;
  kind?: "contact" | "project";
}

export function ThankYou() {
  const location = useLocation();
  const state = (location.state ?? null) as ThankYouState | null;
  const confirmed = Boolean(state?.id);
  const firstName = state?.name?.trim();

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[500px] aurora opacity-80"
      />
      <div className="container-page relative py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <CheckCircle2
              className="size-5 text-success"
              aria-hidden="true"
              strokeWidth={1.7}
            />
            <p className="label">
              {confirmed ? "Submission confirmed" : "Submission page"}
            </p>
          </div>

          <h1 className="display mt-7 text-bone">
            {confirmed ? (
              <>
                Thank you{firstName ? `, ${firstName}` : ""}.
                <br />
                <span className="serif-accent">It arrived.</span>
              </>
            ) : (
              <>
                Nothing to <span className="serif-accent">confirm</span> yet.
              </>
            )}
          </h1>

          {confirmed ? (
            <p className="lede mt-7 max-w-xl">
              Your message reached our server and a notification is on its way
              to the studio. We reply within two business days, usually sooner.
            </p>
          ) : (
            <p className="lede mt-7 max-w-xl">
              This page appears after a successful submission. If you have not
              sent an inquiry, start with the brief — or email us directly and we
              will pick it up from there.
            </p>
          )}

          {confirmed && state?.id && (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Reference · {state.id}
            </p>
          )}

          <Reveal className="mt-12">
            <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
              {[
                {
                  index: "01",
                  title: "Read",
                  body: "A real person reviews your brief — not a lead-scoring robot.",
                },
                {
                  index: "02",
                  title: "Reply",
                  body: "We respond with questions, a call, or a clear no if it is not a fit.",
                },
                {
                  index: "03",
                  title: "Scope",
                  body: "If it makes sense, we agree a scope and issue a contract for signature.",
                },
              ].map((step) => (
                <li key={step.index} className="bg-ink-raised p-6">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ember">
                    {step.index}
                  </span>
                  <h2 className="mt-4 text-base text-bone">{step.title}</h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/insights" variant="secondary" showArrow>
              Read the insights
            </Button>
            <Button to="/work" variant="ghost" showArrow>
              Explore the work
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted">
            Need to add something? Email{" "}
            <a
              href={`mailto:${site.email.projects}`}
              className="link-underline text-bone"
            >
              {site.email.projects}
            </a>{" "}
            or read our{" "}
            <Link to="/privacy" className="link-underline text-bone">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
