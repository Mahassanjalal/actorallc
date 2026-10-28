import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Mark } from "@/components/visuals/Mark";

export function Header() {
  // Track the path the menu was opened on. Navigation changes the path, which
  // closes the menu without a setState-in-effect cascade.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const open = menuPath === location.pathname;
  const setOpen = (value: boolean) =>
    setMenuPath(value ? location.pathname : null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuPath(null);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-ink/85 backdrop-blur-md supports-[backdrop-filter]:bg-ink/70"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label={`${site.name} — home`}
        >
          <Mark className="size-6 text-bone transition-colors duration-300 group-hover:text-ember" />
          <span className="text-[0.9rem] font-semibold tracking-[0.3em] text-bone">
            {site.wordmark}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group relative inline-flex items-center gap-2 py-2 text-[0.8125rem] tracking-[-0.005em] transition-colors",
                      isActive ? "text-bone" : "text-muted hover:text-bone",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1 rounded-full transition-colors",
                          isActive ? "bg-ember" : "bg-transparent",
                        )}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Button to="/start-a-project" variant="secondary" size="sm" showArrow>
              Start a project
            </Button>
          </div>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuPath(open ? null : location.pathname)}
            className="flex size-11 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" strokeWidth={1.5} />
            ) : (
              <Menu className="size-5" aria-hidden="true" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-0 z-[70] flex h-dvh flex-col bg-ink lg:hidden"
          >
            <div className="container-page flex h-[72px] shrink-0 items-center justify-between border-b border-line">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-2.5"
                aria-label={`${site.name} — home`}
              >
                <Mark className="size-6 text-bone" />
                <span className="text-[0.9rem] font-semibold tracking-[0.3em] text-bone">
                  {site.wordmark}
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                data-autofocus
                className="flex size-11 items-center justify-center rounded-full border border-line text-bone"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden="true" strokeWidth={1.5} />
              </button>
            </div>

            <nav
              aria-label="Mobile primary"
              className="container-page flex-1 overflow-y-auto py-8 scroll-thin"
            >
              <ul className="divide-y divide-line border-y border-line">
                {site.nav.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + index * 0.04,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <NavLink
                      to={item.href}
                      onClick={closeMenu}
                      className="flex items-baseline justify-between gap-4 py-5"
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={cn(
                              "text-2xl tracking-[-0.02em]",
                              isActive ? "text-bone" : "text-muted",
                            )}
                          >
                            {item.label}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 space-y-6">
                <Button
                  to="/start-a-project"
                  onClick={closeMenu}
                  variant="primary"
                  size="lg"
                  showArrow
                  className="w-full"
                >
                  Start a project
                </Button>
                <div className="flex flex-col gap-2 text-sm text-muted">
                  <a
                    href={`mailto:${site.email.general}`}
                    className="link-underline w-fit text-bone"
                  >
                    {site.email.general}
                  </a>
                  <p className="label">
                    {site.austin.locality}, {site.austin.regionName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5">
                  {site.footerNav.Legal.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={closeMenu}
                      className="label hover:text-bone"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <ArrowUpRight
                    className="ml-auto size-4 text-faint"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
