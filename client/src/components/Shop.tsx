import { useState } from "react";
import Item from "./Item";
import styles from "./Shop.module.css";

// Placeholder catalog until seeds have real sprites and a backend shop endpoint.
const SEEDS = [
  { id: "basic-seed", name: "Basic Seed", price: 20 },
  { id: "sunflower-seed", name: "Sunflower Seed", price: 40 },
  { id: "rare-seed", name: "Rare Seed", price: 100 },
];

interface ShopProps {
  coins: number;
}

export default function Shop({ coins }: ShopProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.trigger} onClick={() => setIsOpen(true)}>
        🛒 Shop
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>Shop</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Close shop"
              >
                ✕
              </button>
            </div>

            <div className={styles.items}>
              {SEEDS.map((seed) => (
                <Item
                  key={seed.id}
                  name={seed.name}
                  price={seed.price}
                  disabled={coins < seed.price}
                  onPurchase={() => {
                    // TODO: wire to a real purchase endpoint once one exists.
                    console.log(`Purchase requested: ${seed.name}`);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
