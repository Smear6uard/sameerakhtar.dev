// Hand-tuned sample keypoints for the default Perception state.
// 21 normalized [x, y] pairs in [0, 1] matching MediaPipe HandLandmarker output.
// Pose: right hand, palm facing camera, fingers slightly spread, thumb out.

export type NormalizedPoint = readonly [number, number];

export const PERCEPTION_SAMPLE_KEYPOINTS: ReadonlyArray<NormalizedPoint> = [
  // 0  wrist
  [0.5, 0.86],
  // 1-4  thumb (CMC → TIP), curving out and up to the left
  [0.36, 0.79],
  [0.27, 0.69],
  [0.21, 0.59],
  [0.17, 0.5],
  // 5-8  index finger (MCP → TIP)
  [0.39, 0.55],
  [0.36, 0.41],
  [0.34, 0.31],
  [0.33, 0.22],
  // 9-12  middle finger
  [0.49, 0.52],
  [0.49, 0.36],
  [0.49, 0.24],
  [0.49, 0.14],
  // 13-16  ring finger
  [0.59, 0.54],
  [0.61, 0.39],
  [0.62, 0.27],
  [0.63, 0.18],
  // 17-20  pinky
  [0.68, 0.59],
  [0.72, 0.47],
  [0.74, 0.37],
  [0.76, 0.29],
];
