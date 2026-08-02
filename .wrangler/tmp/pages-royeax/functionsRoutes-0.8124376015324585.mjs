import { onRequestPost as __api_mentor_ts_onRequestPost } from "C:\\Users\\Jeremy\\Documents\\GitHub\\LEAD_Discover_Day_UPN\\functions\\api\\mentor.ts"

export const routes = [
    {
      routePath: "/api/mentor",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_mentor_ts_onRequestPost],
    },
  ]