import type { NormalizedLandmark } from '@mediapipe/hands';

export type GestureName = 'HELLO' | 'GOOD' | 'ONE' | 'PEACE' | 'UNKNOWN';

const TIP_IDS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 } as const;
const PIP_IDS = { thumb: 3, index: 6, middle: 10, ring: 14, pinky: 18 } as const;

export type FingerState = {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
};

// Basic geometric checks for whether each finger is extended.
export function getFingerState(landmarks: NormalizedLandmark[]): FingerState {
  const isThumbExtended = landmarks[TIP_IDS.thumb].x < landmarks[PIP_IDS.thumb].x;
  const isIndexExtended = landmarks[TIP_IDS.index].y < landmarks[PIP_IDS.index].y;
  const isMiddleExtended = landmarks[TIP_IDS.middle].y < landmarks[PIP_IDS.middle].y;
  const isRingExtended = landmarks[TIP_IDS.ring].y < landmarks[PIP_IDS.ring].y;
  const isPinkyExtended = landmarks[TIP_IDS.pinky].y < landmarks[PIP_IDS.pinky].y;

  return {
    thumb: isThumbExtended,
    index: isIndexExtended,
    middle: isMiddleExtended,
    ring: isRingExtended,
    pinky: isPinkyExtended
  };
}

// Rule-based gesture classification (no ML).
export function detectGesture(landmarks: NormalizedLandmark[]): GestureName {
  const fingers = getFingerState(landmarks);

  if (fingers.thumb && fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
    return 'HELLO';
  }

  if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    return 'GOOD';
  }

  if (!fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    return 'ONE';
  }

  if (!fingers.thumb && fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    return 'PEACE';
  }

  return 'UNKNOWN';
}
