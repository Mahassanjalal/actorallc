import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Native disclosure elements keep every service readable without JavaScript,
 * while the details interaction stays fully keyboard accessible.
 */
export function ServiceExplorer() {
  return (
    <div className="border-t border-line">
      {services.map((service, index) => (
        <details
          key={service.slug}
          open={index === 0}
          className="group border-b border-line"
        >
          <summary className="flex cursor-pointer list-none items-center gap-5 py-6 md:gap-8 md:py-8 [&::-webkit-details-marker]:hidden">
            <span className="font-mono text-[11px] tracking-[0.16em] text-faint">
              {service.index}
            </span>
            <span className="flex-1 text-[clamp(1.35rem,2.6vw,2.1rem)] leading-tight tracking-[-0.03em] text-bone transition-colors group-hover:text-ember-soft">
              {service.title}
            </span>
            <span className="hidden max-w-[26ch] text-right text-sm leading-snug text-muted md:block">
              {service.summary}
            </span>
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-[transform,border-color,color] duration-300 group-open:rotate-45 group-open:border-ember/50 group-open:text-ember"
            >
              <Plus className="size-4" strokeWidth={1.5} />
            </span>
          </summary>

          <div className="grid gap-8 pb-9 pl-9 md:grid-cols-12 md:gap-10 md:pl-16 md:pb-12">
            <div className="md:col-span-6">
              {service.description.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="mb-4 max-w-lg text-sm leading-relaxed text-muted last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
              <Link
                to={`/services#${service.slug}`}
                className="label mt-6 inline-flex text-bone hover:text-ember-soft"
              >
                Service details <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="md:col-span-3">
              <h3 className="label text-faint">Outcomes</h3>
              <ul className="mt-4 space-y-2.5">
                {service.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className={cn(
                      "flex gap-2.5 text-[13px] leading-snug text-muted",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] size-1 shrink-0 rounded-full bg-ember/70"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="label text-faint">Deliverables</h3>
              <ul className="mt-4 space-y-2.5">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="text-[13px] leading-snug text-muted">
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
