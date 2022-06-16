import { FeSectionPack } from "../../sharedWithServer/Analyzer/FeSectionPack";
import { SectionPackRaw } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SavableSectionName } from "../../sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { ApiQuerier } from "./ApiAnalyzerQuerier";

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
    const serverSectionPackArr = feSectionPackArr.map((rawPack) =>
      FeSectionPack.rawFeToServer(rawPack, this.sectionName as any)
    );
    const req = this.api.makeReq({
      dbStoreName: this.sectionName,
      sectionPackArr: serverSectionPackArr,
    } as const);
    const res = await this.api.query.replaceSectionArr(req);
    return res.data.dbStoreName as SN;
  }
}
