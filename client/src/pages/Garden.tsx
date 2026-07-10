import { useState, useEffect, useCallback } from "react";
import type { DragEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { getGarden, completeSession, sellPlant } from "../api/garden";
import type { Plant } from "../api/types";
import { INITIAL_INVENTORY } from "../api/inventory";
import type { SeedEntry } from "../api/inventory";
import GardenCanvas from "../components/GardenCanvas";
import TimerControls from "../components/TimerControls";
import PlantProgress from "../components/PlantProgress";
import Shop from "../components/Shop";
import Inventory from "../components/Inventory";
import { useTimer } from "../hooks/useTimer";
import styles from "./Garden.module.css";

export default function Garden() {
  const { token, user, logout } = useAuth();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState<SeedEntry[]>(INITIAL_INVENTORY);
  const [evolved, setEvolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getGarden(token)
      .then((data) => {
        setPlant(data.plant);
        setCoins(data.coins);
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
    const seedId = e.dataTransfer.getData("text/plain");
    const seed = inventory.find((s) => s.id === seedId && s.quantity > 0);
    if (!seed) return;

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

  const timer = useTimer(handleSessionComplete);

  if (loading)
    return <div className={styles.centered}>Loading your garden…</div>;
  if (error && !plant)
    return <div className={styles.centered}>{error}</div>;

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <span className={styles.logo}>🌱 Sprout</span>
        <div className={styles.nav}>
          <span className={styles.coins}>🪙 {coins}</span>
          <Shop coins={coins} />
          <Inventory seeds={inventory} />
          <span className={styles.userEmail}>{user?.email}</span>
          <button className={`${styles.signOut} btn-ghost`} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      {error && <p className={styles.errorBanner}>{error}</p>}

      <main className={styles.main}>
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
                Your pot is empty — drag a seed from your Inventory onto the
                pot to plant it.
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
      </main>
    </div>
  );
}
