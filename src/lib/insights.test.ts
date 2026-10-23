import { describe, expect, it } from "vitest";
import {
  getInsight,
  getRelatedInsights,
  insightCategories,
  insights,
} from "@/lib/insights";

describe("insights content", () => {
  it("loads published articles from Markdown", () => {
    expect(insights.length).toBeGreaterThan(0);
    for (const article of insights) {
      expect(article.title).toBeTruthy();
      expect(article.description).toBeTruthy();
      expect(article.html).toContain("<p>");
      expect(article.readingMinutes).toBeGreaterThan(0);
      expect(article.author).toBeTruthy();
    }
  });

  it("keeps slugs unique and URL-safe", () => {
    const slugs = insights.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("sorts articles newest first", () => {
    const dates = insights.map((article) => new Date(article.date).getTime());
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });

  it("exposes categories for filtering", () => {
    expect(insightCategories.length).toBeGreaterThan(0);
    expect(insightCategories).toEqual([...insightCategories].sort());
  });

  it("finds an article by slug and returns undefined for unknown slugs", () => {
    expect(getInsight(insights[0].slug)?.title).toBe(insights[0].title);
    expect(getInsight("missing-article")).toBeUndefined();
  });

  it("suggests related articles without repeating the current one", () => {
    const article = insights[0];
    const related = getRelatedInsights(article, 2);
    expect(related.length).toBeLessThanOrEqual(2);
    expect(related.every((entry) => entry.slug !== article.slug)).toBe(true);
  });

  it("renders headings and lists from Markdown", () => {
    const withHeading = insights.find((article) =>
      article.html.includes("<h2"),
    );
    expect(withHeading).toBeDefined();
    expect(withHeading?.html).toContain("<ul>");
  });
});
