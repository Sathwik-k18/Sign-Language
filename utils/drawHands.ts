import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS, type NormalizedLandmark } from '@mediapipe/hands';

export function drawHands(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
    color: '#22d3ee',
    lineWidth: 3
  });

  drawLandmarks(ctx, landmarks, {
    color: '#f8fafc',
    radius: 2,
    lineWidth: 1
  });

  ctx.restore();
}
