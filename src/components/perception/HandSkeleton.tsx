import { HAND_CONNECTIONS } from "./connections";
import type { NormalizedPoint } from "./perception-sample";

const FINGERTIPS = new Set([4, 8, 12, 16, 20]);

// Fixed colours: the viewfinder panel is dark in both themes.
const BONE = "#f2593f";
const JOINT = "#f7c9a8";
const RING = "#0b0d0f";

interface HandSkeletonProps {
  /** Hands as arrays of 21 normalized [x, y] points in [0, 1]. */
  hands: ReadonlyArray<ReadonlyArray<NormalizedPoint>>;
  /** Pixel size of the panel — used as the viewBox so circles stay round. */
  width: number;
  height: number;
  /** Draw bones in with a stroke animation (sample state only). */
  draw?: boolean;
  /** Gentle idle motion (sample state only). */
  sway?: boolean;
  className?: string;
}

export function HandSkeleton({
  hands,
  width,
  height,
  draw = false,
  sway = false,
  className,
}: HandSkeletonProps) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
    >
      {hands.map((points, handIndex) => (
        <g key={handIndex} className={sway ? "sway" : undefined}>
          {HAND_CONNECTIONS.map(([a, b], i) => {
            const pa = points[a];
            const pb = points[b];
            if (!pa || !pb) return null;
            return (
              <line
                key={`edge-${i}`}
                x1={pa[0] * width}
                y1={pa[1] * height}
                x2={pb[0] * width}
                y2={pb[1] * height}
                pathLength={1}
                stroke={BONE}
                strokeOpacity={0.9}
                strokeWidth={1.75}
                strokeLinecap="round"
                className={draw ? "animate-draw" : undefined}
                style={draw ? { animationDelay: `${160 + i * 26}ms` } : undefined}
              />
            );
          })}
          {points.map(([x, y], i) => {
            const r = FINGERTIPS.has(i) ? 4 : i === 0 ? 4.5 : 2.75;
            return (
              <g
                key={`pt-${i}`}
                className={draw ? "animate-fade-in" : undefined}
                style={draw ? { animationDelay: `${260 + i * 22}ms` } : undefined}
              >
                <circle cx={x * width} cy={y * height} r={r + 1.5} fill={RING} />
                <circle cx={x * width} cy={y * height} r={r} fill={JOINT} />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
