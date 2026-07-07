import { useState, useEffect, useCallback } from 'react';

const PRESET_MINUTES = [5, 10, 15, 25, 50];

export function useTimer(onComplete: (minutes: number) => void) {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  // Keep secondsLeft in sync with selectedMinutes when idle.
  useEffect(() => {
    if (!running) setSecondsLeft(selectedMinutes * 60);
  }, [selectedMinutes, running]);

  // Countdown tick.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Fire completion when the countdown reaches zero.
  useEffect(() => {
    if (running && secondsLeft === 0) {
      setRunning(false);
      onComplete(selectedMinutes);
    }
  }, [secondsLeft, running, selectedMinutes, onComplete]);

  const start = useCallback(() => {
    setSecondsLeft(selectedMinutes * 60);
    setRunning(true);
  }, [selectedMinutes]);

  const stop = useCallback(() => {
    setRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  }, [selectedMinutes]);

  return { running, selectedMinutes, setSelectedMinutes, secondsLeft, start, stop, presets: PRESET_MINUTES };
}
