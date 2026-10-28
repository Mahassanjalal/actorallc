import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getInsight, getRelatedInsights } from "@/lib/insights";
import { formatDate } from "@/lib/format";
import { site } from "@/config/site";
import { AbstractArt } from "@/components/visuals/AbstractArt";
import { InsightCard } from "@/components/cards/InsightCard";
import { paletteForCategory } from "@/lib/palette";
import { Reveal } from "@/components/ui/Reveal";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { NotFound } from "@/pages/NotFound";

export function InsightArticle() {
  const { slug = "" } = useParams();
  const article = getInsight(slug);

  if (!article) {
    return <NotFound />;
  }

  const related = getRelatedInsights(article);

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line pb-14 pt-20 md:pb-20 md:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-[380px] aurora opacity-60"
        />
        <div className="container-page relative">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/insights"
              className="label inline-flex items-center gap-1.5 text-muted hover:text-bone"
            >
              <ArrowLeft className="size-3" aria-hidden="true" /> Insights
            </Link>
            <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
            <span className="label text-ember">{article.category}</span>
          </div>

          <h1 className="mt-7 max-w-[24ch] text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] tracking-[-0.04em] text-bone">
            {article.title}
          </h1>
          <p className="lede mt-6 max-w-2xl">{article.description}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5">
            <span className="text-sm text-bone">{article.author}</span>
            <span className="label text-faint">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </span>
            <span className="label text-faint">{article.readingMinutes} min read</span>
          </div>
        </div>
      </header>

      <div className="container-page">
        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-lg border border-line">
            <AbstractArt
              {...paletteForCategory(article.category)}
              seed={paletteForCategory(article.category).seed + article.slug.length}
              className="aspect-[16/9] md:aspect-[21/9]"
              label={`Abstract cover artwork for the article ${article.title}`}
            />
          </div>
        </Reveal>

        <div className="mx-auto max-w-[44rem] py-14 md:py-20">
          <div
            className="prose-actora article-body"
            // Content is authored in-repo as Markdown, never user input.
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          {article.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-7">
              <span className="label mr-2 text-faint">Tags</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 text-[11px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {site.contentNotice.enabled && (
            <StatusMessage tone="info" className="mt-10" title="Sample essay">
              This article is included with the site to demonstrate the
              publishing workflow. Replace it with your own writing in{" "}
              <code>content/insights/</code>.
            </StatusMessage>
          )}

          <div className="mt-12 rounded-lg border border-line bg-ink-raised p-7">
            <p className="label">Work with us</p>
            <p className="mt-4 text-lg leading-relaxed text-bone">
              If this is the kind of thinking your project needs, tell us what
              you are building.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/start-a-project"
                className="label inline-flex items-center gap-2 text-ember hover:text-ember-soft"
              >
                Start a project <span aria-hidden="true">↗</span>
              </Link>
              <a
                href={`mailto:${site.email.general}`}
                className="label inline-flex items-center gap-2 text-muted hover:text-bone"
              >
                {site.email.general}
              </a>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line py-16 md:py-24" aria-labelledby="related-heading">
          <div className="container-page">
            <div className="flex items-end justify-between gap-6">
              <h2 id="related-heading" className="display-md text-bone">
                Keep <span className="serif-accent">reading</span>.
              </h2>
              <Link to="/insights" className="label text-muted hover:text-bone">
                All insights <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              {related.map((entry, index) => (
                <Reveal key={entry.slug} delay={index * 60}>
                  <InsightCard article={entry} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
