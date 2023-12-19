import {
  DbPackArrQueryArrs,
  makeReq,
} from "../../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { ApiQuerierBase } from "./Bases/ApiQuerierBase";

export class SectionArrQuerier extends ApiQuerierBase {
  async replace(sectionPackArrs: DbPackArrQueryArrs): Promise<void> {
    const req = makeReq({ sectionPackArrs });
    await this.apiQueries.replaceSectionArrs(req);
  }
}
