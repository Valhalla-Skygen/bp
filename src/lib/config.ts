import type { ChatRank } from "../types/chatRanks";
import type { FloatingText } from "../types/floatingText";
import type { LagClearMessage } from "../types/lagClear";
import type { BanDuration } from "../types/moderation";
import type { PlotSlot } from "../types/plots";
import type { Zone } from "../types/protection";
import type { Warp } from "../types/warps";
import { SellingOptions, Shops } from "./shops";
import StarterKit from "./starterKit";

const Config = {
  debug: true,

  // General
  max_players: 30,
  sounds: {
    info: "note.hat",
    success: "note.pling",
    warning: "note.harp",
    error: "note.bass",
    raidnight_start: "mob.wither.death",
    raidnight_end: "random.levelup",
  },
  colors: {
    info: "§7",
    success: "§a",
    warning: "§e",
    error: "§c",
  },

  ui_typeid: "minecraft:nether_star",
  ui_nametag: "§cValhalla Skygen UI",

  api_uri: "http://127.0.0.1:3000",

  cache_speed: 50,

  name_interval: 5,
  plot_eject_interval: 5,
  plot_tag_interval: 60,
  sidebar_interval: 1,
  floating_text_interval: 100,
  force_ui_interval: 100,
  leaderboard_interval: 20 * 30,
  zone_interval: 20 * 1,
  raidnight_interval: 20 * 1,
  lag_clear_check_inverval: 20 * 30,
  cps_limiter_interval: 5,

  raidnight_start: 13500,
  raidnight_end: 23500,

  cps_limit: 15,

  combat_time: 15,

  warp_delay: 5,

  leaderboard_limit: 10,

  lag_clear_threshold: 150,
  lag_clear_entities: ["minecraft:item", "minecraft:xp_orb"],
  lag_clear_blacklist: [
    "minecraft:snow_golem",
    "minecraft:iron_golem",
    "minecraft:copper_golem",
    "minecraft:armor_stand",
    "minecraft:boat",
    "minecraft:chest_boat",
    "minecraft:minecart",
    "minecraft:chest_minecart",
    "minecraft:hopper_minecart",
    "minecraft:tnt_minecart",
  ], // Entities that are just not allowed to spawn.
  lag_clear_countdown: [
    {
      message: "Lag clear running in 10 seconds!",
      delay: 20 * 5,
    },
    {
      message: "Lag clear running in 5 seconds!",
      delay: 20 * 2,
    },
    {
      message: "Lag clear running in 3 seconds!",
      delay: 20,
    },
    {
      message: "Lag clear running in 2 seconds!",
      delay: 20,
    },
    {
      message: "Lag clear running in 1 second!",
      delay: 20,
    },
  ] as LagClearMessage[],

  chat_period: 5 * 20,
  chat_limit: 3, // Messages
  chat_rank_definitions: [
    { id: "dev", name: "" },
    { id: "builder", name: "" },
    { id: "designer", name: "" },
    { id: "staff", name: "" },
    { id: "helper", name: "" },
    { id: "pbTester", name: "" },
    { id: "beaner", name: "" },
  ],
  chat_ranks: [
    { username: "Espryra", ranks: ["dev"] },
    { username: "Zappy NE", ranks: ["dev", "pbTester"] },
    { username: "Mr Trex420", ranks: ["builder"] },
    { username: "Daddy Kazse", ranks: ["designer"] },
    { username: "OarisRose", ranks: ["staff"] },
    { username: "SerialxxV", ranks: ["helper"] },
    { username: "LvckX", ranks: ["pbTester"] },
    { username: "Droxco", ranks: ["pbTester", "beaner"] },
    { username: "Saltyy NaCl", ranks: ["pbTester"] },
    { username: "Nugget NaCl", ranks: ["pbTester"] },
    { username: "BlueIceCrown", ranks: ["pbTester"] },
    { username: "ItsTalvyn", ranks: ["pbTester"] },
    { username: "Tbs habebe", ranks: ["pbTester"] },
    { username: "Reehan016090", ranks: ["pbTester"] },
    { username: "BeautifulPie15", ranks: ["pbTester"] },
    { username: "Nyxtrax", ranks: ["pbTester"] },
    { username: "NHIS August", ranks: ["pbTester"] },
  ] as ChatRank[],

  generators: {
    "valhalla:generator_pale_moss": "minecraft:pale_moss_block",
    "valhalla:generator_moss": "minecraft:moss_block",
    "valhalla:generator_dirt": "minecraft:dirt",
    "valhalla:generator_rooted_dirt": "minecraft:dirt_with_roots",
    "valhalla:generator_coarse_dirt": "minecraft:coarse_dirt",
    "valhalla:generator_packed_mud": "minecraft:packed_mud",
    "valhalla:generator_podzol_dirt": "minecraft:podzol",
    "valhalla:generator_oak_planks": "minecraft:oak_planks",
    "valhalla:generator_spruce_planks": "minecraft:spruce_planks",
    "valhalla:generator_birch_planks": "minecraft:birch_planks",
    "valhalla:generator_jungle_planks": "minecraft:jungle_planks",
    "valhalla:generator_acacia_planks": "minecraft:acacia_planks",
    "valhalla:generator_dark_oak_planks": "minecraft:dark_oak_planks",
    "valhalla:generator_mangrove_planks": "minecraft:mangrove_planks",
    "valhalla:generator_cherry_planks": "minecraft:cherry_planks",
    "valhalla:generator_stone": "minecraft:stone",
    "valhalla:generator_granite": "minecraft:granite",
    "valhalla:generator_diorite": "minecraft:diorite",
    "valhalla:generator_andesite": "minecraft:andesite",
    "valhalla:generator_blackstone": "minecraft:blackstone",
    "valhalla:generator_tuff": "minecraft:tuff",
    "valhalla:generator_basalt": "minecraft:basalt",
    "valhalla:generator_deepslate": "minecraft:deepslate",
    "valhalla:generator_gravel": "minecraft:gravel",
    "valhalla:generator_deepslate_coal": "minecraft:deepslate_coal_ore",
    "valhalla:generator_oak_log": "minecraft:oak_log",
    "valhalla:generator_spruce_log": "minecraft:spruce_log",
    "valhalla:generator_birch_log": "minecraft:birch_log",
    "valhalla:generator_jungle_log": "minecraft:jungle_log",
    "valhalla:generator_acacia_log": "minecraft:acacia_log",
    "valhalla:generator_dark_oak_log": "minecraft:dark_oak_log",
    "valhalla:generator_mangrove_log": "minecraft:mangrove_log",
    "valhalla:generator_cherry_log": "minecraft:cherry_log",
    "valhalla:generator_sand": "minecraft:sand",
    "valhalla:generator_brick": "minecraft:brick_block",
    "valhalla:generator_gilded_blackstone": "minecraft:gilded_blackstone",
    "valhalla:generator_hay": "minecraft:hay_block",
    "valhalla:generator_bone": "minecraft:bone_block",
    "valhalla:generator_dark_prismarine": "minecraft:dark_prismarine",
    "valhalla:generator_prismarine": "minecraft:prismarine",
    "valhalla:generator_red_nether_brick": "minecraft:red_nether_brick",
    "valhalla:generator_nether_brick": "minecraft:nether_brick",
    "valhalla:generator_deepslate_copper": "minecraft:deepslate_copper_ore",
    "valhalla:generator_kelp_block": "minecraft:dried_kelp_block",
    "valhalla:generator_white_wool": "minecraft:white_wool",
    "valhalla:generator_gray_wool": "minecraft:light_gray_wool",
    "valhalla:generator_dark_gray_wool": "minecraft:gray_wool",
    "valhalla:generator_black_wool": "minecraft:black_wool",
    "valhalla:generator_red_wool": "minecraft:red_wool",
    "valhalla:generator_orange_wool": "minecraft:orange_wool",
    "valhalla:generator_yellow_wool": "minecraft:yellow_wool",
    "valhalla:generator_lime_wool": "minecraft:lime_wool",
    "valhalla:generator_green_wool": "minecraft:green_wool",
    "valhalla:generator_cyan_wool": "minecraft:cyan_wool",
    "valhalla:generator_light_blue_wool": "minecraft:light_blue_wool",
    "valhalla:generator_blue_wool": "minecraft:blue_wool",
    "valhalla:generator_purple_wool": "minecraft:purple_wool",
    "valhalla:generator_magenta_wool": "minecraft:magenta_wool",
    "valhalla:generator_pink_wool": "minecraft:pink_wool",
    "valhalla:generator_deepslate_iron": "minecraft:deepslate_iron_ore",
    "valhalla:generator_endstone": "minecraft:end_stone",
    "valhalla:generator_quartz_ore": "minecraft:quartz_ore",
    "valhalla:generator_deepslate_redstone": "minecraft:deepslate_redstone_ore",
    "valhalla:generator_deepslate_lapis": "minecraft:deepslate_lapis_ore",
    "valhalla:generator_deepslate_gold": "minecraft:deepslate_gold_ore",
    "valhalla:generator_honeycomb_block": "minecraft:honeycomb_block",
    "valhalla:generator_resin_block": "minecraft:resin_block",
    "valhalla:generator_white_concrete": "minecraft:white_concrete",
    "valhalla:generator_gray_concrete": "minecraft:light_gray_concrete",
    "valhalla:generator_dark_gray_concrete": "minecraft:gray_concrete",
    "valhalla:generator_black_concrete": "minecraft:black_concrete",
    "valhalla:generator_brown_concrete": "minecraft:brown_concrete",
    "valhalla:generator_red_concrete": "minecraft:red_concrete",
    "valhalla:generator_orange_concrete": "minecraft:orange_concrete",
    "valhalla:generator_yellow_concrete": "minecraft:yellow_concrete",
    "valhalla:generator_lime_concrete": "minecraft:lime_concrete",
    "valhalla:generator_green_concrete": "minecraft:green_concrete",
    "valhalla:generator_cyan_concrete": "minecraft:cyan_concrete",
    "valhalla:generator_light_blue_concrete": "minecraft:light_blue_concrete",
    "valhalla:generator_blue_concrete": "minecraft:blue_concrete",
    "valhalla:generator_purple_concrete": "minecraft:purple_concrete", // NOT ADDED!
    "valhalla:generator_magenta_concrete": "minecraft:magenta_concrete",
    "valhalla:generator_pink_concrete": "minecraft:pink_concrete",
    "valhalla:generator_deepslate_diamond": "minecraft:deepslate_diamond_ore",
    "valhalla:generator_dripstone": "minecraft:dripstone_block",
    "valhalla:generator_amethyst": "minecraft:amethyst_block",
    "valhalla:generator_mud": "minecraft:mud",
  } as Record<string, string>, // Generator TypeID -> Generator Block TypeId

  banning_durations: [
    {
      label: "1 minute",
      minutes: 1,
    },
    {
      label: "10 minutes",
      minutes: 10,
    },
    {
      label: "30 minutes",
      minutes: 30,
    },
    {
      label: "1 hour",
      minutes: 1 * 60,
    },
    {
      label: "2 hours, 30 minutes",
      minutes: 2.5 * 60,
    },
    {
      label: "6 hours",
      minutes: 6 * 60,
    },
    {
      label: "12 hours",
      minutes: 12 * 60,
    },
    {
      label: "1 day",
      minutes: 24 * 60,
    },
    {
      label: "3 days",
      minutes: 3 * 24 * 60,
    },
    {
      label: "1 week",
      minutes: 7 * 24 * 60,
    },
    {
      label: "2 weeks",
      minutes: 14 * 24 * 60,
    },
    {
      label: "1 month",
      minutes: 30 * 24 * 60,
    },
    {
      label: "Permanent",
      minutes: null,
    },
  ] as BanDuration[],

  warning_limit: 3,

  floating_text: [
    {
      text: "Welcome to Valhalla Skygen!\n\nPlease use the UI item in your inventory\nto navigate throughout the server!\n\nMembers Online: §a{{PLAYERSONLINE}}§7/§v{{MAXPLAYERS}}",
      tag: "welcomeText",
    },
    {
      text: "See something wrong with a player?\n\nUse the UI item in your inventory\nto report them!\n\n§lYou must have a clip!",
      tag: "reportText",
    },
  ] as FloatingText[],

  zones: [
    {
      radius: 125,
      tag: "spawn",
      safe: true,
      location: {
        x: 687.5,
        y: 83.5,
        z: -5824.5,
      },
    },
    {
      radius: 500,
      tag: "plots",
      safe: false,
      location: {
        x: 1353.5,
        y: 66.5,
        z: -5554.5,
      },
    },
  ] as Zone[],

  starter_kit_tag: "starterKit",
  starter_kit_name: "§cStarter Kit",
  starter_kit: StarterKit,

  shops: Shops,
  shop_selling_tag: "selling",
  shop_selling_options: SellingOptions,

  warps: [
    {
      name: "Spawn",
      icon: "textures/items/totem",
      tag: "spawn",
      location: {
        x: 687.5,
        y: 83.5,
        z: -5824.5,
      },
    },
    {
      name: "Crates",
      icon: "textures/blocks/chest_front.png",
      tag: "spawn",
      location: {
        x: 687.5,
        y: 81.5,
        z: -5803.5,
      },
    },
    {
      name: "Shops",
      icon: "textures/items/emerald",
      tag: "spawn",
      location: {
        x: 778.5,
        y: 88.5,
        z: -5824.5,
      },
    },
  ] as Warp[],

  plot_default_structure: "mystructure:defaultPlot",
  plot_loading_cooldown: 15, // Seconds
  plot_max_members: 4,
  // Note: Plots' rotation starts facing West (rotation: 0) and goes clockwise; North (rotation: 90), East (rotation: 180), South (rotation: 270).
  // West can be found by going -X; East by +X; North by -Z; South by +Z
  plot_slots: [
    {
      slot: 1,
      locations: [{ x: 1481, y: 64, z: -5803 }], // 1481 64 -5803
      rotation: 0,
      saveZone: [
        { x: 1488, y: 52, z: -5810 },
        { x: 1503, y: 114, z: -5795 },
      ],
    },
    {
      slot: 2,
      locations: [{ x: 1619, y: 65, z: -5577 }], // 1619 65 -5577
      rotation: 180,
      saveZone: [
        { x: 1597, y: 53, z: -5584 },
        { x: 1612, y: 115, z: -5569 },
      ],
    },
    {
      slot: 3,
      locations: [{ x: 1531, y: 65, z: -5634 }], // 1531 65 -5634
      rotation: 180,
      saveZone: [
        { x: 1509, y: 53, z: -5642 },
        { x: 1524, y: 115, z: -5627 },
      ],
    },
    {
      slot: 4,
      locations: [{ x: 1533, y: 65, z: -5548 }], // 1533 65 -5548
      rotation: 270,
      saveZone: [
        { x: 1525, y: 53, z: -5569 },
        { x: 1540, y: 115, z: -5554 },
      ],
    },
    {
      slot: 5,
      locations: [{ x: 1461, y: 64, z: -5725 }], // 1461 64 -5725
      rotation: 270,
      saveZone: [
        { x: 1453, y: 52, z: -5747 },
        { x: 1468, y: 114, z: -5732 },
      ],
    },
    {
      slot: 6,
      locations: [{ x: 1461, y: 65, z: -5512 }], // 1461 65 -5512
      rotation: 90,
      saveZone: [
        { x: 1453, y: 53, z: -5507 },
        { x: 1468, y: 115, z: -5492 },
      ],
    },
    {
      slot: 7,
      locations: [{ x: 1451, y: 64, z: -5448 }], // 1451 64 -5448
      rotation: 90,
      saveZone: [
        { x: 1445, y: 52, z: -5442 },
        { x: 1460, y: 114, z: -5427 },
      ],
    },
    {
      slot: 8,
      locations: [{ x: 1459, y: 65, z: -5634 }], // 1459 65 -5634
      rotation: 180,
      saveZone: [
        { x: 1438, y: 53, z: -5642 },
        { x: 1453, y: 115, z: -5627 },
      ],
    },
    {
      slot: 9,
      locations: [{ x: 1397, y: 65, z: -5689 }], // 1397 65 -5689
      rotation: 270,
      saveZone: [
        { x: 1390, y: 52, z: -5710 },
        { x: 1405, y: 114, z: -5695 },
      ],
    },
    {
      slot: 10,
      locations: [{ x: 1385, y: 65, z: -5446 }], // 1385 65 -5446
      rotation: 90,
      saveZone: [
        { x: 1378, y: 53, z: -5440 },
        { x: 1393, y: 115, z: -5425 },
      ],
    },
    {
      slot: 11,
      locations: [{ x: 1366, y: 66, z: -5578 }], // 1366 66 -5578
      rotation: 270,
      saveZone: [
        { x: 1359, y: 53, z: -5598 },
        { x: 1374, y: 115, z: -5583 },
      ],
    },
    {
      slot: 12,
      locations: [{ x: 1306, y: 64, z: -5679 }], // 1306 64 -5679
      rotation: 0,
      saveZone: [
        { x: 1311, y: 52, z: -5686 },
        { x: 1326, y: 114, z: -5671 },
      ],
    },
    {
      slot: 13,
      locations: [{ x: 1329, y: 65, z: -5490 }], // 1329 65 -5490
      rotation: 90,
      saveZone: [
        { x: 1321, y: 53, z: -5485 },
        { x: 1336, y: 115, z: -5470 },
      ],
    },
    {
      slot: 14,
      locations: [{ x: 1313, y: 64, z: -5381 }], // 1313 64 -5381
      rotation: 180,
      saveZone: [
        { x: 1293, y: 52, z: -5389 },
        { x: 1308, y: 114, z: -5374 },
      ],
    },
    {
      slot: 15,
      locations: [{ x: 1257, y: 64, z: -5681 }], // 1257 64 -5681
      rotation: 180,
      saveZone: [
        { x: 1237, y: 52, z: -5689 },
        { x: 1252, y: 114, z: -5674 },
      ],
    },
    {
      slot: 16,
      locations: [{ x: 1254, y: 65, z: -5550 }], // 1254 65 -5550
      rotation: 90,
      saveZone: [
        { x: 1246, y: 53, z: -5545 },
        { x: 1261, y: 115, z: -5530 },
      ],
    },
    {
      slot: 17,
      locations: [{ x: 1243, y: 65, z: -5466 }], // 1243 65 -5466
      rotation: 0,
      saveZone: [
        { x: 1248, y: 53, z: -5473 },
        { x: 1263, y: 115, z: -5458 },
      ],
    },
    {
      slot: 18,
      locations: [{ x: 1219, y: 64, z: -5316 }], // 1219 64 -5316
      rotation: 180,
      saveZone: [
        { x: 1199, y: 52, z: -5324 },
        { x: 1214, y: 114, z: -5309 },
      ],
    },
    {
      slot: 19,
      locations: [{ x: 1213, y: 64, z: -5383 }], // 1213 64 -5383
      rotation: 270,
      saveZone: [
        { x: 1206, y: 52, z: -5403 },
        { x: 1221, y: 114, z: -5388 },
      ],
    },
    {
      slot: 20,
      locations: [{ x: 1212, y: 64, z: -5614 }], // 1212 64 -5614
      rotation: 90,
      saveZone: [
        { x: 1204, y: 52, z: -5609 },
        { x: 1219, y: 114, z: -5594 },
      ],
    },
    {
      slot: 21,
      locations: [{ x: 1118, y: 64, z: -5260 }], // 1118 64 -5260
      rotation: 90,
      saveZone: [
        { x: 1110, y: 52, z: -5255 },
        { x: 1125, y: 114, z: -5240 },
      ],
    },
    {
      slot: 22,
      locations: [{ x: 1135, y: 64, z: -5376 }], // 1135 64 -5376
      rotation: 180,
      saveZone: [
        { x: 1115, y: 52, z: -5384 },
        { x: 1130, y: 114, z: -5369 },
      ],
    },
    {
      slot: 23,
      locations: [{ x: 1158, y: 65, z: -5517 }], // 1158 65 -5517
      rotation: 0,
      saveZone: [
        { x: 1163, y: 53, z: -5524 },
        { x: 1178, y: 115, z: -5509 },
      ],
    },
    {
      slot: 24,
      locations: [{ x: 1113, y: 64, z: -5546 }], // 1113 64 -5546
      rotation: 270,
      saveZone: [
        { x: 1106, y: 52, z: -5566 },
        { x: 1121, y: 114, z: -5551 },
      ],
    },
    {
      slot: 25,
      locations: [{ x: 1073, y: 64, z: -5312 }], // 1073 64 -5312
      rotation: 0,
      saveZone: [
        { x: 1078, y: 52, z: -5319 },
        { x: 1093, y: 114, z: -5304 },
      ],
    },
    {
      slot: 26,
      locations: [{ x: 1071, y: 64, z: -5492 }], // 1071 64 -5492
      rotation: 0,
      saveZone: [
        { x: 1076, y: 52, z: -5499 },
        { x: 1091, y: 114, z: -5484 },
      ],
    },
    {
      slot: 27,
      locations: [{ x: 1025, y: 64, z: -5253 }], // 1025 64 -5253
      rotation: 180,
      saveZone: [
        { x: 1005, y: 52, z: -5261 },
        { x: 1020, y: 114, z: -5246 },
      ],
    },
    {
      slot: 28,
      locations: [{ x: 974, y: 64, z: -5309 }], // 974 64 -5309
      rotation: 270,
      saveZone: [
        { x: 967, y: 52, z: -5329 },
        { x: 982, y: 114, z: -5314 },
      ],
    },
    {
      slot: 29,
      locations: [{ x: 996, y: 64, z: -5395 }], // 996 64 -5395
      rotation: 180,
      saveZone: [
        { x: 976, y: 52, z: -5403 },
        { x: 991, y: 114, z: -5388 },
      ],
    },
    {
      slot: 30,
      locations: [{ x: 1055, y: 64, z: -5430 }], // 1055 64 -5430
      rotation: 90,
      saveZone: [
        { x: 1047, y: 52, z: -5425 },
        { x: 1062, y: 114, z: -5410 },
      ],
    },
  ] as PlotSlot[],
};

export default Config;
