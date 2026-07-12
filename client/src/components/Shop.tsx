import { memo, useEffect, useState } from "react";
import Item from "./Item";
import Dropdown from "./Dropdown";
import { getShopSeeds, DECORATION_SHOP_ITEMS } from "../api/shop";
import { ROOM_OPTIONS } from "../api/rooms";
import type { ShopItem } from "../api/types";
import styles from "./Shop.module.css";

interface ShopProps {
  token: string;
  coins: number;
  onPurchaseSeed: (seedTypeId: string) => void;
}

interface CatalogEntry {
  id: string;
  name: string;
  price: number;
}

function Shop({ token, coins, onPurchaseSeed }: ShopProps) {
  const [seeds, setSeeds] = useState<ShopItem[]>([]);

  useEffect(() => {
    getShopSeeds(token)
      .then(setSeeds)
      .catch(() => setSeeds([]));
  }, [token]);

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
      <div className={styles.items}>
        {seeds.map((seed) => (
          <Item
            key={seed.id}
            name={seed.name}
            price={seed.price}
            disabled={coins < seed.price}
            onPurchase={() => onPurchaseSeed(seed.id)}
          />
        ))}
      </div>

      <h3 className={styles.sectionHeading}>Decorations</h3>
      <div className={styles.items}>{renderCatalog(DECORATION_SHOP_ITEMS)}</div>

      <h3 className={styles.sectionHeading}>Rooms</h3>
      <div className={styles.items}>{renderCatalog(ROOM_OPTIONS)}</div>
    </Dropdown>
  );
}

export default memo(Shop);
