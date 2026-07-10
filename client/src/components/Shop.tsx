import { memo, useState } from "react";
import Item from "./Item";
import Modal from "./Modal";
import { SHOP_ITEMS } from "../api/shop";
import styles from "./Shop.module.css";

interface ShopProps {
  coins: number;
}

function Shop({ coins }: ShopProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={`${styles.trigger} btn-primary`}
        onClick={() => setIsOpen(true)}
      >
        🛒 Shop
      </button>

      {isOpen && (
        <Modal title="Shop" onClose={() => setIsOpen(false)}>
          <div className={styles.items}>
            {SHOP_ITEMS.map((item) => (
              <Item
                key={item.id}
                name={item.name}
                price={item.price}
                disabled={coins < item.price}
                onPurchase={() => {
                  // TODO: wire to a real purchase endpoint once one exists.
                  console.log(`Purchase requested: ${item.name}`);
                }}
              />
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

export default memo(Shop);
