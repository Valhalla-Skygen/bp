export type LeaderboardType =
  | "kills"
  | "deaths"
  | "balance"
  | "souls"
  | "timePlayed";
export interface LeaderboardEntry {
  username: string;
  value: number;
}
