import { ApiQueries } from "../../sharedWithServer/apiQueriesShared";
import { apiQueries } from "../useQueryActionsTest/apiQueriesClient";

export class ApiQuerier {
  get query(): ApiQueries {
    return apiQueries;
  }
  makeReq<B extends QueryObj>(body: B): MakeReq<B> {
    return { body };
  }
}

type QueryObj = { [key: string]: any };
type MakeReq<B extends QueryObj> = {
  body: B;
};
