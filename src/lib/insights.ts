import { marked } from "marked";
import { parse as parseYaml } from "yaml";
import { readingTimeMinutes, toIsoDate } from "@/lib/format";

/**
 * Articles live as Markdown files in /content/insights. Vite inlines them at
 * build time, so publishing is a matter of adding a file and opening a pull
 * request — no CMS, database or runtime required.
 */
const rawFiles = import.meta.glob("../../content/insights/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

marked.setOptions({ gfm: true, breaks: false });

export interface InsightFrontmatter {
  title: string;
  slug?: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags?: string[];
  cover?: string;
  coverAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface Insight {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  draft: boolean;
  body: string;
  html: string;
  readingMinutes: number;
  wordCount: number;
}

function splitFrontmatter(source: string, filename: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) {
    throw new Error(
      `Article ${filename} is missing YAML frontmatter delimited by --- lines.`,
    );
  }
  return { frontmatter: match[1], body: match[2] ?? "" };
}

function slugFromFilename(path: string): string {
  return path.split("/").pop()?.replace(/\.md$/, "") ?? "";
}

function requireString(
  value: unknown,
  field: string,
  filename: string,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Article ${filename} needs a non-empty "${field}" field.`);
  }
  return value.trim();
}

function normalise(raw: string, path: string): Insight {
  const filename = path.split("/").pop() ?? path;
  const { frontmatter, body } = splitFrontmatter(raw, filename);
  const data = parseYaml(frontmatter) as Partial<InsightFrontmatter> | null;
  if (!data || typeof data !== "object") {
    throw new Error(`Article ${filename} has invalid frontmatter.`);
  }

  const slug = (data.slug ?? slugFromFilename(path)).trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      `Article ${filename} has an invalid slug "${slug}". Use lowercase words separated by hyphens.`,
    );
  }

  const date = toIsoDate(requireString(data.date, "date", filename));
  if (Number.isNaN(new Date(date).getTime())) {
    throw new Error(`Article ${filename} has an invalid "date" value.`);
  }

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const html = marked.parse(body, { async: false }) as string;

  return {
    slug,
    title: requireString(data.title, "title", filename),
    description: requireString(data.description, "description", filename),
    author: requireString(data.author, "author", filename),
    date,
    category: requireString(data.category, "category", filename),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: typeof data.cover === "string" ? data.cover : "",
    coverAlt: typeof data.coverAlt === "string" ? data.coverAlt : "",
    seoTitle: typeof data.seoTitle === "string" ? data.seoTitle : "",
    seoDescription:
      typeof data.seoDescription === "string" ? data.seoDescription : "",
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    body,
    html,
    readingMinutes: readingTimeMinutes(body),
    wordCount,
  };
}

const parsed = Object.entries(rawFiles).map(([path, raw]) =>
  normalise(raw, path),
);

for (const article of parsed) {
  if (parsed.filter((other) => other.slug === article.slug).length > 1) {
    throw new Error(`Duplicate insight slug "${article.slug}" found.`);
  }
}

const now = Date.now();

/** Published articles, newest first. Drafts are hidden in production builds. */
export const insights: Insight[] = parsed
  .filter((article) => !article.draft || import.meta.env.DEV)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const insightCategories: string[] = Array.from(
  new Set(insights.map((article) => article.category)),
).sort();

export function getInsight(slug: string): Insight | undefined {
  return insights.find((article) => article.slug === slug);
}

export function getRelatedInsights(article: Insight, limit = 2): Insight[] {
  return insights
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) =>
        article.tags.includes(tag),
      ).length;
      const sameCategory = candidate.category === article.category ? 2 : 0;
      return { candidate, score: sharedTags + sameCategory };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.candidate.date).getTime() -
          new Date(a.candidate.date).getTime(),
    )
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function getFeaturedInsight(): Insight | undefined {
  return insights.find((article) => article.featured) ?? insights[0];
}

export function minutesLabel(minutes: number): string {
  return `${minutes} min read`;
}

/** Sanity guard used by the publishing test suite. */
export function assertContentFreshness(): void {
  for (const article of insights) {
    const published = new Date(article.date).getTime();
    if (published > now + 86_400_000) {
      throw new Error(
        `Insight "${article.slug}" is dated more than a day in the future.`,
      );
    }
  }
}
