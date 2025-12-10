import type {
  Profile,
  ProfileOnlineRequest,
  ProfileSearchRequest,
  ProfileTransferRequest,
  TimePlayedRequest,
} from "../../../types/API";
import API from "../API";

const ProfileRoute = {
  Create: (data: Partial<Profile>) =>
    API.Post<Profile, never>("/profile/create/", data),
  Update: (entity_id: string, data: Partial<Profile>) =>
    API.Post<Profile, never>(`/profile/${entity_id}/update/`, data),
  Search: (username: string) =>
    API.Post<ProfileSearchRequest, Profile[]>("/profile/search/", { username }),
  Online: (online: string[]) =>
    API.Post<ProfileOnlineRequest, Profile[]>("/profile/online/", {
      entity_ids: online,
    }),
  TimePlayed: (online: string[]) =>
    API.Post<TimePlayedRequest, Profile[]>("/profile/timeplayed/", {
      entity_ids: online,
    }),
  Kill: (entity_id: string) =>
    API.Post<never, never>(`/profile/${entity_id}/kill/`),
  Death: (entity_id: string) =>
    API.Post<never, never>(`/profile/${entity_id}/death/`),
  Transfer: (entity_id: string, data: ProfileTransferRequest) =>
    API.Post<ProfileTransferRequest, never>(
      `/profile/${entity_id}/transfer/`,
      data
    ),
  AddBlocksMined: (entity_id: string) =>
    API.Post<never, never>(`/profile/${entity_id}/blocksmined/`),

  Profile: (entity_id: string) => API.Get<Profile>(`/profile/${entity_id}/`),
};

export default ProfileRoute;
