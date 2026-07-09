import { useState } from "react";
import styles from "./Item.module.css";

interface ItemProps {
  name: string;
  price: number;
  image?: string;
  disabled?: boolean;
  onPurchase: () => void;
}

export default function Item({ name, price, image, disabled, onPurchase }: ItemProps) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={() => setSelected((s) => !s)}
    >
      {image ? (
        <img src={image} alt={name} className={styles.image} />
      ) : (
        <span className={styles.imagePlaceholder}>🌱</span>
      )}

      <span className={styles.name}>{name}</span>
      <span className={styles.price}>🪙 {price}</span>

      <button
        className={styles.buyBtn}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onPurchase();
        }}
      >
        Buy
      </button>
    </div>
  );
}
