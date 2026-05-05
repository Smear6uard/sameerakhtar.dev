import { useEffect, useState } from "react";
import { HandSkeleton } from "./HandSkeleton";
import { PERCEPTION_SAMPLE_KEYPOINTS } from "./perception-sample";

const SAMPLE_IMAGE = "/perception/sample-hand.jpg";

/**
 * Default state — a stylized hand silhouette plus the 21 pre-computed
 * keypoints. If a real photo is added at /public/perception/sample-hand.jpg
 * it takes priority; otherwise the SVG silhouette renders inline.
 */
export function SampleOverlay() {
  const [imageOk, setImageOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      if (!cancelled) setImageOk(true);
    };
    probe.onerror = () => {
      if (!cancelled) setImageOk(false);
    };
    probe.src = SAMPLE_IMAGE;
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="absolute inset-0">
      {imageOk ? (
        <img
          src={SAMPLE_IMAGE}
          alt="Sample hand for landmark detection"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <HandSilhouette />
      )}
      <HandSkeleton
        hands={[PERCEPTION_SAMPLE_KEYPOINTS]}
        animate
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

/**
 * Inline SVG hand silhouette used when no photo asset is present.
 * Drawn loosely from the sample keypoints so the overlay reads cleanly.
 */
function HandSilhouette() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="perception-bg" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="var(--color-bg-tertiary)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-bg-primary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="perception-hand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-text-primary)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--color-text-primary)" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#perception-bg)" />
      <path
        // Rough palm + fingers contour aligned to the sample keypoints.
        d="M 38 88
           C 28 84, 22 78, 18 70
           L 14 56
           C 12 50, 14 46, 18 46
           C 22 46, 26 50, 30 56
           L 32 56
           L 30 26
           C 30 20, 33 17, 36 17
           C 39 17, 42 20, 42 26
           L 43 50
           L 45 50
           L 45 14
           C 45 9, 48 6, 51 6
           C 54 6, 57 9, 57 14
           L 56 50
           L 58 50
           L 60 18
           C 60 13, 63 11, 65 11
           C 68 11, 70 13, 70 18
           L 68 52
           L 70 52
           L 73 30
           C 74 26, 76 24, 78 24
           C 81 24, 82 27, 81 31
           L 78 60
           C 78 72, 72 84, 62 89
           Z"
        fill="url(#perception-hand)"
        stroke="var(--color-accent)"
        strokeOpacity="0.08"
        strokeWidth="0.5"
      />
    </svg>
  );
}
