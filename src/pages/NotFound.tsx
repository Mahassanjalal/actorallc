import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Mark } from "@/components/visuals/Mark";

export function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 aurora opacity-70" />
      <div className="container-page relative flex min-h-[75svh] flex-col items-start justify-center py-24">
        <Mark className="size-10 text-ember" />
        <p className="label mt-8">Error 404</p>
        <h1 className="display-xl mt-4 text-bone">
          Off the <span className="serif-accent">map</span>.
        </h1>
        <p className="lede mt-6 max-w-lg">
          This page does not exist, or it moved. Nothing is broken on your side —
          and nothing sensitive was exposed.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button to="/" size="lg" showArrow>
            Back to home
          </Button>
          <Button to="/work" variant="secondary" size="lg">
            Explore our work
          </Button>
        </div>
        <p className="mt-10 text-sm text-muted">
          Looking for something specific?{" "}
          <a
            href={`mailto:${site.email.general}`}
            className="link-underline text-bone"
          >
            {site.email.general}
          </a>{" "}
          or{" "}
          <Link to="/insights" className="link-underline text-bone">
            read the insights
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
