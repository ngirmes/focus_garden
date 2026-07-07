import type { Plant } from '../api/types';
import styles from './PlantProgress.module.css';

const THRESHOLDS = [0, 20, 65, 150] as const;
const STAGE_NAMES = ['Seed', 'Sprout', 'Young Plant', 'Mature Plant'];

function stageProgress(points: number, stage: number): number {
  if (stage >= 3) return 100;
  const start = THRESHOLDS[stage];
  const end = THRESHOLDS[stage + 1];
  return Math.min(100, Math.round(((points - start) / (end - start)) * 100));
}

interface Props {
  plant: Plant;
  evolved: boolean;
}

export default function PlantProgress({ plant, evolved }: Props) {
  const pct = stageProgress(plant.points, plant.stage);
  const stageName = STAGE_NAMES[plant.stage];
  const isMax = plant.stage >= 3;

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <span className={styles.stage}>{stageName}</span>
        {evolved && <span className={styles.evolved}>✨ Evolved!</span>}
        {!isMax && (
          <span className={styles.points}>
            {plant.points} / {THRESHOLDS[plant.stage + 1]} pts
          </span>
        )}
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
