import { useMemo, useState } from "react";
import { Rss, Search, X } from "lucide-react";
import { insightCategories, insights } from "@/lib/insights";
import { site } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/cards/InsightCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Insights() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return insights.filter((article) => {
      const inCategory = category === "All" || article.category === category;
      if (!inCategory) return false;
      if (!needle) return true;
      const haystack = [
        article.title,
        article.description,
        article.category,
        article.author,
        ...article.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, category]);

  const filtered = query.trim().length > 0 || category !== "All";

  const reset = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title={
          <>
            Notes on <span className="serif-accent">craft</span>,
            <br />
            written to be useful.
          </>
        }
        intro="Essays on design, engineering and the decisions in between. No growth hacks, no listicles — just what we are learning while making things."
        meta={
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`${import.meta.env.BASE_URL}rss.xml`}
              className="label inline-flex items-center gap-2 text-muted hover:text-bone"
            >
              <Rss className="size-3.5" aria-hidden="true" />
              RSS feed
            </a>
            <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
            <span className="label">
              {insights.length} article{insights.length === 1 ? "" : "s"}
            </span>
          </div>
        }
      />

      <section className="pb-20 md:pb-28" aria-label="Articles">
        <div className="container-page">
          <div className="flex flex-col gap-6 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
              {["All", ...insightCategories].map((item) => {
                const active = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={active}
                    className={cn(
                      "min-h-9 rounded-full border px-3.5 text-[11px] uppercase tracking-[0.12em] transition-colors",
                      active
                        ? "border-ember/40 bg-ember/[0.08] text-bone"
                        : "border-transparent text-muted hover:border-line hover:text-bone",
                    )}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <label htmlFor="insight-search" className="sr-only">
                Search articles
              </label>
              <Search
                className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-faint"
                aria-hidden="true"
              />
              <input
                id="insight-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles and tags"
                className="w-full border-b border-line-strong bg-transparent py-2 pl-7 pr-8 text-sm text-bone placeholder:text-faint focus:border-ember focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-bone"
                  aria-label="Clear search"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <p className="mt-5 text-xs text-faint" aria-live="polite">
            {results.length} {results.length === 1 ? "article" : "articles"}
            {category !== "All" ? ` in ${category}` : ""}
            {query ? ` matching “${query}”` : ""}
          </p>

          {results.length > 0 ? (
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((article, index) => (
                <Reveal key={article.slug} delay={Math.min(index, 5) * 50}>
                  <InsightCard article={article} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-14 rounded-lg border border-dashed border-line-strong px-6 py-20 text-center">
              <p className="serif text-3xl text-bone">No signal yet.</p>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Nothing matches that search. Try a broader term, browse another
                category, or write to us with a question worth answering.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button type="button" variant="secondary" onClick={reset}>
                  Clear filters
                </Button>
                <Button href={`mailto:${site.email.general}`} variant="ghost" showArrow>
                  Suggest a topic
                </Button>
              </div>
            </div>
          )}

          {filtered && results.length > 0 && (
            <div className="mt-10">
              <button
                type="button"
                onClick={reset}
                className="label text-muted hover:text-bone"
              >
                Clear filters <span aria-hidden="true">×</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
