import { getPageMeta, renderHead } from "@/lib/seo";

/**
 * Keeps title, description, canonical, social tags and JSON-LD in sync on
 * client-side navigation. The same markup is injected at build time for each
 * prerendered route, so crawlers never rely on JavaScript for metadata.
 */
export function applyPageMeta(pathname: string): void {
  if (typeof document === "undefined") return;

  const meta = getPageMeta(pathname);
  const markup = renderHead(meta);

  document.head
    .querySelectorAll("[data-actora-head]")
    .forEach((element) => element.remove());

  const template = document.createElement("template");
  template.innerHTML = markup;
  document.head.append(template.content);
}
