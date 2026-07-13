export interface RoomOption {
  id: string;
  name: string;
  price: number;
  color: string; // placeholder background "art" until real room sprites exist
}

export const ROOM_OPTIONS: RoomOption[] = [
  { id: "default-green", name: "Meadow (default)", price: 0, color: "#e8f3e9" },
  { id: "sunroom-yellow", name: "Sunroom", price: 60, color: "#fbeec2" },
  { id: "twilight-purple", name: "Twilight Room", price: 150, color: "#e3d6f0" },
];
