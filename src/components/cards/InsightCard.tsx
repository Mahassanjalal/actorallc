import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Insight } from "@/lib/insights";
import { formatDate } from "@/lib/format";
import { AbstractArt } from "@/components/visuals/AbstractArt";
import { cn } from "@/lib/cn";
import { paletteForCategory } from "@/lib/palette";

interface InsightCardProps {
  article: Insight;
  className?: string;
  featured?: boolean;
}

export function InsightCard({ article, className, featured = false }: InsightCardProps) {
  return (
    <article className={cn("group relative", className)}>
      <Link
        to={`/insights/${article.slug}`}
        className="flex h-full flex-col focus-visible:outline-none"
        aria-label={`Read ${article.title}`}
      >
        <div className="relative overflow-hidden rounded-lg border border-line">
          <AbstractArt
            {...paletteForCategory(article.category)}
            className={cn(
              "transition-transform duration-700 ease-out group-hover:scale-[1.025]",
              featured ? "aspect-[16/9]" : "aspect-[16/10]",
            )}
          />
          <span className="absolute left-4 top-4 rounded-full border border-bone/15 bg-ink/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/80 backdrop-blur">
            {article.category}
          </span>
          <span className="pointer-events-none absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full border border-bone/20 bg-ink/50 text-bone opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <ArrowUpRight className="size-4" aria-hidden="true" strokeWidth={1.6} />
          </span>
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} min read</span>
          </p>
          <h3
            className={cn(
              "mt-3 tracking-[-0.02em] text-bone",
              featured ? "text-2xl leading-[1.15]" : "text-xl leading-[1.2]",
            )}
          >
            <span className="link-underline">{article.title}</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {article.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
