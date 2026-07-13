import styles from "./InventoryItem.module.css";

interface InventoryItemProps {
  id: string;
  name: string;
  quantity: number;
  image?: string;
  kind: "seed" | "decoration";
}

export default function InventoryItem({ id, name, quantity, image, kind }: InventoryItemProps) {
  return (
    <div
      className={styles.card}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ kind, id }));
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      {image ? (
        <img src={image} alt={name} className={styles.image} />
      ) : (
        <span className={styles.imagePlaceholder}>🌱</span>
      )}

      <span className={styles.name}>{name}</span>
      <span className={styles.quantity}>x{quantity}</span>
    </div>
  );
}
