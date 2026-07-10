import { memo, useState } from "react";
import Modal from "./Modal";
import InventoryItem from "./InventoryItem";
import type { SeedEntry } from "../api/inventory";
import styles from "./Inventory.module.css";

interface InventoryProps {
  seeds: SeedEntry[];
}

function Inventory({ seeds }: InventoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const owned = seeds.filter((seed) => seed.quantity > 0);

  return (
    <>
      <button
        className={`${styles.trigger} btn-primary`}
        onClick={() => setIsOpen(true)}
      >
        🎒 Inventory
      </button>

      {isOpen && (
        <Modal title="Inventory" onClose={() => setIsOpen(false)}>
          <div className={styles.items}>
            {owned.length === 0 ? (
              <p className={styles.empty}>
                Your inventory is empty — visit the shop to get started!
              </p>
            ) : (
              owned.map((seed) => <InventoryItem key={seed.id} {...seed} />)
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default memo(Inventory);
