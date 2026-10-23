import { cn } from "@/lib/cn";

interface MarkProps {
  className?: string;
  /** Render the outer ring; disable for very small sizes. */
  ring?: boolean;
}

/**
 * Actora's aperture mark: six blades opening around a signal point.
 * Monochrome via currentColor so it works anywhere in the interface.
 */
export function Mark({ className, ring = true }: MarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      {ring && (
        <circle
          cx="16"
          cy="16"
          r="14.5"
          stroke="currentColor"
          strokeOpacity="0.32"
          strokeWidth="0.9"
        />
      )}
      <g fill="currentColor">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            key={angle}
            d="M16 4.2 L16 16 L26.6 20.9 A12.6 12.6 0 0 0 16 4.2 Z"
            opacity="0.92"
            transform={`rotate(${angle} 16 16)`}
          />
        ))}
      </g>
      <circle cx="16" cy="16" r="3.1" fill="var(--color-ink)" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-sans text-[0.95rem] font-semibold tracking-[0.32em] text-bone",
        className,
      )}
    >
      ACTORA
    </span>
  );
}
