import WebcamFeed from '@/components/WebcamFeed';

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-cyan-300 sm:text-4xl">
          Real-Time Hand Gesture Recognition
        </h1>
        <p className="mb-8 text-center text-slate-300">
          Rule-based detection (no ML training): HELLO, GOOD, ONE, and PEACE.
        </p>

        <WebcamFeed />
      </div>
    </main>
  );
}
