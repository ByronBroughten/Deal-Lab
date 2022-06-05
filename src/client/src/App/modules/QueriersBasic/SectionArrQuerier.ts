import { FeSectionPack } from "../../sharedWithServer/Analyzer/FeSectionPack";
import { SectionPackRaw } from "../../sharedWithServer/Analyzer/SectionPackRaw";
import { SavableSectionName } from "../../sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { ApiQuerier } from "./ApiQuerier";

export class SectionArrQuerier {
  constructor(readonly sectionName: SavableSectionName<"arrStore">) {}
  api = new ApiQuerier();

  async replace(
    feSectionPackArr: SectionPackRaw<SavableSectionName<"arrStore">>[]
  ): Promise<SavableSectionName<"arrStore">> {
    const serverSectionPackArr = feSectionPackArr.map((rawPack) =>
      FeSectionPack.rawFeToServer(rawPack, this.sectionName as any)
    );
    const req = this.api.makeReq({
      dbStoreName: this.sectionName,
      sectionPackArr: serverSectionPackArr,
    } as const);
    const res = await this.api.query.replaceSectionArr(req);
    return res.data.dbStoreName as SavableSectionName<"arrStore">;
  }
}
