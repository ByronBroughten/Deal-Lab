import {
  makeReq,
  SectionPackArrReq,
} from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionPackRaw } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SavableSectionName } from "../../sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./Bases/ApiQuerierBase";

interface SectionArrQuerierProps<SN extends SavableSectionName<"arrStore">>
  extends ApiQuerierBaseProps {
  sectionName: SN;
}

export class SectionArrQuerier<
  SN extends SavableSectionName<"arrStore">
> extends ApiQuerierBase {
  readonly sectionName: SN;
  constructor({ sectionName, ...rest }: SectionArrQuerierProps<SN>) {
    super(rest);
    this.sectionName = sectionName;
  }

  async replace(feSectionPackArr: SectionPackRaw<SN>[]): Promise<SN> {
    const req = makeReq({
      dbStoreName: this.sectionName,
      sectionPackArr: feSectionPackArr,
    }) as SectionPackArrReq<SN>;
    const res = await this.apiQueries.replaceSectionArr(req as any);
    return res.data.dbStoreName as SN;
  }
}
