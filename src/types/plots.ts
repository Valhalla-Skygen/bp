import type { Vector3 } from "@minecraft/server";

export interface Plot {
  _id: string;
  slot: number;
  rotation: number;
  created_by: string;
  created_at: Date;
}
export interface PlotInvite {
  _id: string;
  target: string;
  sender: string;
  plot_id: string;
  created_at: Date;
}

export interface PlotMember {
  entity_id: string;
  plot_id: string;
  rank: number;
  permissions: {
    build: boolean;
    break: boolean;
    containers: boolean;
    inviting: boolean;
    loading: boolean;
    pickup: boolean;
  };
  created_at: Date;
}
export type PlotSlot = {
  slot: number;
  rotation: number;
  saveZone: [Vector3, Vector3];
  locations: Vector3[];
};

export enum PlotRanks {
  MEMBER = 0,
  OWNER = 1,
}
