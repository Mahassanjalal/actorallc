import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { WorkSample } from "@/config/site";
import { AbstractArt } from "@/components/visuals/AbstractArt";
import { cn } from "@/lib/cn";

// Inline SVG for GitHub icon
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 4c0-2.5 1.5-6.5 6.5-6.5 1.6 0 3.09-.99 4.23-2.37L18.23 2 15.55 5.47a2.67 2.67 0 0 1-2.61 0C12.66 5.48 10.73 5.2 10.4 5.2H4.5a.5.5 0 0 1 0-1H9a.5.5 0 0 1 .5.5M14 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
    </svg>
  );
}

interface WorkCardProps {
  project: WorkSample;
  index: number;
  className?: string;
}

export function WorkCard({ project, index, className }: WorkCardProps) {
  const githubUrl = getGithubUrl(project.slug);

  return (
    <article className={cn("group relative", className)}>
      <Link
        to={`/work/${project.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`${project.title} — ${project.discipline} case study`}
      >
        <div className="rounded-lg border border-line overflow-hidden bg-ink-raised transition-all duration-300 group-hover:border-line-strong group-hover:shadow-lg">
          {/* Hero artwork */}
          <div className="relative h-48 overflow-hidden">
            <AbstractArt
              from={project.art.from}
              to={project.art.to}
              accent={project.art.accent}
              seed={project.art.seed}
              className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

            {/* Badge */}
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <span
                className="rounded-full border border-bone/15 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/90 backdrop-blur"
              >
                {project.year}
              </span>
              {project.sample && (
                <span className="rounded-full border border-ember/40 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ember-soft backdrop-blur">
                  Sample
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="label text-ember">{project.discipline}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-bone leading-tight">
              <span className="link-underline">{project.title}</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
              {project.summary}
            </p>

            {/* Capabilities */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.capabilities.slice(0, 3).map((capability) => (
                <span
                  key={capability}
                  className="rounded-md border border-line/60 bg-surface/50 px-2 py-0.5 text-[10px] tracking-wide text-muted"
                >
                  {capability}
                </span>
              ))}
              {project.capabilities.length > 3 && (
                <span className="rounded-md px-2 py-0.5 text-[10px] tracking-wide text-faint">
                  +{project.capabilities.length - 3} more
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-faint">
              <span className="link-underline group-hover:text-ember-soft">
                View case study
              </span>
              {githubUrl && (
                <span
                  className="flex items-center gap-1 rounded-full border border-bone/15 bg-ink/50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-bone/80 backdrop-blur transition-colors hover:border-bone/30 hover:text-bone whitespace-nowrap"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(githubUrl, '_blank', 'noopener,noreferrer');
                  }}
                  role="link"
                  aria-label={`View ${project.title} source on GitHub`}
                >
                  <GithubIcon className="size-3" aria-hidden="true" />
                  Code
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function getGithubUrl(slug: string): string | null {
  const githubMap: Record<string, string> = {
    "hostel-management": "https://github.com/MuhammadAsadIlyasGujjar/hostel-management",
    "dairy-pos": "https://github.com/MuhammadAsadIlyasGujjar/DairyPOS",
    "z-shop-store-saas": "https://github.com/Mahassanjalal/z-shop-store-saas",
    "qanawat-ai": "https://github.com/Mahassanjalal/qanawat-ai",
    "chatterly": "https://github.com/Mahassanjalal/chatterly",
    "child-sponsorship-platform": "https://github.com/Mahassanjalal/child-sponsor-platform",
    "northstar-talent": "https://github.com/Mahassanjalal/NorthstarTalent",
    "fitcore": "https://github.com/Mahassanjalal/fitcore",
    "pulse-social": "https://github.com/Mahassanjalal/pulse",
    "fms-poultry": "https://github.com/MuhammadAsadIlyasGujjar/FMS",
  };
  return githubMap[slug] || null;
}
