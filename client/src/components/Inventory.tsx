import { memo } from "react";
import Dropdown from "./Dropdown";
import InventoryItem from "./InventoryItem";
import type { SeedEntry } from "../api/inventory";
import type { DecorationEntry } from "../api/decorations";
import styles from "./Inventory.module.css";

interface InventoryProps {
  seeds: SeedEntry[];
  decorations: DecorationEntry[];
}

function Inventory({ seeds, decorations }: InventoryProps) {
  const ownedSeeds = seeds.filter((seed) => seed.quantity > 0);
  const ownedDecorations = decorations.filter((d) => d.quantity > 0);
  const isEmpty = ownedSeeds.length === 0 && ownedDecorations.length === 0;

  return (
    <Dropdown label="🎒 Inventory" triggerClassName={`${styles.trigger} btn-primary`} align="right">
      {isEmpty ? (
        <p className={styles.empty}>
          Your inventory is empty — visit the shop to get started!
        </p>
      ) : (
        <>
          {ownedSeeds.length > 0 && (
            <>
              <h3 className={styles.sectionHeading}>Seeds</h3>
              <div className={styles.items}>
                {ownedSeeds.map((seed) => (
                  <InventoryItem key={seed.id} {...seed} kind="seed" />
                ))}
              </div>
            </>
          )}

          {ownedDecorations.length > 0 && (
            <>
              <h3 className={styles.sectionHeading}>Decorations</h3>
              <div className={styles.items}>
                {ownedDecorations.map((decoration) => (
                  <InventoryItem key={decoration.id} {...decoration} kind="decoration" />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Dropdown>
  );
}

export default memo(Inventory);
