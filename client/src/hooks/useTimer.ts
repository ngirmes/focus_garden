import { useState, useEffect, useCallback } from 'react';

const PRESET_MINUTES = [5, 10, 15, 25, 50];

export function useTimer(onComplete: (minutes: number) => void) {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  // Countdown tick.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          onComplete(selectedMinutes);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, selectedMinutes, onComplete]);

  const selectMinutes = useCallback((minutes: number) => {
    setSelectedMinutes(minutes);
    if (!running) setSecondsLeft(minutes * 60);
  }, [running]);

  const start = useCallback(() => {
    setSecondsLeft(selectedMinutes * 60);
    setRunning(true);
  }, [selectedMinutes]);

  const stop = useCallback(() => {
    setRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  }, [selectedMinutes]);

  return { running, selectedMinutes, setSelectedMinutes: selectMinutes, secondsLeft, start, stop, presets: PRESET_MINUTES };
}
