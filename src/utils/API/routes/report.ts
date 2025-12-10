import type { Report } from "../../../types/reports";
import API from "../API";

const ReportRoute = {
  Create: (data: Partial<Report>) =>
    API.Post<Report, never>("/report/create/", data),
  CloseReport: (id: string) => API.Post<never, never>(`/report/${id}/close/`),

  ActiveReports: () => API.Get<Report[]>("/report/active/"),
  GetReports: (entity_id: string) => API.Get<Report[]>(`/report/${entity_id}/`),
};

export default ReportRoute;
