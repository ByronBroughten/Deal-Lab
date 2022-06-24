import {
  makeReq,
  SectionPackArrReq,
} from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionPack } from "../../sharedWithServer/SectionPack/SectionPack";
import { DbSectionName } from "../../sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./Bases/ApiQuerierBase";

interface SectionArrQuerierProps<SN extends DbSectionName<"arrStore">>
  extends ApiQuerierBaseProps {
  sectionName: SN;
}

export class SectionArrQuerier<
  SN extends DbSectionName<"arrStore">
> extends ApiQuerierBase {
  readonly sectionName: SN;
  constructor({ sectionName, ...rest }: SectionArrQuerierProps<SN>) {
    super(rest);
    this.sectionName = sectionName;
  }

  async replace(feSectionPackArr: SectionPack<SN>[]): Promise<SN> {
    const req = makeReq({
      sectionName: this.sectionName,
      sectionPackArr: feSectionPackArr,
    }) as SectionPackArrReq<SN>;
    const res = await this.apiQueries.replaceSectionArr(req as any);
    return res.data.sectionName as SN;
  }
}
