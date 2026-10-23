import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  meta,
  children,
  className,
}: PageHeaderProps) {
  return (
    <section className={cn("relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-[420px] aurora opacity-70"
      />
      <div className="container-page relative">
        <p className="fade-up label">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
          {eyebrow}
        </p>
        <h1 className="fade-up mt-6 max-w-[22ch] text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.94] tracking-[-0.04em] text-bone">
          {title}
        </h1>
        {intro && (
          <p className="fade-up lede mt-7 max-w-2xl">{intro}</p>
        )}
        {meta && <div className="fade-up mt-8">{meta}</div>}
        {children}
      </div>
    </section>
  );
}
