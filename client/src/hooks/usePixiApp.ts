import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

export function usePixiApp(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onReady: (app: Application) => void
) {
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const app = new Application();

    app.init({
      canvas,
      background: '#e8f3e9',
      antialias: true,
      resizeTo: canvas.parentElement ?? canvas,
    }).then(() => {
      if (cancelled) {
        app.destroy(false);
        return;
      }
      appRef.current = app;
      onReady(app);
    });

    return () => {
      cancelled = true;
      if (appRef.current) {
        appRef.current.destroy(false);
        appRef.current = null;
      }
    };
  }, [onReady]); // eslint-disable-line react-hooks/exhaustive-deps

  return appRef;
}
