// Standard MediaPipe HAND_CONNECTIONS topology — 21 keypoints, 21 edges.
// https://developers.google.com/mediapipe/solutions/vision/hand_landmarker
//
// Index map:
//   0  wrist
//   1-4   thumb (CMC, MCP, IP, TIP)
//   5-8   index (MCP, PIP, DIP, TIP)
//   9-12  middle
//   13-16 ring
//   17-20 pinky

export const HAND_CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  // Thumb
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  // Index finger
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  // Middle finger
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  // Ring finger
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  // Pinky
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  // Palm base
  [0, 17],
];
