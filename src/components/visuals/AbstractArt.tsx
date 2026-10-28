import { useId } from "react";
import { cn } from "@/lib/cn";

interface AbstractArtProps {
  from: string;
  to: string;
  accent: string;
  seed: number;
  className?: string;
  /** Decorative by default; pass a description when it carries meaning. */
  label?: string;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic, dependency-free artwork: layered geometric patterns with
 * circles, arcs, grids and signal points. Art-directed for software
 * portfolios — zero network requests, zero layout shift.
 */
export function AbstractArt({
  from,
  to,
  accent,
  seed,
  className,
  label,
}: AbstractArtProps) {
  const uid = useId().replace(/[:]/g, "");
  const random = mulberry32(seed);

  // Generate varied geometric elements based on seed
  const circles = Array.from({ length: 8 }, (_, index) => ({
    key: `circle-${index}`,
    cx: 50 + random() * 700,
    cy: 50 + random() * 500,
    r: 20 + random() * 120,
    opacity: 0.08 + random() * 0.25,
    strokeWidth: 0.5 + random() * 1.5,
  }));

  const arcs = Array.from({ length: 6 }, (_, index) => {
    const cx = 100 + random() * 600;
    const cy = 80 + random() * 440;
    const radius = 60 + random() * 200;
    return {
      key: `arc-${index}`,
      cx,
      cy,
      radius,
      opacity: 0.12 + random() * 0.35,
      width: 0.6 + random() * 1.2,
      start: random() * 360,
      sweep: 45 + random() * 180,
    };
  });

  const points = Array.from({ length: 12 }, (_, index) => ({
    key: `point-${index}`,
    x: 30 + random() * 740,
    y: 30 + random() * 540,
    r: 0.8 + random() * 2,
    opacity: 0.15 + random() * 0.35,
  }));

  // Grid lines for tech feel
  const gridLines = Array.from({ length: 12 }, (_, index) => ({
    key: `grid-${index}`,
    y: 50 + index * 45,
    opacity: 0.04 + random() * 0.06,
  }));

  // Central glow position varies by seed
  const glowCx = 350 + random() * 100;
  const glowCy = 200 + random() * 100;

  return (
    <div className={cn("relative overflow-hidden bg-ink", className)}>
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
          <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.7" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`line-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="800" height="600" fill={`url(#bg-${uid})`} />

        {/* Central glow */}
        <circle
          cx={glowCx}
          cy={glowCy}
          r={280 + random() * 80}
          fill={`url(#glow-${uid})`}
          opacity="0.25"
        />

        {/* Subtle grid */}
        <g stroke="#f4f1e9" strokeOpacity="0.06" strokeWidth="0.5">
          {gridLines.map((line) => (
            <line
              key={line.key}
              x1="0"
              y1={line.y}
              x2="800"
              y2={line.y}
            />
          ))}
          {Array.from({ length: 16 }, (_, index) => (
            <line
              key={`vg-${index}`}
              x1={50 + index * 50}
              y1="0"
              x2={50 + index * 50}
              y2="600"
              opacity={0.04}
            />
          ))}
        </g>

        {/* Circular elements */}
        {circles.map((circle) => (
          <circle
            key={circle.key}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill="none"
            stroke={accent}
            strokeOpacity={circle.opacity}
            strokeWidth={circle.strokeWidth}
          />
        ))}

        {/* Arc elements */}
        {arcs.map((arc) => (
          <path
            key={arc.key}
            d={describeArc(arc.cx, arc.cy, arc.radius, arc.start, arc.sweep)}
            fill="none"
            stroke={accent}
            strokeOpacity={arc.opacity}
            strokeWidth={arc.width}
            strokeLinecap="round"
          />
        ))}

        {/* Outer ring accent */}
        <circle
          cx="640"
          cy="80"
          r={60 + random() * 30}
          fill="none"
          stroke="#f4f1e9"
          strokeOpacity="0.12"
          strokeWidth="0.8"
        />
        <circle
          cx="640"
          cy="80"
          r={8 + random() * 4}
          fill={accent}
          opacity="0.9"
        />

        {/* Decorative dots */}
        {points.map((point) => (
          <circle
            key={point.key}
            cx={point.x}
            cy={point.y}
            r={point.r}
            fill="#f4f1e9"
            opacity={point.opacity}
          />
        ))}

        {/* Top accent line */}
        <line
          x1="0"
          y1="0"
          x2="800"
          y2="0"
          stroke={accent}
          strokeOpacity="0.15"
          strokeWidth="2"
        />
      </svg>

      {/* Bottom gradient for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 via-transparent to-transparent"
      />
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  sweep: number,
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle + sweep);
  const largeArc = sweep <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}
