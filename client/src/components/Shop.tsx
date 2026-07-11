import { memo } from "react";
import Item from "./Item";
import Dropdown from "./Dropdown";
import { SHOP_ITEMS, DECORATION_SHOP_ITEMS } from "../api/shop";
import { ROOM_OPTIONS } from "../api/rooms";
import styles from "./Shop.module.css";

interface ShopProps {
  coins: number;
}

interface CatalogEntry {
  id: string;
  name: string;
  price: number;
}

function Shop({ coins }: ShopProps) {
  const renderCatalog = (items: CatalogEntry[]) =>
    items.map((item) => (
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
    ));

  return (
    <Dropdown label="🛒 Shop" triggerClassName={`${styles.trigger} btn-primary`} align="left">
      <h3 className={styles.sectionHeading}>Seeds</h3>
      <div className={styles.items}>{renderCatalog(SHOP_ITEMS)}</div>

      <h3 className={styles.sectionHeading}>Decorations</h3>
      <div className={styles.items}>{renderCatalog(DECORATION_SHOP_ITEMS)}</div>

      <h3 className={styles.sectionHeading}>Rooms</h3>
      <div className={styles.items}>{renderCatalog(ROOM_OPTIONS)}</div>
    </Dropdown>
  );
}

export default memo(Shop);
