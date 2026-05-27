'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, type NormalizedLandmarkList, type Results } from '@mediapipe/hands';
import HandCanvas from './HandCanvas';
import GestureDisplay from './GestureDisplay';
import { detectGesture, type GestureName } from '@/utils/gestureLogic';
import { drawHands } from '@/utils/drawHands';

const VIDEO_WIDTH = 960;
const VIDEO_HEIGHT = 540;

export default function WebcamFeed() {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gesture, setGesture] = useState<GestureName>('UNKNOWN');
  const [handDetected, setHandDetected] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [fps, setFps] = useState(0);

  const lastFrameTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6
    });

    const onResults = (results: Results) => {
      const now = performance.now();
      const previous = lastFrameTimeRef.current;
      if (previous) {
        const delta = now - previous;
        setFps(1000 / delta);
      }
      lastFrameTimeRef.current = now;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const handLandmarks = results.multiHandLandmarks?.[0] as NormalizedLandmarkList | undefined;

      if (!handLandmarks) {
        setHandDetected(false);
        setGesture('UNKNOWN');
        return;
      }

      setHandDetected(true);
      setGesture(detectGesture(handLandmarks));

      if (showLandmarks) {
        drawHands(ctx, handLandmarks, canvas.width, canvas.height);
      }
    };

    hands.onResults(onResults);

    let camera: Camera | null = null;
    const start = async () => {
      const video = webcamRef.current?.video;
      if (!video) return;

      camera = new Camera(video, {
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        onFrame: async () => {
          await hands.send({ image: video });
        }
      });

      camera.start();
    };

    const timer = window.setInterval(() => {
      if (webcamRef.current?.video?.readyState === 4) {
        window.clearInterval(timer);
        start();
      }
    }, 100);

    return () => {
      window.clearInterval(timer);
      camera?.stop();
      hands.close();
    };
  }, [showLandmarks]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-cyan-900/20">
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          className="h-auto w-full"
          videoConstraints={{
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT,
            facingMode: 'user'
          }}
        />

        <HandCanvas
          ref={canvasRef}
          className="pointer-events-none absolute left-0 top-0 h-full w-full"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowLandmarks((prev) => !prev)}
          className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
        >
          {showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}
        </button>
      </div>

      <GestureDisplay gesture={gesture} handDetected={handDetected} fps={fps} />
    </div>
  );
}
