import {
  makeReq,
  SectionPackArrReq,
} from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  DbSectionName,
  DbStoreNameByType,
} from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./Bases/ApiQuerierBase";

interface SectionArrQuerierProps<CN extends DbStoreNameByType<"arrQuery">>
  extends ApiQuerierBaseProps {
  dbStoreName: CN;
}

export class SectionArrQuerier<
  CN extends DbStoreNameByType<"arrQuery">
> extends ApiQuerierBase {
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
