import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

export function usePixiApp(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onReady: (app: Application) => void,
  width = 400,
  height = 300,
) {
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const app = new Application();

    app.init({
      width,
      height,
      background: '#e8f3e9',
      antialias: true,
    }).then(() => {
      if (cancelled) {
        app.destroy(true);
        return;
      }
      // Style the canvas PixiJS created so it scales to fill the container.
      app.canvas.style.display = 'block';
      app.canvas.style.width = '100%';
      app.canvas.style.height = 'auto';
      // The canvas is often displayed well above its native pixel
      // resolution (e.g. a 768-wide buffer stretched to fill a much wider
      // column) -- without this the browser's default smoothing blurs the
      // pixel art instead of keeping it crisp/blocky.
      app.canvas.style.imageRendering = 'pixelated';
      container.appendChild(app.canvas);
      appRef.current = app;
      onReady(app);
    }).catch(err => {
      console.error('[PixiJS] init failed:', err);
    });

    return () => {
      cancelled = true;
      if (appRef.current) {
        appRef.current.destroy(true); // true = also remove the canvas from the DOM
        appRef.current = null;
      }
    };
  }, [onReady]); // eslint-disable-line react-hooks/exhaustive-deps

  return appRef;
}
