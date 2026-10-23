/**
 * Post-build prerender.
 *
 * 1. Renders every public route to real HTML with per-page metadata.
 * 2. Writes trailing-slash `index.html` files so GitHub Pages deep links work
 *    without any SPA rewrite trickery.
 * 3. Generates sitemap.xml, rss.xml, robots.txt and a branded 404.html.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const templatePath = join(dist, "index.html");
const serverEntry = join(root, ".ssr", "entry-server.js");

const {
  render,
  getStaticRoutes,
  getPageMeta,
  renderHead,
  absoluteUrl,
  assetUrl,
  insights,
  site,
} = await import(serverEntry);

const template = await readFile(templatePath, "utf8");

if (!template.includes('id="root"')) {
  throw new Error(
    'Template is missing <div id="root">. Did the client build run?',
  );
}
if (typeof renderHead !== "function") {
  throw new Error("renderHead is not exported from the SSR entry.");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildDocument(route, meta) {
  const appHtml = render(route);
  const headMarkup = renderHead(meta);
  const withApp = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
  );
  const withHead = withApp.includes("<!--app-head-->")
    ? withApp.replace("<!--app-head-->", headMarkup)
    : withApp.replace("</head>", `${headMarkup}\n  </head>`);

  if (!withHead.includes('id="root"><')) {
    throw new Error(`Route ${route} rendered no markup.`);
  }
  return withHead;
}

async function writeDocument(target, route, meta) {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buildDocument(route, meta), "utf8");
}

const routes = getStaticRoutes();
const buildDate = new Date().toISOString().slice(0, 10);

for (const route of routes) {
  const target =
    route.path === "/"
      ? join(dist, "index.html")
      : join(dist, route.path.replace(/^\/+|\/+$/g, ""), "index.html");
  await writeDocument(target, route.path, route.meta);
}

// Branded 404. GitHub Pages serves this file for unknown paths.
await writeDocument(join(dist, "404.html"), "/404", getPageMeta("/404"));

// ---------------------------------------------------------------- sitemap
const sitemapRoutes = routes.filter((route) => !route.meta.noindex);
const sitemapEntries = sitemapRoutes
  .map((route) => {
    const lastmod = route.meta.published ?? buildDate;
    return `  <url>\n    <loc>${escapeXml(absoluteUrl(route.path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;
await writeFile(join(dist, "sitemap.xml"), sitemap, "utf8");

// -------------------------------------------------------------------- rss
const sortedInsights = [...insights].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);
const latest = sortedInsights[0]?.date ?? new Date().toISOString();
const rssItems = sortedInsights
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(absoluteUrl(`/insights/${article.slug}`))}</link>
      <guid isPermaLink="true">${escapeXml(absoluteUrl(`/insights/${article.slug}`))}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <description>${escapeXml(article.description)}</description>
    </item>`,
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} Insights`)}</title>
    <link>${escapeXml(absoluteUrl("/insights"))}</link>
    <description>${escapeXml("Essays on brand, product, engineering and craft from Actora in Austin, Texas.")}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(assetUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;
await writeFile(join(dist, "rss.xml"), rss, "utf8");

// ----------------------------------------------------------------- robots
const robots = `User-agent: *
Allow: /

# No value in indexing the confirmation page.
Disallow: /thank-you/

Sitemap: ${assetUrl("/sitemap.xml")}
`;
await writeFile(join(dist, "robots.txt"), robots, "utf8");

// GitHub Pages should not run Jekyll over hashed asset paths.
await writeFile(join(dist, ".nojekyll"), "", "utf8");

console.log(`Prerendered ${routes.length} routes + 404.html`);
console.log(`  sitemap.xml (${sitemapRoutes.length} urls)`);
console.log(`  rss.xml (${sortedInsights.length} items)`);
console.log("  robots.txt, .nojekyll");
