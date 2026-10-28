import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Internal route. */
  to?: string;
  /** External or mailto link. */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  showArrow?: boolean;
  ariaLabel?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-bone text-ink hover:bg-ember hover:text-ink active:translate-y-px",
  secondary:
    "border border-line-strong bg-transparent text-bone hover:border-bone/50 hover:bg-white/[0.04] active:translate-y-px",
  ghost:
    "border border-transparent text-bone hover:text-ember-soft px-1",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 text-[0.8125rem]",
  md: "min-h-12 px-6 text-sm",
  lg: "min-h-14 px-8 text-[0.9375rem]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  to,
  href,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  loadingLabel = "Sending",
  showArrow = false,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      <span>{loading ? `${loadingLabel}…` : children}</span>
      {loading ? (
        <LoaderCircle
          className="size-4 animate-spin"
          aria-hidden="true"
          strokeWidth={1.75}
        />
      ) : showArrow ? (
        <ArrowUpRight
          className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
          strokeWidth={1.75}
        />
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
