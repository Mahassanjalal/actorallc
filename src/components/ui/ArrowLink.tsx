import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface ArrowLinkProps {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
  tone?: "light" | "ember";
  onClick?: () => void;
}

export function ArrowLink({
  to,
  href,
  children,
  className,
  tone = "light",
  onClick,
}: ArrowLinkProps) {
  const classes = cn(
    "group inline-flex items-center gap-2 text-sm font-medium tracking-[-0.01em] transition-colors",
    tone === "ember" ? "text-ember hover:text-ember-soft" : "text-bone hover:text-ember-soft",
    className,
  );
  const content = (
    <>
      <span className="link-underline">{children}</span>
      <ArrowRight
        className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
        aria-hidden="true"
        strokeWidth={1.6}
      />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} onClick={onClick}>
      {content}
    </a>
  );
}
