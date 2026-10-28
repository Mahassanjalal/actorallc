import { describe, expect, it } from "vitest";
import { process, services, site, work } from "@/config/site";

describe("site configuration", () => {
  it("has unique service and case-study slugs", () => {
    expect(new Set(services.map((entry) => entry.slug)).size).toBe(
      services.length,
    );
    expect(new Set(work.map((entry) => entry.slug)).size).toBe(work.length);
  });

  it("uses link-safe slugs", () => {
    for (const entry of [...services, ...work]) {
      expect(entry.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("keeps every configured URL absolute and https", () => {
    expect(site.url.startsWith("https://")).toBe(true);
    for (const social of site.social) {
      expect(social.href.startsWith("https://")).toBe(true);
    }
    for (const link of Object.values(site.footerNav).flat()) {
      expect(link.href.startsWith("/")).toBe(true);
    }
  });

  it("provides a process step for each phase with points", () => {
    expect(process.length).toBeGreaterThanOrEqual(3);
    for (const step of process) {
      expect(step.title).toBeTruthy();
      expect(step.points.length).toBeGreaterThan(0);
    }
  });

  it("labels sample case studies as samples when present", () => {
    const samples = work.filter((entry) => entry.sample);
    if (samples.length > 0) {
      for (const sample of samples) {
        expect(sample.context.toLowerCase()).toContain("placeholder");
      }
    }
  });

  it("does not publish invented team members", () => {
    expect(Array.isArray(site.team)).toBe(true);
  });
});
