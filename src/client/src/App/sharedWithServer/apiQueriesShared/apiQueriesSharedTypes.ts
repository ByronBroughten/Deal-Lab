import { config } from "../../Constants";
import { ApiQuery } from "../apiQueriesShared";

export type ApiQueryName = typeof config.apiQueryNames[number];
export type QueryRes<AN extends ApiQueryName> = Awaited<
  ReturnType<ApiQuery<AN>>
>;
export type QueryReq<AN extends ApiQueryName> = Parameters<
  ApiQuery<AN>
>[number];
