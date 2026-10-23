import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { WorkSample } from "@/config/site";
import { AbstractArt } from "@/components/visuals/AbstractArt";
import { cn } from "@/lib/cn";

interface WorkCardProps {
  project: WorkSample;
  index: number;
  className?: string;
}

export function WorkCard({ project, index, className }: WorkCardProps) {
  return (
    <article className={cn("group relative", className)}>
      <Link
        to={`/work/${project.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`${project.title} — ${project.discipline} case study`}
      >
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-lg border border-line">
              <AbstractArt
                from={project.art.from}
                to={project.art.to}
                accent={project.art.accent}
                seed={project.art.seed}
                className="aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
                <span className="rounded-full border border-bone/15 bg-ink/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/80 backdrop-blur">
                  {String(index + 1).padStart(2, "0")} / {project.year}
                </span>
                {project.sample && (
                  <span className="rounded-full border border-ember/40 bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ember-soft backdrop-blur">
                    Sample
                  </span>
                )}
              </div>
              <span className="pointer-events-none absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full border border-bone/20 bg-ink/50 text-bone opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <ArrowUpRight className="size-4" aria-hidden="true" strokeWidth={1.6} />
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="label">{project.discipline}</p>
            <h3 className="mt-4 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.02] tracking-[-0.03em] text-bone">
              <span className="link-underline">{project.title}</span>
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              {project.summary}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {project.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-full border border-line px-3 py-1 text-[11px] tracking-[0.02em] text-muted"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </article>
  );
}
