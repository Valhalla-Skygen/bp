import type { Shop } from "../types/shops";

export const SellingOptions = {
  "minecraft:pale_moss_block": 5,
  "minecraft:moss_block": 8,
  "minecraft:dirt": 12,
  "minecraft:dirt_with_roots": 15,
  "minecraft:coarse_dirt": 18,
  "minecraft:packed_mud": 20,
  "minecraft:podzol": 23,
  // Planks
  "minecraft:oak_planks": 27,
  "minecraft:spruce_planks": 30,
  "minecraft:birch_planks": 36,
  "minecraft:jungle_planks": 45,
  "minecraft:acacia_planks": 56,
  "minecraft:dark_oak_planks": 67,
  "minecraft:mangrove_planks": 80,
  "minecraft:cherry_planks": 100,
  // Stone family
  "minecraft:cobblestone": 130,
  "minecraft:stone": 130 * 3,
  "minecraft:granite": 145,
  "minecraft:diorite": 160,
  "minecraft:andesite": 200,
  "minecraft:blackstone": 255,
  "minecraft:tuff": 315,
  "minecraft:basalt": 395,
  "minecraft:cobbled_deepslate": 480,
  "minecraft:deepslate": 480 * 3,
  "minecraft:gravel": 570,
  "minecraft:flint": 570 * 3,
  // Early ores & logs
  "minecraft:coal": 670,
  "minecraft:oak_log": 800,
  "minecraft:spruce_log": 970,
  "minecraft:birch_log": 1020,
  "minecraft:jungle_log": 1250,
  "minecraft:acacia_log": 1600,
  "minecraft:dark_oak_log": 1950,
  "minecraft:mangrove_log": 2100,
  "minecraft:cherry_log": 2600,
  // Sand & bricks (aliases)
  "minecraft:sand": 3000,
  "minecraft:glass": 3000 * 3,
  "minecraft:brick_block": 3400,
  "minecraft:gilded_blackstone": 3620,
  // Hay (aliases)
  "minecraft:hay_block": 4100,
  // Bone / prismarine set
  "minecraft:bone_block": 4500,
  "minecraft:dark_prismarine": 5000,
  "minecraft:prismarine": 5750,
  // Red Nether Brick (aliases)
  "minecraft:red_nether_brick": 6300,
  "minecraft:nether_brick": 7000,
  // Copper / kelp (aliases)
  "minecraft:raw_copper": 7900,
  "minecraft:copper_ingot": 7900 * 3,
  "minecraft:dried_kelp_block": 17625,
  // Wool series (correct gray spellings)
  "minecraft:white_wool": 10000,
  "minecraft:light_gray_wool": 12250,
  "minecraft:gray_wool": 14650,
  "minecraft:black_wool": 16800,
  "minecraft:red_wool": 19000,
  "minecraft:orange_wool": 22000,
  "minecraft:yellow_wool": 27000,
  "minecraft:lime_wool": 33670,
  "minecraft:green_wool": 39824,
  "minecraft:cyan_wool": 46000,
  "minecraft:light_blue_wool": 51000,
  "minecraft:blue_wool": 57000,
  "minecraft:purple_wool": 68000,
  "minecraft:magenta_wool": 73450,
  "minecraft:pink_wool": 80000,
  "minecraft:raw_iron": 100000,
  "minecraft:iron_ingot": 100000 * 3,
  "minecraft:end_stone": 90000,
  "minecraft:quartz": 113560,
  "minecraft:redstone": 24333,
  "minecraft:lapis_lazuli": 31250,
  "minecraft:gold_ingot": 170000,
  "minecraft:honeycomb_block": 200000,
  "minecraft:resin_block": 238000,
  // Concrete (correct gray spellings + aliases)
  "minecraft:white_concrete": 300000,
  "minecraft:light_gray_concrete": 325000,
  "minecraft:gray_concrete": 400000,
  "minecraft:black_concrete": 467000,
  "minecraft:brown_concrete": 540000,
  "minecraft:red_concrete": 600000,
  "minecraft:orange_concrete": 670000,
  "minecraft:yellow_concrete": 700000,
  "minecraft:lime_concrete": 800000,
  "minecraft:green_concrete": 910000,
  "minecraft:cyan_concrete": 1000000,
  "minecraft:light_blue_concrete": 1120000,
  "minecraft:blue_concrete": 1200000,
  "minecraft:magenta_concrete": 1280000,
  "minecraft:pink_concrete": 1358000,
  // Late game ores / blocks
  "minecraft:diamond": 1500000,
  "minecraft:dripstone_block": 1600000,
  "minecraft:amethyst_block": 1710000,
  "minecraft:mud": 1967676,
} as Record<string, number>;

export const Shops = [
  {
    name: "Generator Shop Pt1",
    tag: "genshop1",
    options: [
      {
        name: "Pale Moss Generator",
        icon: "minecraft:pale_moss_block",
        price: 0,
        slot: 0,
        items: [
          {
            typeId: "valhalla:generator_pale_moss",
            nameTag: "§cPale Moss Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Moss Generator",
        icon: "minecraft:moss_block",
        price: 6000,
        slot: 1,
        items: [
          {
            typeId: "valhalla:generator_moss",
            nameTag: "§cMoss Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Dirt Generator",
        icon: "minecraft:dirt",
        price: 9600,
        slot: 2,
        items: [
          {
            typeId: "valhalla:generator_dirt",
            nameTag: "§cDirt Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Rooted Dirt Generator",
        icon: "minecraft:dirt_with_roots",
        price: 12750,
        slot: 3,
        items: [
          {
            typeId: "valhalla:generator_rooted_dirt",
            nameTag: "§cRooted Dirt Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Coarse Dirt Generator",
        icon: "minecraft:coarse_dirt",
        price: 18000,
        slot: 4,
        items: [
          {
            typeId: "valhalla:generator_coarse_dirt",
            nameTag: "§cCoarse Dirt Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Packed Mud Generator",
        icon: "minecraft:packed_mud",
        price: 22000,
        slot: 5,
        items: [
          {
            typeId: "valhalla:generator_packed_mud",
            nameTag: "§cPacked Mud Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Podzol Generator",
        icon: "minecraft:podzol",
        price: 34500,
        slot: 6,
        items: [
          {
            typeId: "valhalla:generator_podzol_dirt",
            nameTag: "§cPodzol Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Oak Planks Generator",
        icon: "minecraft:oak_planks",
        price: 48600,
        slot: 7,
        items: [
          {
            typeId: "valhalla:generator_oak_planks",
            nameTag: "§cOak Planks Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Spruce Planks Generator",
        icon: "minecraft:spruce_planks",
        price: 66000,
        slot: 8,
        items: [
          {
            typeId: "valhalla:generator_spruce_planks",
            nameTag: "§cSpruce Planks Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Birch Planks Generator",
        icon: "minecraft:birch_planks",
        price: 86400,
        slot: 9,
        items: [
          {
            typeId: "valhalla:generator_birch_planks",
            nameTag: "§cBirch Planks Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Jungle Planks Generator",
        icon: "minecraft:jungle_planks",
        price: 123750,
        slot: 10,
        items: [
          {
            typeId: "valhalla:generator_jungle_planks",
            nameTag: "§cJungle Planks Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Acacia Planks Generator",
        icon: "minecraft:acacia_planks",
        price: 168000,
        slot: 11,
        items: [
          {
            typeId: "valhalla:generator_acacia_planks",
            nameTag: "§cAcacia Planks Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Dark Oak Planks Generator",
        icon: "minecraft:dark_oak_planks",
        price: 234500,
        slot: 12,
        items: [
          {
            typeId: "valhalla:generator_dark_oak_planks",
            nameTag: "§cDark Oak Planks Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Mangrove Planks Generator",
        icon: "minecraft:mangrove_planks",
        price: 300000,
        slot: 13,
        items: [
          {
            typeId: "valhalla:generator_mangrove_planks",
            nameTag: "§cMangrove Planks Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Cherry Planks Generator",
        icon: "minecraft:cherry_planks",
        price: 380000,
        slot: 14,
        items: [
          {
            typeId: "valhalla:generator_cherry_planks",
            nameTag: "§cCherry Planks Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Stone Generator",
        icon: "minecraft:stone",
        price: 507000,
        slot: 15,
        items: [
          {
            typeId: "valhalla:generator_stone",
            nameTag: "§cStone Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Granite Generator",
        icon: "minecraft:granite",
        price: 580000,
        slot: 16,
        items: [
          {
            typeId: "valhalla:generator_granite",
            nameTag: "§cGranite Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Diorite Generator",
        icon: "minecraft:diorite",
        price: 672000,
        slot: 17,
        items: [
          {
            typeId: "valhalla:generator_diorite",
            nameTag: "§cDiorite Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Andesite Generator",
        icon: "minecraft:andesite",
        price: 920000,
        slot: 18,
        items: [
          {
            typeId: "valhalla:generator_andesite",
            nameTag: "§cAndesite Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Blackstone Generator",
        icon: "minecraft:blackstone",
        price: 1275000,
        slot: 19,
        items: [
          {
            typeId: "valhalla:generator_blackstone",
            nameTag: "§cBlackstone Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Tuff Generator",
        icon: "minecraft:tuff",
        price: 16903125,
        slot: 20,
        items: [
          {
            typeId: "valhalla:generator_tuff",
            nameTag: "§cTuff Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Basalt Generator",
        icon: "minecraft:basalt",
        price: 2212000,
        slot: 21,
        items: [
          {
            typeId: "valhalla:generator_basalt",
            nameTag: "§cBasalt Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Deepslate Generator",
        icon: "minecraft:deepslate",
        price: 2880000,
        slot: 22,
        items: [
          {
            typeId: "valhalla:generator_deepslate",
            nameTag: "§cDeepslate Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Gravel Generator",
        icon: "minecraft:gravel",
        price: 4560000,
        slot: 23,
        items: [
          {
            typeId: "valhalla:generator_gravel",
            nameTag: "§cGravel Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Deepslate Coal Generator",
        icon: "minecraft:deepslate_coal_ore",
        price: 5360000,
        slot: 24,
        items: [
          {
            typeId: "valhalla:generator_deepslate_coal",
            nameTag: "§cDeepslate Coal Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Oak Log Generator",
        icon: "minecraft:oak_log",
        price: 7200000,
        slot: 25,
        items: [
          {
            typeId: "valhalla:generator_oak_log",
            nameTag: "§cOak Log Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Spruce Log Generator",
        icon: "minecraft:spruce_log",
        price: 8978750,
        slot: 26,
        items: [
          {
            typeId: "valhalla:generator_spruce_log",
            nameTag: "§cSpruce Log Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Birch Log Generator",
        icon: "minecraft:birch_log",
        price: 9690000,
        slot: 27,
        items: [
          {
            typeId: "valhalla:generator_birch_log",
            nameTag: "§cBirch Log Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Jungle Log Generator",
        icon: "minecraft:jungle_log",
        price: 13437500,
        slot: 28,
        items: [
          {
            typeId: "valhalla:generator_jungle_log",
            nameTag: "§cJungle Log Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Acacia Log Generator",
        icon: "minecraft:acacia_log",
        price: 17600000,
        slot: 29,
        items: [
          {
            typeId: "valhalla:generator_acacia_log",
            nameTag: "§cAcacia Log Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Dark Oak Log Generator",
        icon: "minecraft:dark_oak_log",
        price: 23400000,
        slot: 30,
        items: [
          {
            typeId: "valhalla:generator_dark_oak_log",
            nameTag: "§cDark Oak Log Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Mangrove Log Generator",
        icon: "minecraft:mangrove_log",
        price: 26706000,
        slot: 31,
        items: [
          {
            typeId: "valhalla:generator_mangrove_log",
            nameTag: "§cMangrove Log Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Cherry Log Generator",
        icon: "minecraft:cherry_log",
        price: 34320000,
        slot: 32,
        items: [
          {
            typeId: "valhalla:generator_cherry_log",
            nameTag: "§cCherry Log Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Sand Generator",
        icon: "minecraft:sand",
        price: 45000000,
        slot: 33,
        items: [
          {
            typeId: "valhalla:generator_sand",
            nameTag: "§cSand Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Brick Block Generator",
        icon: "minecraft:brick_block",
        price: 48790000,
        slot: 34,
        items: [
          {
            typeId: "valhalla:generator_brick",
            nameTag: "§cBrick Block Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Gilded Blackstone Generator",
        icon: "minecraft:gilded_blackstone",
        price: 54300000,
        slot: 35,
        items: [
          {
            typeId: "valhalla:generator_gilded_blackstone",
            nameTag: "§cGilded Blackstone Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Hay Generator",
        icon: "minecraft:hay_block",
        price: 69700000,
        slot: 36,
        items: [
          {
            typeId: "valhalla:generator_hay",
            nameTag: "§cHay Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Bone Block Generator",
        icon: "minecraft:bone_block",
        price: 72000000,
        slot: 37,
        items: [
          {
            typeId: "valhalla:generator_bone",
            nameTag: "§cBone Block Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Dark Prismarine Generator",
        icon: "minecraft:dark_prismarine",
        price: 81000000,
        slot: 38,
        items: [
          {
            typeId: "valhalla:generator_dark_prismarine",
            nameTag: "§cDark Prismarine Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Prismarine Generator",
        icon: "minecraft:prismarine",
        price: 94300000,
        slot: 39,
        items: [
          {
            typeId: "valhalla:generator_prismarine",
            nameTag: "§cPrismarine Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Red Nether Brick Generator",
        icon: "minecraft:red_nether_brick",
        price: 105300000,
        slot: 40,
        items: [
          {
            typeId: "valhalla:generator_red_nether_brick",
            nameTag: "§cRed Nether Brick Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Nether Brick Generator",
        icon: "minecraft:nether_brick",
        price: 118300000,
        slot: 41,
        items: [
          {
            typeId: "valhalla:generator_nether_brick",
            nameTag: "§cNether Brick Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Deepslate Copper Generator",
        icon: "minecraft:deepslate_copper_ore",
        price: 138250000,
        slot: 42,
        items: [
          {
            typeId: "valhalla:generator_deepslate_copper",
            nameTag: "§cDeepslate Copper Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Dried Kelp Generator",
        icon: "minecraft:dried_kelp_block",
        price: 168400000,
        slot: 43,
        items: [
          {
            typeId: "valhalla:generator_kelp_block",
            nameTag: "§cDried Kelp Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "White Wool Generator",
        icon: "minecraft:white_wool",
        price: 188000000,
        slot: 44,
        items: [
          {
            typeId: "valhalla:generator_white_wool",
            nameTag: "§cWhite Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Gray Wool Generator",
        icon: "minecraft:light_gray_wool",
        price: 232287500,
        slot: 45,
        items: [
          {
            typeId: "valhalla:generator_gray_wool",
            nameTag: "§cGray Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Dark Gray Wool Generator",
        icon: "minecraft:gray_wool",
        price: 278350000,
        slot: 46,
        items: [
          {
            typeId: "valhalla:generator_dark_gray_wool",
            nameTag: "§cDark Gray Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Black Wool Generator",
        icon: "minecraft:black_wool",
        price: 319704000,
        slot: 47,
        items: [
          {
            typeId: "valhalla:generator_black_wool",
            nameTag: "§cBlack Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Red Wool Generator",
        icon: "minecraft:red_wool",
        price: 364725000,
        slot: 48,
        items: [
          {
            typeId: "valhalla:generator_red_wool",
            nameTag: "§cRed Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Orange Wool Generator",
        icon: "minecraft:orange_wool",
        price: 426800000,
        slot: 49,
        items: [
          {
            typeId: "valhalla:generator_orange_wool",
            nameTag: "§cOrange Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Yellow Wool Generator",
        icon: "minecraft:yellow_wool",
        price: 526500000,
        slot: 50,
        items: [
          {
            typeId: "valhalla:generator_yellow_wool",
            nameTag: "§cYellow Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Lime Wool Generator",
        icon: "minecraft:lime_wool",
        price: 663391000,
        slot: 51,
        items: [
          {
            typeId: "valhalla:generator_lime_wool",
            nameTag: "§cLime Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Green Wool Generator",
        icon: "minecraft:green_wool",
        price: 794504876,
        slot: 52,
        items: [
          {
            typeId: "valhalla:generator_green_wool",
            nameTag: "§cGreen Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Cyan Wool Generator",
        icon: "minecraft:cyan_wool",
        price: 920000000,
        slot: 53,
        items: [
          {
            typeId: "valhalla:generator_cyan_wool",
            nameTag: "§cCyan Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
    ],
  },
  {
    name: "Generator Shop Pt2",
    tag: "genshop2",
    options: [
      {
        name: "Light Blue Wool Generator",
        icon: "minecraft:light_blue_wool",
        price: 1025100000,
        slot: 0,
        items: [
          {
            typeId: "valhalla:generator_light_blue_wool",
            nameTag: "§cLight Blue Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Blue Wool Generator",
        icon: "minecraft:blue_wool",
        price: 1168500000,
        slot: 1,
        items: [
          {
            typeId: "valhalla:generator_blue_wool",
            nameTag: "§cBlue Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Purple Wool Generator",
        icon: "minecraft:purple_wool",
        price: 1397400000,
        slot: 2,
        items: [
          {
            typeId: "valhalla:generator_purple_wool",
            nameTag: "§cPurple Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Magenta Wool Generator",
        icon: "minecraft:magenta_wool",
        price: 1512170000,
        slot: 3,
        items: [
          {
            typeId: "valhalla:generator_magenta_wool",
            nameTag: "§cMagenta Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Pink Wool Generator",
        icon: "minecraft:pink_wool",
        price: 1656000000,
        slot: 4,
        items: [
          {
            typeId: "valhalla:generator_pink_wool",
            nameTag: "§cPink Wool Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Deepslate Iron Generator",
        icon: "minecraft:deepslate_iron_ore",
        price: 2085000000,
        slot: 5,
        items: [
          {
            typeId: "valhalla:generator_deepslate_iron",
            nameTag: "§cDeepslate Iron Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Endstone Generator",
        icon: "minecraft:end_stone",
        price: 1890000000,
        slot: 6,
        items: [
          {
            typeId: "valhalla:generator_endstone",
            nameTag: "§cEndstone Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Quartz Ore Generator",
        icon: "minecraft:quartz_ore",
        price: 2389718000,
        slot: 7,
        items: [
          {
            typeId: "valhalla:generator_quartz_ore",
            nameTag: "§cQuartz Ore Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Deepslate Redstone Generator",
        icon: "minecraft:deepslate_redstone_ore",
        price: 2637500000,
        slot: 8,
        items: [
          {
            typeId: "valhalla:generator_deepslate_redstone",
            nameTag: "§cDeepslate Redstone Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Deepslate Lapis Generator",
        icon: "minecraft:deepslate_lapis_ore",
        price: 3097500000,
        slot: 9,
        items: [
          {
            typeId: "valhalla:generator_deepslate_lapis",
            nameTag: "§cDeepslate Lapis Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Deepslate Gold Generator",
        icon: "minecraft:deepslate_gold_ore",
        price: 3655000000,
        slot: 10,
        items: [
          {
            typeId: "valhalla:generator_deepslate_gold",
            nameTag: "§cDeepslate Gold Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Honeycomb Generator",
        icon: "minecraft:honeycomb_block",
        price: 4330000000,
        slot: 11,
        items: [
          {
            typeId: "valhalla:generator_honeycomb_block",
            nameTag: "§cHoneycomb Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Resin Block Generator",
        icon: "minecraft:resin_block",
        price: 5184400000,
        slot: 12,
        items: [
          {
            typeId: "valhalla:generator_resin_block",
            nameTag: "§cResin Block Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "White Concrete Generator",
        icon: "minecraft:white_concrete",
        price: 6600000000,
        slot: 13,
        items: [
          {
            typeId: "valhalla:generator_white_concrete",
            nameTag: "§cWhite Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Gray Concrete Generator",
        icon: "minecraft:light_gray_concrete",
        price: 7175000000,
        slot: 14,
        items: [
          {
            typeId: "valhalla:generator_gray_concrete",
            nameTag: "§cGray Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Dark Gray Concrete Generator",
        icon: "minecraft:gray_concrete",
        price: 8940000000,
        slot: 15,
        items: [
          {
            typeId: "valhalla:generator_dark_gray_concrete",
            nameTag: "§cDark Gray Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Black Concrete Generator",
        icon: "minecraft:black_concrete",
        price: 10460800000,
        slot: 16,
        items: [
          {
            typeId: "valhalla:generator_black_concrete",
            nameTag: "§cBlack Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Brown Concrete Generator",
        icon: "minecraft:brown_concrete",
        price: 12150000000,
        slot: 17,
        items: [
          {
            typeId: "valhalla:generator_brown_concrete",
            nameTag: "§cBrown Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Red Concrete Generator",
        icon: "minecraft:red_concrete",
        price: 13800000000,
        slot: 18,
        items: [
          {
            typeId: "valhalla:generator_red_concrete",
            nameTag: "§cRed Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Orange Concrete Generator",
        icon: "minecraft:orange_concrete",
        price: 15544000000,
        slot: 19,
        items: [
          {
            typeId: "valhalla:generator_orange_concrete",
            nameTag: "§cOrange Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Yellow Concrete Generator",
        icon: "minecraft:yellow_concrete",
        price: 16800000000,
        slot: 20,
        items: [
          {
            typeId: "valhalla:generator_yellow_concrete",
            nameTag: "§cYellow Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Lime Concrete Generator",
        icon: "minecraft:lime_concrete",
        price: 20000000000,
        slot: 21,
        items: [
          {
            typeId: "valhalla:generator_lime_concrete",
            nameTag: "§cLime Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Green Concrete Generator",
        icon: "minecraft:green_concrete",
        price: 23205000000,
        slot: 22,
        items: [
          {
            typeId: "valhalla:generator_green_concrete",
            nameTag: "§cGreen Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Cyan Concrete Generator",
        icon: "minecraft:cyan_concrete",
        price: 26000000000,
        slot: 23,
        items: [
          {
            typeId: "valhalla:generator_cyan_concrete",
            nameTag: "§cCyan Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Light Blue Concrete Generator",
        icon: "minecraft:light_blue_concrete",
        price: 31360000000,
        slot: 24,
        items: [
          {
            typeId: "valhalla:generator_light_blue_concrete",
            nameTag: "§cLight Blue Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Blue Concrete Generator",
        icon: "minecraft:blue_concrete",
        price: 36000000000,
        slot: 25,
        items: [
          {
            typeId: "valhalla:generator_blue_concrete",
            nameTag: "§cBlue Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Magenta Concrete Generator",
        icon: "minecraft:magenta_concrete",
        price: 44800000000,
        slot: 26,
        items: [
          {
            typeId: "valhalla:generator_magenta_concrete",
            nameTag: "§cMagenta Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Pink Concrete Generator",
        icon: "minecraft:pink_concrete",
        price: 50246000000,
        slot: 27,
        items: [
          {
            typeId: "valhalla:generator_pink_concrete",
            nameTag: "§cPink Concrete Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Deepslate Diamond Generator",
        icon: "minecraft:deepslate_diamond_ore",
        price: 57000000000,
        slot: 28,
        items: [
          {
            typeId: "valhalla:generator_deepslate_diamond",
            nameTag: "§cDeepslate Diamond Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Dripstone Generator",
        icon: "minecraft:dripstone_block",
        price: 64000000000,
        slot: 29,
        items: [
          {
            typeId: "valhalla:generator_dripstone",
            nameTag: "§cDripstone Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Amethyst Generator",
        icon: "minecraft:amethyst_block",
        price: 76950000000,
        slot: 30,
        items: [
          {
            typeId: "valhalla:generator_amethyst",
            nameTag: "§cAmethyst Generator",
            keepOnDeath: true,
          },
        ],
      },
      {
        name: "Mud Generator",
        icon: "minecraft:mud",
        price: 98383800000,
        slot: 31,
        items: [
          {
            typeId: "valhalla:generator_mud",
            nameTag: "§cMud Generator",
            keepOnDeath: true,
          },
        ],
      },
    ],
  },
] as Shop[];
