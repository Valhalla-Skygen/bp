import Config from "../../../lib/config";
import type {
  LeaderboardEntry,
  LeaderboardType,
} from "../../../types/leaderboards";
import API from "../API";

const LeaderboardRoute = {
  GetLeaderboards: () =>
    API.Get<Record<LeaderboardType, LeaderboardEntry[]>>(
      `/leaderboards/${Config.leaderboard_limit}/`
    ),
};

export default LeaderboardRoute;
