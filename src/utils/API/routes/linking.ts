import API from "../API";

const LinkingRoute = {
  Use: (code: string, entity_id: string) =>
    API.Post<any, never>(`/linking/use/`, { code, entity_id }),
};

export default LinkingRoute;
