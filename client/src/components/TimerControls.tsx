import styles from './TimerControls.module.css';

interface Props {
  running: boolean;
  secondsLeft: number;
  selectedMinutes: number;
  presets: number[];
  onSelectMinutes: (m: number) => void;
  onStart: () => void;
  onStop: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function TimerControls({
  running,
  secondsLeft,
  selectedMinutes,
  presets,
  onSelectMinutes,
  onStart,
  onStop,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.display}>{formatTime(secondsLeft)}</div>

      <div className={styles.presets}>
        {presets.map(m => (
          <button
            key={m}
            className={`${styles.preset} ${m === selectedMinutes ? styles.presetActive : ''}`}
            onClick={() => onSelectMinutes(m)}
            disabled={running}
          >
            {m}m
          </button>
        ))}
      </div>

      <button
        className={`${styles.action} ${running ? styles.stop : styles.start}`}
        onClick={running ? onStop : onStart}
      >
        {running ? 'Cancel' : 'Start Focus'}
      </button>
    </div>
  );
}
