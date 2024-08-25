import { ApiQueries } from "../../../../sharedWithServer/ApiQueries";

export type ApiQuerierBaseProps = {
  readonly apiQueries: ApiQueries;
};

export class ApiQuerierBase {
  readonly apiQueries: ApiQueries;
  constructor({ apiQueries }: ApiQuerierBaseProps) {
    this.apiQueries = apiQueries;
  }
  get apiQuerierBaseProps(): ApiQuerierBaseProps {
    return { apiQueries: this.apiQueries };
  }
}
