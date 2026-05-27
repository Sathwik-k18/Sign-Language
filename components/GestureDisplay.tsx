type GestureDisplayProps = {
  gesture: string;
  handDetected: boolean;
  fps: number;
};

export default function GestureDisplay({ gesture, handDetected, fps }: GestureDisplayProps) {
  return (
    <div className="mt-6 grid gap-3 text-center sm:grid-cols-3 sm:text-left">
      <div className="rounded-xl bg-slate-900/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Gesture</p>
        <p className="text-2xl font-semibold text-cyan-300">{gesture}</p>
      </div>

      <div className="rounded-xl bg-slate-900/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
        <p className={`text-2xl font-semibold ${handDetected ? 'text-emerald-300' : 'text-rose-300'}`}>
          {handDetected ? 'Hand Detected' : 'No Hand'}
        </p>
      </div>

      <div className="rounded-xl bg-slate-900/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">FPS</p>
        <p className="text-2xl font-semibold text-violet-300">{fps.toFixed(1)}</p>
      </div>
    </div>
  );
}
