import { HAND_CONNECTIONS } from "./connections";
import type { NormalizedPoint } from "./perception-sample";

interface HandSkeletonProps {
  /**
   * One or more hands. Each hand is an array of 21 normalized [x, y] points
   * in [0, 1]. Wrapped in an array so the same component renders both the
   * single-hand sample and the up-to-2-hand live state.
   */
  hands: ReadonlyArray<ReadonlyArray<NormalizedPoint>>;
  /** When true, animate the keypoints in (skipped under prefers-reduced-motion). */
  animate?: boolean;
  /** Mirror horizontally — used for selfie-camera live mode. */
  mirrored?: boolean;
  className?: string;
}

export function HandSkeleton({
  hands,
  animate = false,
  mirrored = false,
  className,
}: HandSkeletonProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      {hands.map((points, handIndex) => (
        <g key={handIndex}>
          {/* Skeleton edges — 1px regardless of container size */}
          {HAND_CONNECTIONS.map(([a, b], i) => {
            const pa = points[a];
            const pb = points[b];
            if (!pa || !pb) return null;
            return (
              <line
                key={`edge-${handIndex}-${i}`}
                x1={pa[0] * 100}
                y1={pa[1] * 100}
                x2={pb[0] * 100}
                y2={pb[1] * 100}
                stroke="var(--color-accent)"
                strokeOpacity={0.6}
                strokeWidth={1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {/* Keypoints — filled accent disc with non-scaling halo ring */}
          {points.map(([x, y], i) => (
            <g
              key={`pt-${handIndex}-${i}`}
              style={animate ? { animation: `fadeIn 0.5s ease-out ${i * 0.015}s both` } : undefined}
            >
              <circle
                cx={x * 100}
                cy={y * 100}
                r={1.2}
                fill="var(--color-accent)"
                fillOpacity={0.9}
              />
              <circle
                cx={x * 100}
                cy={y * 100}
                r={1.2}
                fill="none"
                stroke="var(--color-accent)"
                strokeOpacity={0.35}
                strokeWidth={3}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
