import { useRef, useEffect, useCallback } from 'react';
import { Application, Graphics } from 'pixi.js';
import { usePixiApp } from '../hooks/usePixiApp';
import styles from './GardenCanvas.module.css';

interface Props {
  stage: number;
}

function drawPot(g: Graphics, cx: number, soilY: number) {
  const rimW = 120;
  const rimH = 16;
  const bodyTopW = 100;
  const bodyBotW = 76;
  const bodyH = 88;

  // Rim
  g.rect(cx - rimW / 2, soilY - rimH, rimW, rimH).fill({ color: 0xd4784d });

  // Body (trapezoid via path)
  g.moveTo(cx - bodyTopW / 2, soilY)
    .lineTo(cx + bodyTopW / 2, soilY)
    .lineTo(cx + bodyBotW / 2, soilY + bodyH)
    .lineTo(cx - bodyBotW / 2, soilY + bodyH)
    .closePath()
    .fill({ color: 0xc1673c });

  // Soil surface
  g.ellipse(cx, soilY - 2, rimW / 2 - 6, 12).fill({ color: 0x6b4226 });
}

function drawPlant(g: Graphics, stage: number, cx: number, soilY: number) {
  g.clear();

  switch (stage) {
    case 0: // Seed
      g.ellipse(cx, soilY - 6, 10, 7).fill({ color: 0x8b5e3c });
      break;

    case 1: // Sprout
      g.rect(cx - 2, soilY - 36, 4, 30).fill({ color: 0x7bc67a });
      g.ellipse(cx - 12, soilY - 36, 13, 8).fill({ color: 0x7bc67a });
      g.ellipse(cx + 12, soilY - 40, 13, 8).fill({ color: 0x6db56a });
      break;

    case 2: // Young plant
      g.rect(cx - 2, soilY - 68, 4, 56).fill({ color: 0x5a8c3f });
      g.circle(cx, soilY - 70, 22).fill({ color: 0x6bbf4e });
      g.circle(cx - 20, soilY - 58, 16).fill({ color: 0x5daf42 });
      g.circle(cx + 20, soilY - 58, 16).fill({ color: 0x5daf42 });
      break;

    case 3: // Mature
      g.rect(cx - 3, soilY - 100, 6, 84).fill({ color: 0x4a7a33 });
      g.circle(cx, soilY - 104, 34).fill({ color: 0x6bbf4e });
      g.circle(cx - 30, soilY - 84, 24).fill({ color: 0x5daf42 });
      g.circle(cx + 30, soilY - 84, 24).fill({ color: 0x5daf42 });
      g.circle(cx - 14, soilY - 118, 20).fill({ color: 0x7dcf5a });
      g.circle(cx + 14, soilY - 118, 20).fill({ color: 0x7dcf5a });
      break;
  }
}

export default function GardenCanvas({ stage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plantRef = useRef<Graphics | null>(null);

  // Always tracks the latest stage without needing it in onReady's deps.
  const stageRef = useRef(stage);
  stageRef.current = stage;

  // Stable reference to screen center — set once in onReady.
  const coordsRef = useRef({ cx: 0, soilY: 0 });

  const onReady = useCallback((app: Application) => {
    const { width, height } = app.screen;
    const cx = width / 2;
    const soilY = height * 0.6;
    coordsRef.current = { cx, soilY };

    const pot = new Graphics();
    drawPot(pot, cx, soilY);
    app.stage.addChild(pot);

    const plant = new Graphics();
    drawPlant(plant, stageRef.current, cx, soilY);
    app.stage.addChild(plant);
    plantRef.current = plant;

    // Gentle idle bob
    let t = 0;
    app.ticker.add(() => {
      t += 0.02;
      plant.y = Math.sin(t) * 2;
    });
  }, []);

  // Redraw when stage changes after the scene is already set up.
  useEffect(() => {
    if (!plantRef.current) return;
    const { cx, soilY } = coordsRef.current;
    drawPlant(plantRef.current, stage, cx, soilY);
  }, [stage]);

  usePixiApp(canvasRef, onReady);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
