import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * A single, slow marquee used as a rhythm break. It pauses on hover and is
 * stopped completely for reduced-motion users.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const row = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative overflow-hidden border-y border-line py-5",
        className,
      )}
    >
      <div className="marquee-track flex w-max items-center gap-10 will-change-transform group-hover:[animation-play-state:paused]">
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.24em] text-muted"
            aria-hidden={index >= items.length ? "true" : undefined}
          >
            <span className="size-1 rounded-full bg-ember/70" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent"
      />
    </div>
  );
}
