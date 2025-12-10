import type { StartupEvent } from "@minecraft/server";
import Config from "../lib/config";

export default class Generators {
  public static OnStartup(event: StartupEvent): void {
    const { blockComponentRegistry } = event;

    blockComponentRegistry.registerCustomComponent("valhalla:generator", {
      onTick: ({ block, dimension }) => {
        const generatorBlockType = Config.generators[block.typeId];

        if (!generatorBlockType) {
          return;
        }

        const generatorBlock = block.above();

        if (generatorBlock && generatorBlock?.typeId === generatorBlockType) {
          return;
        }

        dimension.setBlockType(
          {
            ...block.location,
            y: block.location.y + 1,
          },
          generatorBlockType
        );
      },
    });
  }
}
