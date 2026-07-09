import { useState } from "react";
import styles from "./Shop.module.css";

export default function Shop() {
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
              <p className={styles.empty}>No items yet — check back soon!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
