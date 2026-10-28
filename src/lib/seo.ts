import { services, site, work } from "@/config/site";
import { getInsight, insights, type Insight } from "@/lib/insights";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  type: "website" | "article";
  noindex?: boolean;
  image?: string;
  imageAlt?: string;
  published?: string;
  modified?: string;
  author?: string;
  section?: string;
  tags?: string[];
  jsonLd?: Array<Record<string, unknown>>;
}

const DEFAULT_TITLE =
  "Actora — Software and technology company in Austin, Texas";
const DEFAULT_DESCRIPTION = site.description;
const DEFAULT_IMAGE_ALT =
  "Actora — a software and technology company in Austin, Texas.";

/** Base path without a trailing slash, e.g. "" or "/actorallc". */
export function basePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

export function canonicalPath(path: string): string {
  const clean = path.split("?")[0].split("#")[0];
  const normalised = clean === "/" ? "/" : `${clean.replace(/\/+$/, "")}/`;
  return normalised;
}

export function absoluteUrl(path: string): string {
  return `${site.url}${basePath()}${canonicalPath(path)}`;
}

export function assetUrl(path: string): string {
  return `${site.url}${basePath()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function organisationNode(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": `${site.url}${basePath()}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: `${site.url}${basePath()}/`,
    description: site.description,
    email: site.email.general,
    logo: assetUrl(site.ogImage),
    ...(site.social.length > 0
      ? { sameAs: site.social.map((entry) => entry.href) }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.austin.locality,
      addressRegion: site.austin.region,
      addressCountry: site.austin.country,
    },
  };
}

function websiteNode(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${site.url}${basePath()}/#website`,
    url: `${site.url}${basePath()}/`,
    name: site.name,
    inLanguage: "en-US",
    publisher: { "@id": `${site.url}${basePath()}/#organization` },
  };
}

function breadcrumbNode(
  trail: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function webPageNode(meta: PageMeta): Record<string, unknown> {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(meta.path)}#webpage`,
    url: absoluteUrl(meta.path),
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": `${site.url}${basePath()}/#website` },
    inLanguage: "en-US",
  };
}

function articleMeta(article: Insight): PageMeta {
  return {
    path: `/insights/${article.slug}`,
    title: article.seoTitle || `${article.title} — Actora Insights`,
    description: article.seoDescription || article.description,
    type: "article",
    image: article.cover ? assetUrl(article.cover) : undefined,
    imageAlt: article.coverAlt || undefined,
    published: article.date,
    modified: article.date,
    author: article.author,
    section: article.category,
    tags: article.tags,
    jsonLd: [
      {
        "@type": "BlogPosting",
        "@id": `${absoluteUrl(`/insights/${article.slug}`)}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.date,
        author: { "@type": "Organization", name: article.author },
        publisher: { "@id": `${site.url}${basePath()}/#organization` },
        mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
        articleSection: article.category,
        keywords: article.tags.join(", "),
        wordCount: article.wordCount,
        inLanguage: "en-US",
      },
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Insights", path: "/insights" },
        { name: article.title, path: `/insights/${article.slug}` },
      ]),
    ],
  };
}

function workMeta(projectSlug: string): PageMeta {
  const project = work.find((item) => item.slug === projectSlug);
  if (!project) return notFoundMeta();
  return {
    path: `/work/${project.slug}`,
    title: `${project.title} — Work — Actora`,
    description: project.summary,
    type: "website",
    noindex: project.sample,
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Work", path: "/work" },
        { name: project.title, path: `/work/${project.slug}` },
      ]),
    ],
  };
}

function notFoundMeta(): PageMeta {
  return {
    path: "/404",
    title: "Page not found — Actora",
    description:
      "The page you were looking for could not be found. Explore Actora's work, services and insights instead.",
    type: "website",
    noindex: true,
  };
}

const staticMeta: Record<string, PageMeta> = {
  "/": {
    path: "/",
    title: DEFAULT_TITLE,
    description:
      "Actora is a software and technology company in Austin, Texas, building custom software, web applications and enterprise solutions with intention.",
    type: "website",
    jsonLd: [
      organisationNode(),
      websiteNode(),
      {
        "@type": "WebPage",
        "@id": `${site.url}${basePath()}/#webpage`,
        url: `${site.url}${basePath()}/`,
        name: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        isPartOf: { "@id": `${site.url}${basePath()}/#website` },
        about: { "@id": `${site.url}${basePath()}/#organization` },
      },
    ],
  },
  "/about": {
    path: "/about",
    title: "About — Actora",
    description:
      "Actora is a software and technology company in Austin, Texas. How we think, how we work, and what we value.",
    type: "website",
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ],
  },
  "/services": {
    path: "/services",
    title: "Services — Custom software, web apps, enterprise solutions — Actora",
    description:
      "Custom software development, web applications, enterprise solutions and digital transformation from Actora, a software and technology company in Austin, Texas.",
    type: "website",
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
      {
        "@type": "ItemList",
        name: "Actora services",
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.title,
          url: absoluteUrl(`/services#${service.slug}`),
        })),
      },
    ],
  },
  "/work": {
    path: "/work",
    title: "Work — Actora",
    description:
      "Selected work and case studies from Actora, a software and technology company in Austin, Texas.",
    type: "website",
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Work", path: "/work" },
      ]),
    ],
  },
  "/insights": {
    path: "/insights",
    title: "Insights — Actora",
    description:
      "Essays on software development, engineering and technology from Actora, a software and technology company in Austin, Texas.",
    type: "website",
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Insights", path: "/insights" },
      ]),
      {
        "@type": "Blog",
        "@id": `${absoluteUrl("/insights")}#blog`,
        name: "Actora Insights",
        url: absoluteUrl("/insights"),
        inLanguage: "en-US",
        blogPost: insights.map((article) => ({
          "@type": "BlogPosting",
          headline: article.title,
          datePublished: article.date,
          url: absoluteUrl(`/insights/${article.slug}`),
        })),
      },
    ],
  },
  "/contact": {
    path: "/contact",
    title: "Contact — Actora",
    description:
      "Contact Actora LLC in Austin, Texas. Tell us what you are building and we will reply within two business days.",
    type: "website",
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
      {
        "@type": "ContactPage",
        url: absoluteUrl("/contact"),
        name: "Contact Actora",
        about: { "@id": `${site.url}${basePath()}/#organization` },
      },
    ],
  },
  "/start-a-project": {
    path: "/start-a-project",
    title: "Start a project — Actora",
    description:
      "A guided brief for new work with Actora. Share your goals, budget and timeline, and we will reply with next steps.",
    type: "website",
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Start a project", path: "/start-a-project" },
      ]),
    ],
  },
  "/contracts": {
    path: "/contracts",
    title: "Contracts & e-signatures — Actora",
    description:
      "How Actora LLC sends, signs and stores client contracts, including secure signing links, provider disclosure and status lookup.",
    type: "website",
    noindex: false,
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Contracts", path: "/contracts" },
      ]),
    ],
  },
  "/privacy": {
    path: "/privacy",
    title: "Privacy policy — Actora",
    description:
      "How Actora LLC collects, uses and retains personal information submitted through this website.",
    type: "website",
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Privacy policy", path: "/privacy" },
      ]),
    ],
  },
  "/terms": {
    path: "/terms",
    title: "Terms of use — Actora",
    description:
      "The terms that apply to use of the Actora LLC website.",
    type: "website",
    jsonLd: [
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Terms of use", path: "/terms" },
      ]),
    ],
  },
  "/thank-you": {
    path: "/thank-you",
    title: "Message received — Actora",
    description:
      "Your message has been received by Actora. Here is what happens next.",
    type: "website",
    noindex: true,
  },
};

/** Resolves metadata for an app path (no base path, no trailing slash). */
export function getPageMeta(pathname: string): PageMeta {
  const raw = pathname.split("?")[0];
  const path = raw.length > 1 ? raw.replace(/\/+$/, "") : "/";

  if (path.startsWith("/insights/")) {
    const slug = path.slice("/insights/".length);
    const article = getInsight(slug);
    return article ? articleMeta(article) : notFoundMeta();
  }
  if (path.startsWith("/work/")) {
    return workMeta(path.slice("/work/".length));
  }

  const meta = staticMeta[path] ?? notFoundMeta();
  if (!meta.jsonLd && meta.path !== "/404") {
    return {
      ...meta,
      jsonLd: [
        webPageNode(meta),
        breadcrumbNode([
          { name: "Home", path: "/" },
          { name: meta.title.split(" — ")[0], path: meta.path },
        ]),
      ],
    };
  }
  return meta;
}

export interface StaticRoute {
  path: string;
  meta: PageMeta;
}

/** Every route that should exist as a prerendered HTML file. */
export function getStaticRoutes(): StaticRoute[] {
  const paths = [
    "/",
    "/about",
    "/services",
    "/work",
    "/insights",
    "/contact",
    "/start-a-project",
    "/contracts",
    "/privacy",
    "/terms",
    "/thank-you",
    ...work.map((project) => `/work/${project.slug}`),
    ...insights.map((article) => `/insights/${article.slug}`),
  ];

  return paths.map((path) => ({ path, meta: getPageMeta(path) }));
}

export function renderHead(meta: PageMeta): string {
  const canonical = absoluteUrl(meta.path);
  const image = meta.image ?? assetUrl(site.ogImage);
  const imageAlt = meta.imageAlt ?? DEFAULT_IMAGE_ALT;
  const tags: string[] = [];

  tags.push(`<title data-actora-head>${escapeHtml(meta.title)}</title>`);
  tags.push(
    `<meta data-actora-head name="description" content="${escapeHtml(meta.description)}" />`,
  );
  tags.push(`<link data-actora-head rel="canonical" href="${canonical}" />`);
  tags.push(
    `<link data-actora-head rel="alternate" type="application/rss+xml" title="Actora Insights RSS" href="${assetUrl("/rss.xml")}" />`,
  );
  tags.push(
    `<meta data-actora-head name="robots" content="${
      meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    }" />`,
  );
  tags.push(
    `<meta data-actora-head property="og:site_name" content="${escapeHtml(site.name)}" />`,
  );
  tags.push(
    `<meta data-actora-head property="og:type" content="${meta.type}" />`,
  );
  tags.push(
    `<meta data-actora-head property="og:title" content="${escapeHtml(meta.title)}" />`,
  );
  tags.push(
    `<meta data-actora-head property="og:description" content="${escapeHtml(meta.description)}" />`,
  );
  tags.push(`<meta data-actora-head property="og:url" content="${canonical}" />`);
  tags.push(
    `<meta data-actora-head property="og:image" content="${image}" />`,
  );
  tags.push(
    `<meta data-actora-head property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
  );
  tags.push(`<meta data-actora-head property="og:locale" content="${site.locale}" />`);

  if (meta.type === "article") {
    if (meta.published) {
      tags.push(
        `<meta data-actora-head property="article:published_time" content="${meta.published}" />`,
      );
    }
    if (meta.modified) {
      tags.push(
        `<meta data-actora-head property="article:modified_time" content="${meta.modified}" />`,
      );
    }
    if (meta.author) {
      tags.push(
        `<meta data-actora-head property="article:author" content="${escapeHtml(meta.author)}" />`,
      );
    }
    if (meta.section) {
      tags.push(
        `<meta data-actora-head property="article:section" content="${escapeHtml(meta.section)}" />`,
      );
    }
    for (const tag of meta.tags ?? []) {
      tags.push(
        `<meta data-actora-head property="article:tag" content="${escapeHtml(tag)}" />`,
      );
    }
  }

  tags.push(
    `<meta data-actora-head name="twitter:card" content="summary_large_image" />`,
  );
  tags.push(
    `<meta data-actora-head name="twitter:title" content="${escapeHtml(meta.title)}" />`,
  );
  tags.push(
    `<meta data-actora-head name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  );
  tags.push(
    `<meta data-actora-head name="twitter:image" content="${image}" />`,
  );

  const graph = meta.jsonLd?.length ? meta.jsonLd : [];
  if (graph.length) {
    const payload = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    }).replace(/</g, "\\u003c");
    tags.push(
      `<script data-actora-head type="application/ld+json">${payload}</script>`,
    );
  }

  return tags.join("\n    ");
}
