import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: { label: string; href: string };
  id?: string;
  className?: string;
  size?: "md" | "lg";
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  intro,
  action,
  id,
  className,
  size = "md",
}: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:gap-10", className)}>
      <div className="lg:col-span-3">
        {(eyebrow || index) && (
          <Reveal>
            <p className="label">
              {index && (
                <span className="font-mono text-ember/90" aria-hidden="true">
                  {index}
                </span>
              )}
              {eyebrow}
            </p>
          </Reveal>
        )}
      </div>

      <div className="lg:col-span-9">
        <Reveal delay={60}>
          <h2
            id={id}
            className={cn(
              size === "lg" ? "display" : "display-md",
              "max-w-[22ch] text-bone",
            )}
          >
            {title}
          </h2>
        </Reveal>
        {(intro || action) && (
          <Reveal delay={120}>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              {intro && (
                <div className="lede max-w-2xl text-balance">{intro}</div>
              )}
              {action && (
                <Link
                  to={action.href}
                  className="link-underline label shrink-0 text-bone"
                >
                  {action.label}
                  <span aria-hidden="true" className="text-ember">
                    ↗
                  </span>
                </Link>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
