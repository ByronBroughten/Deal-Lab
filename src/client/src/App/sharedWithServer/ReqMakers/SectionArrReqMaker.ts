import { makeReq, SectionPackArrsReq } from "../apiQueriesShared/makeReqAndRes";
import { DbSectionNameByType } from "../SectionsMeta/sectionChildrenDerived/DbStoreName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { PackMakerSection } from "../StatePackers/PackMakerSection";
import { TopOperator } from "../StateSolvers/TopOperator";

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
