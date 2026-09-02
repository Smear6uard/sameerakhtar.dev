import { HandSkeleton } from "./HandSkeleton";
import { PERCEPTION_SAMPLE_KEYPOINTS, type NormalizedPoint } from "./perception-sample";

// Landmark names from the MediaPipe hand topology, shown on the sample so
// the diagram reads as a real keypoint set rather than decoration.
const LABELS: ReadonlyArray<{
  index: number;
  name: string;
  dx: number;
  dy: number;
  compact: boolean;
}> = [
  { index: 0, name: "wrist", dx: 14, dy: 4, compact: false },
  { index: 4, name: "thumb_tip", dx: -12, dy: -18, compact: false },
  { index: 8, name: "index_tip", dx: -12, dy: -22, compact: true },
  { index: 12, name: "middle_tip", dx: 12, dy: -20, compact: false },
  { index: 20, name: "pinky_tip", dx: 12, dy: -8, compact: true },
];

// Bounding box of the sample hand in its own normalized space.
const HAND_BOX = { minX: 0.17, maxX: 0.76, minY: 0.14, maxY: 0.86 };

/**
 * Fit the sample hand into the panel with a uniform pixel scale, leaving
 * room for the readout above and the controls below. Keeps the hand's
 * proportions identical across panel sizes.
 */
function fitSample(width: number, height: number, compact: boolean): NormalizedPoint[] {
  const left = width * 0.08;
  const right = width * 0.92;
  const top = height * (compact ? 0.17 : 0.15);
  const bottom = height * (compact ? 0.63 : 0.8);

  const handW = HAND_BOX.maxX - HAND_BOX.minX;
  const handH = HAND_BOX.maxY - HAND_BOX.minY;
  const scale = Math.min((right - left) / handW, (bottom - top) / handH);
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  const handCx = (HAND_BOX.minX + HAND_BOX.maxX) / 2;
  const handCy = (HAND_BOX.minY + HAND_BOX.maxY) / 2;

  return PERCEPTION_SAMPLE_KEYPOINTS.map(([x, y]) => [
    (cx + (x - handCx) * scale) / width,
    (cy + (y - handCy) * scale) / height,
  ]);
}

interface SampleOverlayProps {
  width: number;
  height: number;
  /** Fade the labels out while a live session is starting. */
  dim?: boolean;
}

export function SampleOverlay({ width, height, dim = false }: SampleOverlayProps) {
  const compact = width < 480;
  const points = fitSample(width, height, compact);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity: dim ? 0.35 : 1 }}
    >
      <HandSkeleton
        hands={[points]}
        width={width}
        height={height}
        draw
        sway
        className="absolute inset-0"
      />
      {LABELS.filter((label) => !compact || label.compact).map(({ index, name, dx, dy }) => {
        const [x, y] = points[index];
        const alignRight = dx < 0;
        return (
          <span
            key={name}
            className="animate-fade-in pointer-events-none absolute font-mono text-[10px] tracking-[0.08em] whitespace-nowrap"
            style={{
              left: `calc(${x * 100}% + ${dx}px)`,
              top: `calc(${y * 100}% + ${dy}px)`,
              transform: alignRight ? "translateX(-100%)" : undefined,
              color: "rgba(230, 241, 255, 0.55)",
              animationDelay: `${900 + index * 30}ms`,
            }}
          >
            {name}
          </span>
        );
      })}
    </div>
  );
}
