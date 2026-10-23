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
 * Deterministic, dependency-free artwork: layered arcs, hairlines and a
 * single signal point. Art-directed, not stock imagery — and zero network
 * requests or layout shift.
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
  const arcs = Array.from({ length: 5 }, (_, index) => {
    const cx = 190 + random() * 420;
    const cy = 130 + random() * 340;
    const radius = 90 + random() * 250;
    return {
      key: index,
      cx,
      cy,
      radius,
      opacity: 0.16 + random() * 0.5,
      width: 0.8 + random() * 1.4,
      start: random() * 360,
      sweep: 60 + random() * 220,
    };
  });
  const points = Array.from({ length: 7 }, (_, index) => ({
    key: index,
    x: 40 + random() * 720,
    y: 40 + random() * 520,
    r: 1 + random() * 2.4,
  }));

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
            <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="600" fill={`url(#bg-${uid})`} />
        <circle
          cx={430}
          cy={240}
          r={320}
          fill={`url(#glow-${uid})`}
          opacity="0.22"
        />

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

        <g stroke="#f4f1e9" strokeOpacity="0.09" strokeWidth="0.75">
          {Array.from({ length: 7 }, (_, index) => (
            <line
              key={`h-${index}`}
              x1="0"
              y1={60 + index * 80}
              x2="800"
              y2={60 + index * 80}
            />
          ))}
          {Array.from({ length: 9 }, (_, index) => (
            <line
              key={`v-${index}`}
              x1={40 + index * 90}
              y1="0"
              x2={40 + index * 90}
              y2="600"
            />
          ))}
        </g>

        <circle cx="612" cy="132" r="52" fill="none" stroke="#f4f1e9" strokeOpacity="0.16" />
        <circle cx="612" cy="132" r="6" fill={accent} />

        {points.map((point) => (
          <circle
            key={point.key}
            cx={point.x}
            cy={point.y}
            r={point.r}
            fill="#f4f1e9"
            opacity="0.28"
          />
        ))}
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
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
