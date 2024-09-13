import {
  makeReq,
  SectionPackArrsReq,
} from "../../../client/src/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { GetterSectionBase } from "../../../client/src/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSectionsBase } from "../../../client/src/sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../../../client/src/sharedWithServer/StateGetters/GetterSection";
import { PackMakerSection } from "../../../client/src/sharedWithServer/StateGetters/PackMakerSection";
import { TopOperator } from "../../../client/src/sharedWithServer/StateOperators/TopOperator";
import { DbSectionNameByType } from "../../../client/src/sharedWithServer/stateSchemas/fromSchema6SectionChildren/DbStoreName";

export class SectionArrReqMaker<
  SN extends DbSectionNameByType<"sectionQuery">
> extends GetterSectionBase<SN> {
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  private get mainStoreName() {
    return this.get.mainStoreName;
  }
  static init<SN extends DbSectionNameByType<"sectionQuery">>(sectionName: SN) {
    const sections =
      TopOperator.initWithDefaultActiveDealAndSolve().stateSections;
    const section = sections.firstRawSection(sectionName);
    return new SectionArrReqMaker({
      ...section,
      ...GetterSectionsBase.initProps({
        sections,
      }),
    });
  }
  get packMaker(): PackMakerSection<SN> {
    return new PackMakerSection(this.getterSectionProps);
  }
  makeReq(): SectionPackArrsReq {
    return makeReq({
      sectionPackArrs: {
        [this.mainStoreName]: [this.packMaker.makeSectionPack()],
      },
    });
  }
}
