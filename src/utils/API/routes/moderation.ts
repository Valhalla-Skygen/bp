import type { Ban, Warning } from "../../../types/moderation";
import API from "../API";

const ModerationRoute = {
  CreateWarning: (entity_id: string, data: Partial<Warning>) =>
    API.Post<Warning, never>(`/moderation/${entity_id}/warnings/create/`, data),
  DisableWarning: (entity_id: string, id: string) =>
    API.Post<never, never>(`/moderation/${entity_id}/warnings/${id}/disable/`),
  CreateBan: (entity_id: string, data: Partial<Ban>) =>
    API.Post<Ban, never>(`/moderation/${entity_id}/bans/create/`, data),
  DisableBan: (entity_id: string, id: string) =>
    API.Post<never, never>(`/moderation/${entity_id}/bans/${id}/disable/`),

  ActiveWarnings: (entity_id: string) =>
    API.Get<Warning[]>(`/moderation/${entity_id}/warnings/active/`),
  Warnings: (entity_id: string) =>
    API.Get<Warning[]>(`/moderation/${entity_id}/warnings/`),
  ActiveBans: (entity_id: string) =>
    API.Get<Ban[]>(`/moderation/${entity_id}/bans/active/`),
  Bans: (entity_id: string) => API.Get<Ban[]>(`/moderation/${entity_id}/bans/`),
};

export default ModerationRoute;
