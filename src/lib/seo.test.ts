import { describe, expect, it } from "vitest";
import { insights } from "@/lib/insights";
import {
  absoluteUrl,
  canonicalPath,
  getPageMeta,
  getStaticRoutes,
  renderHead,
} from "@/lib/seo";

describe("canonical URLs", () => {
  it("normalises paths with trailing slashes", () => {
    expect(canonicalPath("/")).toBe("/");
    expect(canonicalPath("/about")).toBe("/about/");
    expect(canonicalPath("/about/")).toBe("/about/");
    expect(canonicalPath("/insights?ref=1")).toBe("/insights/");
  });

  it("builds absolute URLs from the configured origin", () => {
    expect(absoluteUrl("/")).toBe("https://actorallc.example/");
    expect(absoluteUrl("/work")).toBe("https://actorallc.example/work/");
  });
});

describe("page metadata", () => {
  it("gives every static route a unique title and description", () => {
    const routes = getStaticRoutes();
    expect(routes.length).toBeGreaterThan(10);
    expect(new Set(routes.map((route) => route.meta.title)).size).toBe(
      routes.length,
    );
    for (const route of routes) {
      expect(route.meta.description.length).toBeGreaterThan(40);
      expect(route.meta.description.length).toBeLessThan(320);
    }
  });

  it("marks article routes as BlogPosting with canonical metadata", () => {
    const article = insights[0];
    const meta = getPageMeta(`/insights/${article.slug}`);
    expect(meta.type).toBe("article");
    expect(meta.published).toBe(article.date);
    expect(meta.title).toContain(article.title);
    const json = JSON.stringify(meta.jsonLd);
    expect(json).toContain("BlogPosting");
    expect(json).toContain(absoluteUrl(`/insights/${article.slug}`));
  });

  it("marks unknown routes noindex", () => {
    const meta = getPageMeta("/not-a-real-page");
    expect(meta.noindex).toBe(true);
    expect(meta.title).toMatch(/not found/i);
  });

  it("keeps sample case studies out of search results", () => {
    const meta = getPageMeta("/work/northlight");
    expect(meta.noindex).toBe(true);
  });

  it("does not advertise the thank-you page", () => {
    expect(getPageMeta("/thank-you").noindex).toBe(true);
  });
});

describe("renderHead", () => {
  const head = renderHead(getPageMeta("/about"));

  it("includes a title, description, canonical and social tags", () => {
    expect(head).toContain("<title data-actora-head>About — Actora</title>");
    expect(head).toContain('rel="canonical"');
    expect(head).toContain('property="og:title"');
    expect(head).toContain('name="twitter:card"');
    expect(head).toContain('application/ld+json');
  });

  it("escapes content destined for attributes", () => {
    const markup = renderHead({
      path: "/test",
      title: 'Quote " and <tag>',
      description: "A & B",
      type: "website",
      jsonLd: [{ "@type": "Thing", name: "</script><script>" }],
    });
    expect(markup).toContain("&quot;");
    expect(markup).toContain("&lt;tag&gt;");
    expect(markup).not.toContain("</script><script>");
  });
});
