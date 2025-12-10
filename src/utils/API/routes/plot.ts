import Config from "../../../lib/config";
import type { ActiveMembersRequest } from "../../../types/API";
import type { Plot, PlotInvite, PlotMember } from "../../../types/plots";
import API from "../API";

const PlotRoute = {
  CreatePlot: (data: Partial<Plot>) =>
    API.Post<Plot, never>("/plot/create/", data),
  UpdatePlot: (id: string, data: Partial<Plot>) =>
    API.Post<Plot, never>(`/plot/${id}/update/`, data),
  DeletePlot: (id: string) => API.Post<never, never>(`/plot/${id}/delete/`),
  Invite: (id: string, data: Partial<PlotInvite>) =>
    API.Post<PlotInvite, never>(`/plot/${id}/invite/`, data),
  TransferOwnership: (id: string, entity_id: string) =>
    API.Post<never, never>(`/plot/${id}/transferownership/${entity_id}/`),
  DeleteInvite: (id: string, invite_id: string) =>
    API.Post<never, never>(`/plot/${id}/invites/${invite_id}/delete/`),
  AcceptInvite: (id: string, invite_id: string) =>
    API.Post<never, never>(
      `/plot/${id}/invites/${invite_id}/accept/${Config.plot_max_members}`
    ),
  CreateMember: (id: string, data: Partial<PlotMember>) =>
    API.Post<PlotMember, never>(`/plot/${id}/members/create/`, data),
  UpdateMember: (id: string, member_id: string, data: Partial<PlotMember>) =>
    API.Post<PlotMember, never>(
      `/plot/${id}/members/${member_id}/update/`,
      data
    ),
  DeleteMember: (entity_id: string) =>
    API.Post<never, never>(`/plot/members/${entity_id}/delete/`),
  ActiveMembers: (ids: string[]) =>
    API.Post<ActiveMembersRequest, PlotMember[]>("/plot/all/members/active/", {
      entity_ids: ids,
    }),

  Plot: (id: string) => API.Get<Plot>(`/plot/${id}/`),
  Member: (entity_id: string) =>
    API.Get<PlotMember>(`/plot/members/${entity_id}/`),
  PlotMembers: (id: string) => API.Get<PlotMember[]>(`/plot/${id}/members/`),
  MemberInvites: (entity_id: string) =>
    API.Get<PlotInvite[]>(`/plot/members/${entity_id}/invites/`),
  PlotInvites: (id: string) => API.Get<PlotInvite[]>(`/plot/${id}/invites/`),
  AllPlots: () => API.Get<Plot[]>("/plot/all/"),
  ActivePlots: () => API.Get<Plot[]>("/plot/all/active/"),
  AllMembers: () => API.Get<PlotMember[]>(`/plot/all/members/`),
};

export default PlotRoute;
