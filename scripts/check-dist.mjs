/**
 * Post-build integrity check for the prerendered site.
 *
 * Verifies unique titles/descriptions, exactly one h1, canonical URLs, valid
 * JSON-LD, and that every internal link/asset resolves to a real file (including
 * hash anchors). Run after `npm run build`.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const base = (process.env.VITE_BASE_PATH || "/").replace(/\/?$/, "/");
const siteUrl = (process.env.VITE_SITE_URL || "https://actorallc.example").replace(/\/$/, "");

const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();

function fail(message) {
  errors.push(message);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

const allFiles = await walk(dist);
const htmlFiles = allFiles.filter((file) => file.endsWith(".html"));
const pageFiles = htmlFiles.filter((file) => file.endsWith("index.html"));

function publicPath(file) {
  const rel = relative(dist, file).replaceAll("\\", "/");
  return `/${rel.replace(/index\.html$/, "")}`;
}

const idsByFile = new Map();

for (const file of pageFiles) {
  const html = await readFile(file, "utf8");
  const page = publicPath(file);

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
  const description = html
    .match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1]
    ?.trim();
  const canonical = html
    .match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1]
    ?.trim();
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;

  if (!title) fail(`${page}: missing <title>`);
  if (!description) fail(`${page}: missing meta description`);
  if (h1Count !== 1) fail(`${page}: expected exactly one <h1>, found ${h1Count}`);
  if (!canonical) {
    fail(`${page}: missing canonical`);
  } else if (!canonical.startsWith(siteUrl)) {
    fail(`${page}: canonical ${canonical} does not start with ${siteUrl}`);
  }
  if (!html.includes('<html lang="en"')) fail(`${page}: missing lang attribute`);
  if (!html.includes('id="root"')) fail(`${page}: missing root element`);

  if (title) {
    if (titles.has(title)) {
      fail(`${page}: duplicate title "${title}" (also ${titles.get(title)})`);
    }
    titles.set(title, page);
  }
  if (description) {
    if (descriptions.has(description)) {
      warnings.push(
        `${page}: description also used by ${descriptions.get(description)}`,
      );
    }
    descriptions.set(description, page);
  }

  for (const match of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      fail(`${page}: invalid JSON-LD (${error.message})`);
    }
  }

  const ids = new Set(
    [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
  );
  idsByFile.set(file, ids);
}

// Check internal links and local assets on every page.
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const page = publicPath(file);
  const ids =
    idsByFile.get(file) ??
    new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

  const links = [
    ...html.matchAll(/href="([^"]+)"/g),
    ...html.matchAll(/src="([^"]+)"/g),
  ].map((match) => match[1]);

  for (const raw of new Set(links)) {
    if (
      !raw ||
      raw.startsWith("mailto:") ||
      raw.startsWith("tel:") ||
      raw.startsWith("data:") ||
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("//")
    ) {
      continue;
    }

    const [rawPath, hash] = raw.split("#");
    if (rawPath === "" && hash) {
      if (!ids.has(hash)) {
        // Shared header/footer anchors like #top/#main exist in the layout.
        fail(`${page}: missing anchor target "#${hash}"`);
      }
      continue;
    }

    const path = rawPath.split("?")[0];
    if (!path.startsWith("/")) {
      fail(`${page}: relative asset/link "${raw}" is not base-path safe`);
      continue;
    }
    const baseNoSlash = base.replace(/\/$/, "");
    let stripped;
    if (base !== "/" && path === baseNoSlash) {
      // React Router renders the home link without a trailing slash; the host
      // redirects it to the directory index.
      stripped = "/";
    } else if (path.startsWith(base)) {
      stripped = path.slice(base.length - 1);
    } else {
      fail(`${page}: internal path "${path}" does not include base "${base}"`);
      continue;
    }
    const candidates = [];
    if (stripped.endsWith("/")) {
      candidates.push(join(dist, stripped, "index.html"));
    } else {
      candidates.push(join(dist, stripped));
      if (!extname(stripped)) candidates.push(join(dist, stripped, "index.html"));
    }

    let resolved = null;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        resolved = candidate;
        break;
      }
    }

    if (!resolved) {
      fail(`${page}: broken internal reference "${raw}"`);
      continue;
    }

    if (hash && resolved.endsWith(".html")) {
      const targetHtml = await readFile(resolved, "utf8");
      if (!new RegExp(`id="${hash}"`).test(targetHtml)) {
        fail(`${page}: "${raw}" points to a missing anchor`);
      }
    }
  }
}

// 404 and metadata files.
for (const required of [
  "404.html",
  "sitemap.xml",
  "rss.xml",
  "robots.txt",
  ".nojekyll",
  "og.png",
  "favicon.svg",
]) {
  if (!(await exists(join(dist, required)))) fail(`missing dist/${required}`);
}

const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
if (!sitemap.includes("<urlset")) fail("sitemap.xml is not a urlset");
if ((sitemap.match(/<loc>/g) ?? []).length !== pageFiles.length - 1) {
  // One page is intentionally excluded: /thank-you (noindex).
  warnings.push(
    `sitemap has ${(sitemap.match(/<loc>/g) ?? []).length} urls for ${pageFiles.length} pages (noindex pages are excluded)`,
  );
}

const robots = await readFile(join(dist, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${siteUrl}${base === "/" ? "" : base.slice(0, -1)}/sitemap.xml`)) {
  warnings.push("robots.txt sitemap URL does not match the configured origin/base");
}

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`  – ${warning}`);
}

if (errors.length) {
  console.error(`\nSite verification failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Site verification passed: ${pageFiles.length} pages, ${htmlFiles.length} HTML files, all internal links resolve.`,
  );
}
