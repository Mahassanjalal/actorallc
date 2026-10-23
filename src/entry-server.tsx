import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "@/App";
import { site } from "@/config/site";

/** Renders one route to static HTML for the prerender script. */
export function render(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const location = base ? `${base}${pathname === "/" ? "/" : pathname}` : pathname;

  return renderToString(
    <StaticRouter basename={base || "/"} location={location}>
      <App />
    </StaticRouter>,
  );
}

export {
  absoluteUrl,
  assetUrl,
  canonicalPath,
  getPageMeta,
  getStaticRoutes,
  renderHead,
} from "@/lib/seo";
export { insights } from "@/lib/insights";
export { site };
