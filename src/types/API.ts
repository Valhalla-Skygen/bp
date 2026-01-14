export interface APIResponse<T> {
  status: number;
  path: string;
  data: T | null;
}

export interface Profile {
  entity_id: string;
  discord_id: string;
  username: string;
  blocks_mined: number;
  kills: number;
  deaths: number;
  killstreak: number;
  killstreak_highest: number;
  balance: number;
  souls: number;
  crate_common: number;
  crate_uncommon: number;
  crate_rare: number;
  crate_epic: number;
  crate_legendary: number;
  crate_valhalla: number;
  time_played: number;
  admin: boolean;
  whitelisted: boolean;
  last_login: Date;
  created_at: Date;
}

export interface ProfileOnlineRequest {
  entity_ids: string[];
}
export interface ProfileSearchRequest {
  username: string;
}
export interface ProfileTransferRequest {
  target: string;
  amount: number;
}
export interface TimePlayedRequest {
  entity_ids: string[];
}
export interface ActiveMembersRequest {
  entity_ids: string[];
}
