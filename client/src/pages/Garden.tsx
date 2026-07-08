import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { getGarden, completeSession, sellPlant } from "../api/garden";
import type { Plant } from "../api/types";
import GardenCanvas from "../components/GardenCanvas";
import TimerControls from "../components/TimerControls";
import PlantProgress from "../components/PlantProgress";
import { useTimer } from "../hooks/useTimer";
import styles from "./Garden.module.css";

export default function Garden() {
  const { token, user, logout } = useAuth();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [coins, setCoins] = useState(0);
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
      setPlant(result.newPlant);
      setCoins(result.coins);
      setEvolved(false);
    } catch {
      setError("Failed to sell plant");
    }
  };

  const timer = useTimer(handleSessionComplete);

  if (loading)
    return <div className={styles.centered}>Loading your garden…</div>;
  if (!plant)
    return (
      <div className={styles.centered}>{error || "Something went wrong"}</div>
    );

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <span className={styles.logo}>🌱 Sprout</span>
        <div className={styles.nav}>
          <span className={styles.coins}>🪙 {coins}</span>
          <span className={styles.userEmail}>{user?.email}</span>
          <button className={styles.signOut} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      {error && <p className={styles.errorBanner}>{error}</p>}

      <main className={styles.main}>
        <div className={styles.canvasWrapper}>
          <GardenCanvas stage={plant.stage} />
        </div>

        <div className={styles.panel}>
          <PlantProgress plant={plant} evolved={evolved} />

          <div className={styles.divider} />

          {plant.stage >= 3 ? (
            <div className={styles.sellWrapper}>
              <p className={styles.sellHint}>Your plant is fully grown! 🎉</p>
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
        </div>
      </main>
    </div>
  );
}
