import { NextReq } from "../../../App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  makeReq,
  SectionPackReq,
} from "../../../App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { FeSectionPack } from "../../../App/sharedWithServer/SectionPack/FeSectionPack";
import { StoredSectionPackInfo } from "../../../App/sharedWithServer/SectionPack/SectionPackRaw";
import { SectionFinder } from "../../../App/sharedWithServer/SectionsMeta/baseSectionTypes";
import { SavableSectionName } from "../../../App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import Analyzer from "../Analyzer";

export class ReqMaker {
  constructor(private sections: Analyzer = Analyzer.initAnalyzer()) {}
  sectionPackArr<DN extends SavableSectionName<"arrStore">>(sectionName: DN) {
    const rawSectionPackArr = this.sections.makeRawSectionPackArr(sectionName);
    return makeReq({
      dbStoreName: sectionName,
      sectionPackArr: rawSectionPackArr.map((rawPack) =>
        FeSectionPack.rawFeToServer(rawPack, sectionName as any)
      ),
    });
  }
  nextRegister(): NextReq<"nextRegister"> {
    return makeReq({
      registerFormData: this.sections.section("register").values({
        userName: "string",
        email: "string",
        password: "string",
      }),
      guestAccessSections: this.sections.guestAccessDbSectionPacks(),
    });
  }
  nextLogin(): NextReq<"nextLogin"> {
    return makeReq(
      this.sections.section("login").values({
        email: "string",
        password: "string",
      })
    );
  }
  sectionPack(
    finder: SectionFinder<SavableSectionName<"indexStore">>
  ): SectionPackReq {
    const sectionPack = this.sections.makeRawSectionPack(finder);
    const { sectionName } = sectionPack;
    return makeReq({
      sectionPack: FeSectionPack.rawFeToServer(sectionPack, sectionName),
    });
  }
  sectionPackInfo(spInfo: StoredSectionPackInfo) {
    return makeReq(spInfo);
  }
}
