import { describe, expect, it } from "vitest";
import { render } from "@/entry-server";
import { getStaticRoutes } from "@/lib/seo";

describe("static rendering", () => {
  const routes = getStaticRoutes();

  it("prerenders every route with a heading and real content", () => {
    for (const route of routes) {
      const html = render(route.path);
      expect(html.length, `Route ${route.path} is too small`).toBeGreaterThan(
        1200,
      );
      expect(html, `Route ${route.path} has no h1`).toContain("<h1");
    }
  });

  it("renders article bodies into the HTML", () => {
    const articleRoute = routes.find((route) =>
      route.path.startsWith("/insights/"),
    );
    expect(articleRoute).toBeDefined();
    const html = render(articleRoute!.path);
    expect(html).toContain("prose-actora");
    expect(html).toContain("<h2");
    // Article metadata is present without JavaScript.
    expect(html).toContain("article-body");
  });

  it("renders the branded 404 for unknown paths", () => {
    const html = render("/this-page-does-not-exist");
    expect(html).toContain("Off the");
    expect(html).toContain("Error 404");
  });

  it("includes the skip link and primary navigation in the layout", () => {
    const html = render("/");
    expect(html).toContain("Skip to content");
    expect(html).toContain('aria-label="Primary"');
    expect(html).toContain("Start a project");
    const privacyLinks = (html.match(/href="\/privacy"/g) ?? []).length;
    expect(privacyLinks).toBeGreaterThan(0);
  });

  it("shows the preview notice while placeholder content is enabled", () => {
    const html = render("/");
    expect(html).toContain("Preview content");
  });
});
