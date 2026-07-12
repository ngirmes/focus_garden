import { useState, useEffect, useCallback, useRef } from "react";
import type { DragEvent, CSSProperties } from "react";
import { useAuth } from "../hooks/useAuth";
import { getGarden, completeSession, sellPlant } from "../api/garden";
import type { Plant } from "../api/types";
import { getSeedInventory, purchaseSeed } from "../api/inventory";
import type { SeedEntry } from "../api/inventory";
import { INITIAL_DECORATIONS } from "../api/decorations";
import type { DecorationEntry } from "../api/decorations";
import { ROOM_OPTIONS } from "../api/rooms";
import {
  getTasks,
  createTask,
  setTaskCompleted,
  deleteTask,
} from "../api/tasks";
import type { TaskEntry } from "../api/tasks";
import GardenCanvas from "../components/GardenCanvas";
import RoomCanvas from "../components/RoomCanvas";
import type { PlacedDecoration } from "../components/RoomCanvas";
import TimerControls from "../components/TimerControls";
import PlantProgress from "../components/PlantProgress";
import Shop from "../components/Shop";
import Inventory from "../components/Inventory";
import TaskList from "../components/TaskList";
import { useTimer } from "../hooks/useTimer";
import styles from "./Garden.module.css";

export default function Garden() {
  const { token, user, logout } = useAuth();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState<SeedEntry[]>([]);
  const [decorations, setDecorations] = useState<DecorationEntry[]>(INITIAL_DECORATIONS);
  const [placedDecorations, setPlacedDecorations] = useState<PlacedDecoration[]>([]);
  const [roomBackground, setRoomBackground] = useState("#e8f3e9");
  const [evolved, setEvolved] = useState(false);
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [leftColumnHeight, setLeftColumnHeight] = useState<number | null>(null);

  // Measure the pot+timer column's real rendered height and apply it to the
  // room column directly, rather than relying on flexbox's stretch-to-tallest
  // behavior — that depends on ambiguous interactions between aspect-ratio,
  // percentage max-height, and hypothetical flex-basis sizing that aren't
  // worth reasoning about when a direct measurement is simple and exact.
  useEffect(() => {
    const el = leftColumnRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setLeftColumnHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    if (!token) return;
    Promise.all([getGarden(token), getSeedInventory(token), getTasks(token)])
      .then(([gardenData, seeds, taskList]) => {
        setPlant(gardenData.plant);
        setCoins(gardenData.coins);
        setInventory(seeds);
        setTasks(taskList);
      })
      .catch(() => setError("Failed to load garden"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSessionComplete = useCallback(
    async (minutes: number) => {
      if (!token) return;
      try {
        const result = await completeSession(token, minutes);
        setPlant(result.plant);
        if (result.evolved) {
          setEvolved(true);
          setTimeout(() => setEvolved(false), 3000);
        }
      } catch {
        setError("Failed to save session");
      }
    },
    [token],
  );

  const handleSell = async () => {
    if (!token) return;
    try {
      const result = await sellPlant(token);
      // Prototype limitation: the backend still auto-replants on sell and
      // returns `newPlant`. This frontend-only step discards that and shows
      // an empty pot instead, so the user can drag a seed to plant anew.
      // A future backend step will remove server-side auto-replanting.
      setPlant(null);
      setCoins(result.coins);
      setEvolved(false);
    } catch {
      setError("Failed to sell plant");
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (plant !== null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent) => {
    if (plant !== null) return;
    e.preventDefault();
    let payload: { kind?: string; id?: string };
    try {
      payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch {
      return;
    }
    if (payload.kind !== "seed" || !payload.id) return;
    const seedId = payload.id;
    const seed = inventory.find((s) => s.id === seedId && s.quantity > 0);
    if (!seed) return;

    // Seed ownership is now real (fetched from /api/inventory/seeds), but
    // planting still doesn't call a backend endpoint yet — this only
    // decrements local state, same documented-limitation style as
    // handleSell's discarded auto-replant above. A future step adds a real
    // "consume a seed, create a plant" endpoint.
    setInventory((inv) =>
      inv.map((s) => (s.id === seedId ? { ...s, quantity: s.quantity - 1 } : s)),
    );
    setPlant({
      id: -1,
      user_id: user?.id ?? -1,
      stage: 0,
      points: 0,
      created_at: new Date().toISOString(),
      sold_at: null,
    });
  };

  const handlePurchaseSeed = async (seedTypeId: string) => {
    if (!token) return;
    try {
      const result = await purchaseSeed(token, seedTypeId);
      setCoins(result.coins);
      const seeds = await getSeedInventory(token);
      setInventory(seeds);
    } catch {
      setError("Failed to purchase seed");
    }
  };

  const handlePlaceDecoration = useCallback(
    (decorationId: string, x: number, y: number) => {
      const owned = decorations.find((d) => d.id === decorationId && d.quantity > 0);
      if (!owned) return;
      setDecorations((decs) =>
        decs.map((d) => (d.id === decorationId ? { ...d, quantity: d.quantity - 1 } : d)),
      );
      setPlacedDecorations((placed) => [
        ...placed,
        { id: crypto.randomUUID(), decorationId, x, y },
      ]);
    },
    [decorations],
  );

  const handleAddTask = async (title: string) => {
    if (!token) return;
    try {
      const task = await createTask(token, title);
      setTasks((prev) => [...prev, task]);
    } catch {
      setError("Failed to add task");
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!token) return;
    // Update optimistically so the checkbox/strikethrough respond immediately.
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed } : t)));
    try {
      await setTaskCompleted(token, taskId, completed);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !completed } : t)));
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await deleteTask(token, taskId);
    } catch {
      setTasks(previous);
      setError("Failed to delete task");
    }
  };

  const timer = useTimer(handleSessionComplete);

  if (loading)
    return <div className={styles.centered}>Loading your garden…</div>;
  if (error && !plant)
    return <div className={styles.centered}>{error}</div>;
  if (!token) return null; // ProtectedRoute guarantees this in practice; narrows the type below

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <span className={styles.logo}>🌱 Sprout</span>
        <div className={styles.headerCenter}>
          <Shop token={token} coins={coins} onPurchaseSeed={handlePurchaseSeed} />
          <Inventory seeds={inventory} decorations={decorations} />
        </div>
        <div className={styles.nav}>
          <span className={styles.coins}>🪙 {coins}</span>
          <span className={styles.userEmail}>{user?.email}</span>
          <button className={`${styles.signOut} btn-ghost`} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      {error && <p className={styles.errorBanner}>{error}</p>}

      <main className={styles.main}>
        <div className={styles.leftColumn} ref={leftColumnRef}>
          <div
            className={styles.canvasWrapper}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <GardenCanvas stage={plant ? plant.stage : null} />
          </div>

          <div className={styles.panel}>
            {plant === null ? (
              <div className={styles.sellWrapper}>
                <p className={styles.sellHint}>
                  Your pot is empty — drag a seed from your Inventory onto
                  the pot to plant it.
                </p>
              </div>
            ) : (
              <>
                <PlantProgress plant={plant} evolved={evolved} />

                <div className={styles.divider} />

                {plant.stage >= 3 ? (
                  <div className={styles.sellWrapper}>
                    <p className={styles.sellHint}>
                      Your plant is fully grown! 🎉
                    </p>
                    <button className={styles.sellBtn} onClick={handleSell}>
                      Sell for 🪙 50 coins
                    </button>
                  </div>
                ) : (
                  <TimerControls
                    running={timer.running}
                    secondsLeft={timer.secondsLeft}
                    selectedMinutes={timer.selectedMinutes}
                    presets={timer.presets}
                    onSelectMinutes={timer.setSelectedMinutes}
                    onStart={timer.start}
                    onStop={timer.stop}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div
          className={styles.roomColumn}
          style={
            leftColumnHeight != null
              ? ({ "--room-height": `${leftColumnHeight}px` } as CSSProperties)
              : undefined
          }
        >
          <h2 className={styles.roomHeading}>Your Room</h2>
          <div className={styles.roomCanvasWrapper}>
            <RoomCanvas
              background={roomBackground}
              decorations={placedDecorations}
              onPlaceDecoration={handlePlaceDecoration}
            />
          </div>
          <div className={styles.swatchRow}>
            {ROOM_OPTIONS.map((room) => (
              <button
                key={room.id}
                className={`${styles.swatchBtn} ${roomBackground === room.color ? styles.swatchActive : ""}`}
                style={{ background: room.color }}
                title={room.name}
                aria-label={`Switch to ${room.name}`}
                onClick={() => setRoomBackground(room.color)}
              />
            ))}
          </div>
        </div>
      </main>

      <div className={styles.tasksSection}>
        <TaskList
          tasks={tasks}
          onAdd={handleAddTask}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}
