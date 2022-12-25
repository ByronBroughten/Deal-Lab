import { makeReq, ReplacePackArrsReq } from "../apiQueriesShared/makeReqAndRes";
import { DbSectionNameByType } from "../SectionsMeta/sectionChildrenDerived/DbStoreName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { PackMakerSection } from "../StatePackers.ts/PackMakerSection";
import { SolverSections } from "../StateSolvers/SolverSections";

export class SectionArrReqMaker<
  SN extends DbSectionNameByType<"arrQuery">
> extends GetterSectionBase<SN> {
  get dbStoreName() {
    return this.sectionMeta.dbIndexStoreName;
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
  get packMaker() {
    return new PackMakerSection(this.getterSectionProps);
  }
  makeReq(): ReplacePackArrsReq {
    return makeReq({
      sectionPackArrs: {
        [this.dbStoreName]: this.packMaker.makeSectionPack(),
      },
    });
  }
}
