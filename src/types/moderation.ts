export interface Warning {
  _id: string;
  entity_id: string;
  staff: string;
  reason: string;
  method: "discord" | "ingame" | "system";
  active: boolean;
  created_at: Date;
}
export interface Ban {
  _id: string;
  entity_id: string;
  staff: string;
  reason: string;
  method: "discord" | "ingame" | "system";
  active: boolean;
  expires_at: Date | null;
  created_at: Date;
}

export interface BanDuration {
  label: string;
  minutes: number | null;
}
