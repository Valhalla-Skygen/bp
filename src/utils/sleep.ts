import { system } from "@minecraft/server";

async function Sleep(ticks: number): Promise<void> {
  await system.waitTicks(ticks);
}

export default Sleep;
