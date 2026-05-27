import { forwardRef } from 'react';

type HandCanvasProps = {
  className?: string;
};

const HandCanvas = forwardRef<HTMLCanvasElement, HandCanvasProps>(({ className }, ref) => {
  return <canvas ref={ref} className={className} />;
});

HandCanvas.displayName = 'HandCanvas';

export default HandCanvas;
