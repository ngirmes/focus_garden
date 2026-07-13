import { useRef, useEffect, useCallback } from "react";
import { Application, Assets, Graphics, Sprite } from "pixi.js";
import { usePixiApp } from "../hooks/usePixiApp";
import potUrl from "../assets/pot2.png";
import styles from "./GardenCanvas.module.css";

const W = 400;
const H = 300;
const CX = W / 2;
const SOIL_Y = H;
const POT_SCALE = 6; // pot2.png is a 32x32 source sprite; integer-scale it up to stay crisp

interface Props {
  stage: number | null;
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
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const onReady = useCallback(async (app: Application) => {
    const potTexture = await Assets.load(potUrl);
    potTexture.source.scaleMode = "nearest";
    const pot = new Sprite(potTexture);
    pot.anchor.set(0.5, 1);
    pot.position.set(CX, SOIL_Y);
    pot.scale.set(POT_SCALE);
    app.stage.addChild(pot);

    if (stageRef.current !== null) {
      const plant = new Graphics();
      drawPlant(plant, stageRef.current);
      app.stage.addChild(plant);
      plantRef.current = plant;
    }

    let t = 0;
    app.ticker.add(() => {
      const p = plantRef.current;
      if (!p) return;
      t += 0.02;
      p.y = Math.sin(t) * 2;
    });
  }, []);

  useEffect(() => {
    if (!plantRef.current) return;
    if (stage === null) return;
    drawPlant(plantRef.current, stage);
  }, [stage]);

  const appRef = usePixiApp(containerRef, onReady, W, H);

  // Lazily create the plant graphics the moment a seed is planted, since
  // onReady may have already run while there was no active plant yet.
  useEffect(() => {
    if (plantRef.current || stage === null || !appRef.current) return;
    const plant = new Graphics();
    drawPlant(plant, stage);
    appRef.current.stage.addChild(plant);
    plantRef.current = plant;
  }, [stage, appRef]);

  return <div className={styles.wrapper} ref={containerRef} />;
}
