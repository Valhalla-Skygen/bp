import type { Crate } from "../types/crates";

const Crates = [
  {
    name: "Common Crate",
    currency_key: "crate_common",
    location: { x: 694, y: 83, z: -5800 },
    rewards: [
      {
        name: "$1,000 Cash",
        description: ["", "§7If won, you will get $1,000 into your balance!"],
        weight: 0.25,
        display_item: {
          typeId: "textures/items/raw_gold",
        },
        currencies: {
          balance: 1000,
        },
      },
    ],
  },
  {
    name: "Uncommon Crate",
    currency_key: "crate_uncommon",
    location: { x: 680, y: 83, z: -5800 },
    rewards: [],
  },
  {
    name: "Rare Crate",
    currency_key: "crate_rare",
    location: { x: 692, y: 83, z: -5799 },
    rewards: [],
  },
  {
    name: "Epic Crate",
    currency_key: "crate_epic",
    location: { x: 682, y: 83, z: -5799 },
    rewards: [],
  },
  {
    name: "Legendary Crate",
    currency_key: "crate_legendary",
    location: { x: 690, y: 83, z: -5798 },
    rewards: [],
  },
  {
    name: "Valhalla Crate",
    currency_key: "crate_valhalla",
    location: { x: 684, y: 83, z: -5798 },
    rewards: [],
  },
] as Crate[];

export default Crates;
