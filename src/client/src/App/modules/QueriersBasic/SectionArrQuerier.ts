import {
  makeReq,
  SectionPackArrReq,
} from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionPack } from "../../sharedWithServer/SectionPack/SectionPack";
import {
  DbSectionName,
  DbStoreName,
} from "../../sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./Bases/ApiQuerierBase";

interface SectionArrQuerierProps<CN extends DbStoreName>
  extends ApiQuerierBaseProps {
  dbStoreName: CN;
}

export class SectionArrQuerier<CN extends DbStoreName> extends ApiQuerierBase {
  readonly dbStoreName: CN;
  constructor({ dbStoreName, ...rest }: SectionArrQuerierProps<CN>) {
    super(rest);
    this.dbStoreName = dbStoreName;
  }
  async replace(
    feSectionPackArr: SectionPack<DbSectionName<CN>>[]
  ): Promise<void> {
    const req = makeReq({
      dbStoreName: this.dbStoreName,
      sectionPackArr: feSectionPackArr,
    }) as SectionPackArrReq<CN>;
    await this.apiQueries.replaceSectionArr(req);
  }
}
