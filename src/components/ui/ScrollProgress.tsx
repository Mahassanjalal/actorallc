import { useEffect, useState } from "react";

/**
 * A thin reading-progress line anchored to the bottom edge of the header.
 * The initial state (scaleX 0) is identical on the server and the client, so
 * hydration never mismatches. The rAF throttle keeps scroll work cheap.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const documentElement = document.documentElement;
      const max = documentElement.scrollHeight - window.innerHeight;
      setProgress(
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0,
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px overflow-hidden"
    >
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-ember to-ember-soft transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
