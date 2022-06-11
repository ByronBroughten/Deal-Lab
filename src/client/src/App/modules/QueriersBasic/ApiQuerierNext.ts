import { ApiQueries } from "../useQueryActions/apiQueriesClient";

export type ApiQuerierProps = {
  apiQueries: ApiQueries;
};

export class ApiQuerierNext {
  query: ApiQueries;
  constructor({ apiQueries }: ApiQuerierProps) {
    this.query = apiQueries;
  }
  makeReq<B extends QueryObj>(body: B): MakeReq<B> {
    return { body };
  }
}

type QueryObj = { [key: string]: any };
type MakeReq<B extends QueryObj> = {
  body: B;
};
