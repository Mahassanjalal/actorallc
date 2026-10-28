import type { ReactNode } from "react";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Mark } from "@/components/visuals/Mark";

interface ClosingCTAProps {
  title?: ReactNode;
  intro?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryEmail?: string;
}

export function ClosingCTA({
  title = "Have something ambitious in mind?",
  intro = "Tell us where you are trying to go. We will reply with an honest read on fit, timing and the next useful step.",
  primaryLabel = "Start a project",
  primaryTo = "/start-a-project",
  secondaryEmail = site.email.projects,
}: ClosingCTAProps) {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div aria-hidden="true" className="absolute inset-0 aurora opacity-80" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
      >
        <Mark className="size-[32rem]" ring={false} />
      </div>
      <div className="container-page relative py-24 text-center md:py-32">
        <Reveal>
          <p className="label justify-center">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Next
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="display mx-auto mt-6 max-w-[18ch] text-bone">{title}</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="lede mx-auto mt-7 max-w-xl">{intro}</p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to={primaryTo} size="lg" showArrow>
              {primaryLabel}
            </Button>
            <Button href={`mailto:${secondaryEmail}`} variant="secondary" size="lg">
              {secondaryEmail}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
