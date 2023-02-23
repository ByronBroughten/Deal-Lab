import { makeReq, ReplacePackArrsReq } from "../apiQueriesShared/makeReqAndRes";
import { DbSectionNameByType } from "../SectionsMeta/sectionChildrenDerived/DbStoreName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { PackMakerSection } from "../StatePackers.ts/PackMakerSection";
import { SolverSections } from "../StateSolvers/SolverSections";

export class SectionArrReqMaker<
  SN extends DbSectionNameByType<"arrQuery">
> extends GetterSectionBase<SN> {
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  get dbStoreName() {
    return this.get.dbIndexStoreName;
  }
  static init<SN extends DbSectionNameByType<"arrQuery">>(sectionName: SN) {
    const sections = SolverSections.initSectionsFromDefaultMain();
    const section = sections.firstRawSection(sectionName);
    return new SectionArrReqMaker({
      ...section,
      ...GetterSectionsBase.initProps({
        sections,
        sectionContextName: "default",
      }),
    });
  }
  get packMaker(): PackMakerSection<SN> {
    return new PackMakerSection(this.getterSectionProps);
  }
  makeReq(): ReplacePackArrsReq {
    return makeReq({
      sectionPackArrs: {
        [this.dbStoreName]: [this.packMaker.makeSectionPack()],
      },
    });
  }
}
