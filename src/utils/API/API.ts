import {
  http,
  HttpHeader,
  HttpRequest,
  HttpRequestMethod,
} from "@minecraft/server-net";
import Config from "../../lib/config";
import type { APIResponse } from "../../types/API";
import LeaderboardRoute from "./routes/leaderboard";
import LinkingRoute from "./routes/linking";
import ModerationRoute from "./routes/moderation";
import PlotRoute from "./routes/plot";
import ProfileRoute from "./routes/profile";
import ReportRoute from "./routes/report";
import ShopRoute from "./routes/shop";

export default class API {
  public static get Profiles(): typeof ProfileRoute {
    return ProfileRoute;
  }
  public static get Shops(): typeof ShopRoute {
    return ShopRoute;
  }
  public static get Plots(): typeof PlotRoute {
    return PlotRoute;
  }
  public static get Reports(): typeof ReportRoute {
    return ReportRoute;
  }
  public static get Leaderboards(): typeof LeaderboardRoute {
    return LeaderboardRoute;
  }
  public static get Moderation(): typeof ModerationRoute {
    return ModerationRoute;
  }
  public static get Linking(): typeof LinkingRoute {
    return LinkingRoute;
  }

  public static async Get<T>(route: string): Promise<APIResponse<T>> {
    const options = new HttpRequest(Config.api_uri + route);

    options.setMethod(HttpRequestMethod.Get);
    options.setHeaders([new HttpHeader("Content-Type", "application/json")]);

    const request = await http.request(options);
    const response: APIResponse<T> = {
      status: request.status,
      path: route,
      data: null,
    };

    if (request.body.startsWith("{") || request.body.startsWith("[")) {
      response.data = JSON.parse(request.body) as T;
    }

    return response;
  }
  public static async Post<T, R>(
    route: string,
    data?: Partial<T>
  ): Promise<APIResponse<R>> {
    const options = new HttpRequest(Config.api_uri + route);

    options.setMethod(HttpRequestMethod.Post);
    options.setHeaders([new HttpHeader("Content-Type", "application/json")]);
    options.setBody(!data ? "{}" : JSON.stringify(data));

    const request = await http.request(options);
    const response: APIResponse<R> = {
      status: request.status,
      path: route,
      data: null,
    };

    if (request.body.startsWith("{") || request.body.startsWith("[")) {
      response.data = JSON.parse(request.body) as R;
    }

    return response;
  }
}
