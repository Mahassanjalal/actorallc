import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/config/site";

/**
 * The hero object: a slowly turning aperture inside measuring rings.
 * Pointer response is subtle, desktop-only and disabled for reduced motion.
 */
export function HeroObject({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 60, damping: 18, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 60, damping: 18, mass: 0.8 });
  const rotateY = useTransform(springX, [-1, 1], [-8, 8]);
  const rotateX = useTransform(springY, [-1, 1], [6, -6]);
  const translateX = useTransform(springX, [-1, 1], [-10, 10]);
  const translateY = useTransform(springY, [-1, 1], [-8, 8]);

  useEffect(() => {
    if (reducedMotion) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!media.matches) return;
    const element = ref.current;
    if (!element) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      pointerX.set(Math.max(-0.5, Math.min(0.5, x)) * 2);
      pointerY.set(Math.max(-0.5, Math.min(0.5, y)) * 2);
    };
    const onPointerLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerleave", onPointerLeave);
    return () => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [pointerX, pointerY, reducedMotion]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative isolate flex aspect-square w-full items-center justify-center",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,106,61,0.22),rgba(255,106,61,0.04)_45%,transparent_70%)] blur-2xl"
      />

      <motion.div
        style={
          reducedMotion
            ? undefined
            : { rotateX, rotateY, x: translateX, y: translateY }
        }
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <svg
          viewBox="0 0 640 640"
          className="h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff8a63" stopOpacity="0.92" />
              <stop offset="55%" stopColor="#ff6a3d" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#ff6a3d" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f4f1e9" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#f4f1e9" stopOpacity="0.06" />
            </linearGradient>
            <radialGradient id="core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd9c9" />
              <stop offset="60%" stopColor="#ff6a3d" />
              <stop offset="100%" stopColor="#ff6a3d" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* measuring rings */}
          <g className="animate-orbit-reverse" style={{ transformOrigin: "320px 320px" }}>
            <circle
              cx="320"
              cy="320"
              r="296"
              fill="none"
              stroke="url(#ring)"
              strokeWidth="1"
              strokeDasharray="1 9"
            />
            {Array.from({ length: 48 }, (_, index) => {
              const angle = (index * 360) / 48;
              const long = index % 4 === 0;
              const inner = long ? 276 : 286;
              const outer = 296;
              const radians = ((angle - 90) * Math.PI) / 180;
              return (
                <line
                  key={index}
                  x1={320 + inner * Math.cos(radians)}
                  y1={320 + inner * Math.sin(radians)}
                  x2={320 + outer * Math.cos(radians)}
                  y2={320 + outer * Math.sin(radians)}
                  stroke="#f4f1e9"
                  strokeOpacity={long ? 0.4 : 0.16}
                  strokeWidth="1"
                />
              );
            })}
          </g>

          <circle
            cx="320"
            cy="320"
            r="232"
            fill="none"
            stroke="#f4f1e9"
            strokeOpacity="0.16"
            strokeWidth="1"
          />
          <circle
            cx="320"
            cy="320"
            r="150"
            fill="none"
            stroke="#f4f1e9"
            strokeOpacity="0.09"
            strokeWidth="1"
          />

          {/* aperture blades */}
          <g className="animate-orbit" style={{ transformOrigin: "320px 320px" }}>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <path
                key={angle}
                d="M320 320 L320 72 C430 78 512 158 524 272 C444 220 380 300 320 320 Z"
                fill="url(#blade)"
                stroke="#ff8a63"
                strokeOpacity="0.18"
                strokeWidth="1"
                transform={`rotate(${angle} 320 320)`}
              />
            ))}
            <circle
              cx="320"
              cy="320"
              r="62"
              fill="var(--color-ink)"
              fillOpacity="0.72"
              stroke="#ff8a63"
              strokeOpacity="0.5"
            />
            <circle cx="320" cy="320" r="78" fill="url(#core)" opacity="0.28" />
            <circle cx="320" cy="320" r="5" fill="#ffd9c9" />
          </g>

          {/* signal dot on the outer ring */}
          <g className="animate-orbit" style={{ transformOrigin: "320px 320px", animationDuration: "26s" }}>
            <circle cx="320" cy="24" r="4" fill="#ff6a3d" />
          </g>

          <g stroke="#f4f1e9" strokeOpacity="0.2">
            <line x1="320" y1="12" x2="320" y2="38" />
            <line x1="320" y1="602" x2="320" y2="628" />
            <line x1="12" y1="320" x2="38" y2="320" />
            <line x1="602" y1="320" x2="628" y2="320" />
          </g>
        </svg>

        <div className="absolute inset-x-0 -bottom-4 flex items-end justify-between px-2 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
          <span>{site.austin.coordinates.lat}</span>
          <span className="text-ember/80">Signal / 01</span>
          <span>{site.austin.coordinates.lng}</span>
        </div>
      </motion.div>

      <span className="absolute -left-2 top-6 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-faint sm:block">
        {site.austin.locality}, {site.austin.region}
      </span>
      <span className="absolute -right-2 bottom-10 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-faint sm:block">
        ACTORA / LLC
      </span>
    </div>
  );
}
