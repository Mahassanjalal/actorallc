import { useCallback, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a card in the `.card-spotlight` treatment: a soft light that follows
 * the pointer across the card surface. Desktop pointer only, disabled for
 * reduced motion, and the markup is identical on the server (the CSS vars
 * default to the card centre), so hydration stays mismatch-free.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const attach = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;

    const pointerFine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!pointerFine || reducedMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty(
        "--spot-x",
        `${Math.round(((event.clientX - rect.left) / rect.width) * 100)}%`,
      );
      element.style.setProperty(
        "--spot-y",
        `${Math.round(((event.clientY - rect.top) / rect.height) * 100)}%`,
      );
    };

    element.addEventListener("pointermove", onPointerMove);
    return () => element.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div ref={attach} className={cn("card-spotlight", className)}>
      {children}
    </div>
  );
}
