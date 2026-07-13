import { useRef, useEffect, useCallback } from "react";
import type { DragEvent } from "react";
import { Application, Assets, Container, Graphics, Sprite } from "pixi.js";
import { usePixiApp } from "../hooks/usePixiApp";
import roomUrl from "../assets/room2.png";
import styles from "./RoomCanvas.module.css";

// The room is a fixed-size world, larger than what's actually shown on
// screen. Only the centered VIEW_W x VIEW_H window into it is visible today
// (no pan controls yet), but keeping the two sizes distinct means panning,
// zooming, or swapping in bigger rooms later doesn't require redoing the
// art or the placement coordinate system.
const WORLD_W = 960;
const WORLD_H = 720;
const VIEW_W = 768;
const VIEW_H = 432;
const CAMERA_OFFSET_X = (WORLD_W - VIEW_W) / 2;
const CAMERA_OFFSET_Y = (WORLD_H - VIEW_H) / 2;

// Reserved spot for the player's plant/pot -- upper-middle of the room,
// near the back wall/window. Nothing is drawn here yet; GardenCanvas still
// owns pot/plant rendering in its own column. This is just the anchor a
// future in-room plant sprite would use. Not exported: nothing outside this
// file consumes it yet, but it's easy to lift out once something does.
const PLANT_ANCHOR = { x: WORLD_W / 2, y: 380 };

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

function hexToNumber(hex: string): number {
  return Number(hex.replace("#", "0x"));
}

export default function RoomCanvas({ background, decorations, onPlaceDecoration }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomSpriteRef = useRef<Sprite | null>(null);
  const decorationsContainerRef = useRef<Container | null>(null);
  const backgroundRef = useRef(background);

  useEffect(() => {
    backgroundRef.current = background;
  }, [background]);

  const onReady = useCallback(async (app: Application) => {
    // World container: holds everything that lives "in the room" (background,
    // decorations, plant) and is offset so the centered VIEW_W x VIEW_H
    // region is what's visible, standing in for a camera. Masked to the
    // viewport so nothing in the larger world bleeds outside the canvas.
    const worldContainer = new Container();
    worldContainer.position.set(-CAMERA_OFFSET_X, -CAMERA_OFFSET_Y);

    const viewportMask = new Graphics();
    viewportMask.rect(0, 0, VIEW_W, VIEW_H);
    viewportMask.fill(0xffffff);
    worldContainer.mask = viewportMask;

    app.stage.addChild(worldContainer);

    // Room Background Sprite -- purely visual, never holds interactive
    // objects. Loaded the same way GardenCanvas loads pot1.png.
    const roomTexture = await Assets.load(roomUrl);
    roomTexture.source.scaleMode = "nearest";
    const roomSprite = new Sprite(roomTexture);

    // Fit the art into the world preserving aspect ratio; letterbox (via the
    // app's own clear color) instead of stretching if it doesn't match.
    const fitScale = Math.min(WORLD_W / roomTexture.width, WORLD_H / roomTexture.height);
    roomSprite.width = roomTexture.width * fitScale;
    roomSprite.height = roomTexture.height * fitScale;
    roomSprite.position.set(
      (WORLD_W - roomSprite.width) / 2,
      (WORLD_H - roomSprite.height) / 2
    );
    roomSprite.tint = hexToNumber(backgroundRef.current);
    worldContainer.addChild(roomSprite);
    roomSpriteRef.current = roomSprite;

    // Decoration Container -- everything the player drags into the room.
    const decorationsContainer = new Container();
    worldContainer.addChild(decorationsContainer);
    decorationsContainerRef.current = decorationsContainer;

    // Plant Container -- reserved, empty for now (see PLANT_ANCHOR above).
    const plantContainer = new Container();
    plantContainer.position.set(PLANT_ANCHOR.x, PLANT_ANCHOR.y);
    worldContainer.addChild(plantContainer);

    // UI/Effects -- screen space, sits above the world and outside its mask
    // so hover states, drop indicators, etc. are never clipped by the camera.
    const uiContainer = new Container();
    app.stage.addChild(uiContainer);
  }, []);

  useEffect(() => {
    if (!roomSpriteRef.current) return;
    roomSpriteRef.current.tint = hexToNumber(background);
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

  usePixiApp(containerRef, onReady, VIEW_W, VIEW_H);

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

    // The drop lands somewhere in the visible viewport; shift it by the
    // camera offset so the stored coordinate is in world space, matching
    // where decorationsContainer actually renders it.
    const rect = containerRef.current!.getBoundingClientRect();
    const viewportX = ((e.clientX - rect.left) / rect.width) * VIEW_W;
    const viewportY = ((e.clientY - rect.top) / rect.height) * VIEW_H;
    const rawX = viewportX + CAMERA_OFFSET_X;
    const rawY = viewportY + CAMERA_OFFSET_Y;
    const x = Math.min(WORLD_W - INSET, Math.max(INSET, rawX));
    const y = Math.min(WORLD_H - INSET, Math.max(INSET, rawY));

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
