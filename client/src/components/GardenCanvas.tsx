import { useRef, useEffect, useCallback } from 'react';
import { Application, Graphics } from 'pixi.js';
import { usePixiApp } from '../hooks/usePixiApp';
import styles from './GardenCanvas.module.css';

const W = 400;
const H = 300;
const CX = W / 2;
const SOIL_Y = H * 0.68;

interface Props {
  stage: number;
}

function drawPot(g: Graphics) {
  const rimW = 120;
  const rimH = 16;
  const bodyTopW = 100;
  const bodyBotW = 76;
  const bodyH = 88;

  g.rect(CX - rimW / 2, SOIL_Y - rimH, rimW, rimH);
  g.fill(0xd4784d);

  g.moveTo(CX - bodyTopW / 2, SOIL_Y);
  g.lineTo(CX + bodyTopW / 2, SOIL_Y);
  g.lineTo(CX + bodyBotW / 2, SOIL_Y + bodyH);
  g.lineTo(CX - bodyBotW / 2, SOIL_Y + bodyH);
  g.closePath();
  g.fill(0xc1673c);

  g.ellipse(CX, SOIL_Y - 2, rimW / 2 - 6, 12);
  g.fill(0x6b4226);
}

function drawPlant(g: Graphics, stage: number) {
  g.clear();

  switch (stage) {
    case 0:
      g.ellipse(CX, SOIL_Y - 6, 10, 7);
      g.fill(0x8b5e3c);
      break;

    case 1:
      g.rect(CX - 2, SOIL_Y - 36, 4, 30);
      g.fill(0x7bc67a);
      g.ellipse(CX - 12, SOIL_Y - 36, 13, 8);
      g.fill(0x7bc67a);
      g.ellipse(CX + 12, SOIL_Y - 40, 13, 8);
      g.fill(0x6db56a);
      break;

    case 2:
      g.rect(CX - 2, SOIL_Y - 68, 4, 56);
      g.fill(0x5a8c3f);
      g.circle(CX, SOIL_Y - 70, 22);
      g.fill(0x6bbf4e);
      g.circle(CX - 20, SOIL_Y - 58, 16);
      g.fill(0x5daf42);
      g.circle(CX + 20, SOIL_Y - 58, 16);
      g.fill(0x5daf42);
      break;

    case 3:
      g.rect(CX - 3, SOIL_Y - 100, 6, 84);
      g.fill(0x4a7a33);
      g.circle(CX, SOIL_Y - 104, 34);
      g.fill(0x6bbf4e);
      g.circle(CX - 30, SOIL_Y - 84, 24);
      g.fill(0x5daf42);
      g.circle(CX + 30, SOIL_Y - 84, 24);
      g.fill(0x5daf42);
      g.circle(CX - 14, SOIL_Y - 118, 20);
      g.fill(0x7dcf5a);
      g.circle(CX + 14, SOIL_Y - 118, 20);
      g.fill(0x7dcf5a);
      break;
  }
}

export default function GardenCanvas({ stage }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plantRef = useRef<Graphics | null>(null);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const onReady = useCallback((app: Application) => {
    const pot = new Graphics();
    drawPot(pot);
    app.stage.addChild(pot);

    const plant = new Graphics();
    drawPlant(plant, stageRef.current);
    app.stage.addChild(plant);
    plantRef.current = plant;

    let t = 0;
    app.ticker.add(() => {
      t += 0.02;
      plant.y = Math.sin(t) * 2;
    });
  }, []);

  useEffect(() => {
    if (!plantRef.current) return;
    drawPlant(plantRef.current, stage);
  }, [stage]);

  usePixiApp(containerRef, onReady, W, H);

  return <div className={styles.wrapper} ref={containerRef} />;
}
