import { useRef, useEffect, useCallback } from "react";
import type { DragEvent } from "react";
import { Application, Container, Graphics } from "pixi.js";
import { usePixiApp } from "../hooks/usePixiApp";
import styles from "./RoomCanvas.module.css";

const W = 480;
const H = 300;
const MARKER_RADIUS = 10;
const MARKER_COLOR = 0x8a6d3b;
const INSET = 20;

export interface PlacedDecoration {
  id: string;
  decorationId: string;
  x: number;
  y: number;
}

interface Props {
  background: string;
  decorations: PlacedDecoration[];
  onPlaceDecoration: (decorationId: string, x: number, y: number) => void;
}

export default function RoomCanvas({ background, decorations, onPlaceDecoration }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<Graphics | null>(null);
  const decorationsContainerRef = useRef<Container | null>(null);
  const backgroundRef = useRef(background);

  useEffect(() => {
    backgroundRef.current = background;
  }, [background]);

  const onReady = useCallback((app: Application) => {
    const bg = new Graphics();
    bg.rect(0, 0, W, H);
    bg.fill(backgroundRef.current);
    app.stage.addChild(bg);
    bgRef.current = bg;

    const decorationsContainer = new Container();
    app.stage.addChild(decorationsContainer);
    decorationsContainerRef.current = decorationsContainer;
  }, []);

  useEffect(() => {
    if (!bgRef.current) return;
    bgRef.current.clear();
    bgRef.current.rect(0, 0, W, H);
    bgRef.current.fill(background);
  }, [background]);

  useEffect(() => {
    const container = decorationsContainerRef.current;
    if (!container) return;
    container.removeChildren();
    for (const decoration of decorations) {
      const marker = new Graphics();
      marker.circle(0, 0, MARKER_RADIUS);
      marker.fill(MARKER_COLOR);
      marker.position.set(decoration.x, decoration.y);
      container.addChild(marker);
    }
  }, [decorations]);

  usePixiApp(containerRef, onReady, W, H);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    let payload: { kind?: string; id?: string };
    try {
      payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch {
      return;
    }
    if (payload.kind !== "decoration" || !payload.id) return;

    const rect = containerRef.current!.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * W;
    const rawY = ((e.clientY - rect.top) / rect.height) * H;
    const x = Math.min(W - INSET, Math.max(INSET, rawX));
    const y = Math.min(H - INSET, Math.max(INSET, rawY));

    onPlaceDecoration(payload.id, x, y);
  };

  return (
    <div
      className={styles.wrapper}
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );
}
