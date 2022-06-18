import { ApiQuerier } from "../../App/modules/QueriersBasic/ApiAnalyzerQuerier";
import { SectionPackRaw } from "../../App/sharedWithServer/SectionPack/SectionPackRaw";
import { SavableSectionName } from "../../App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";

interface SectionArrQuerierProps<SN extends SavableSectionName<"arrStore">> {
  sectionName: SN;
}

export class SectionArrDepreciatedQuerier<
  SN extends SavableSectionName<"arrStore">
> {
  readonly sectionName: SN;
  readonly api: ApiQuerier;
  constructor({ sectionName }: SectionArrQuerierProps<SN>) {
    this.sectionName = sectionName;
    this.api = new ApiQuerier();
  }

  async replace(feSectionPackArr: SectionPackRaw<SN>[]): Promise<SN> {
    const req = this.api.makeReq({
      dbStoreName: this.sectionName,
      sectionPackArr: feSectionPackArr,
    } as const);
    const res = await this.api.query.replaceSectionArr(req as any);
    return res.data.dbStoreName as SN;
  }
}
