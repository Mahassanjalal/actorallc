import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { Mark } from "@/components/visuals/Mark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 w-full -translate-x-1/2 select-none text-center font-sans text-[26vw] font-medium leading-none tracking-[-0.05em] text-white/[0.025]"
      >
        ACTORA
      </div>

      <div className="container-page relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
              aria-label={`${site.name} — home`}
            >
              <Mark className="size-8 text-bone transition-colors duration-300 group-hover:text-ember" />
              <span className="text-lg font-semibold tracking-[0.3em] text-bone">
                {site.wordmark}
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              {site.tagline}
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${site.email.general}`}
                className="link-underline inline-block text-lg tracking-[-0.01em] text-bone"
              >
                {site.email.general}
              </a>
              {site.phone && (
                <p>
                  <a
                    href={`tel:${site.phone.replace(/\s+/g, "")}`}
                    className="link-underline text-sm text-muted hover:text-bone"
                  >
                    {site.phone}
                  </a>
                </p>
              )}
            </div>

            <address className="mt-6 not-italic">
              <p className="label">
                {site.austin.locality}, {site.austin.regionName} —{" "}
                {site.austin.country}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-faint">
                {site.austin.coordinates.lat} / {site.austin.coordinates.lng}
              </p>
            </address>

            {site.social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {site.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label inline-flex items-center gap-1 hover:text-bone"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {Object.entries(site.footerNav).map(([heading, links]) => (
              <nav key={heading} aria-label={`${heading} links`}>
                <h2 className="label text-faint">{heading}</h2>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={`${heading}-${link.href}`}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted transition-colors hover:text-bone"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-faint">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#top" className="label hover:text-bone">
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
