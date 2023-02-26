import { ChildName } from "../../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ParentNameSafe } from "../../SectionsMeta/sectionChildrenDerived/ParentName";
import {
  FeSectionInfo,
  FeVarbInfo,
} from "../../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../SectionsMeta/SectionName";
import { SectionNameByType } from "../../SectionsMeta/SectionNameByType";
import {
  PathSectionName,
  SectionPathName,
} from "../../SectionsMeta/sectionPathContexts/sectionPathNames";
import { GetterList } from "../../StateGetters/GetterList";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { SolverSections } from "../../StateSolvers/SolverSections";
import { SetterSection } from "../SetterSection";
import { SectionTesterBase } from "./Bases/SectionTesterBase";

export class SetterTesterSection<
  SN extends SectionName
> extends SectionTesterBase<SN> {
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): SetterTesterSection<ChildSectionName<SN, CN>> {
    const child = this.get.onlyChild(childName);
    return this.setterTester(child.feInfo);
  }
  get testerProps() {
    return {
      state: this.state,
      sectionName: this.sectionName,
      feId: this.feId,
    } as const;
  }
  setterTester<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SetterTesterSection<S> {
    return new SetterTesterSection({
      ...feInfo,
      state: this.state,
    });
  }
  static initMain(): SetterTesterSection<"main"> {
    const sections = SolverSections.initSectionsFromDefaultMain();
    return new SetterTesterSection({
      ...sections.mainRawSection,
      state: { sections },
    });
  }
  static initActiveDeal(): SetterTesterSection<"deal"> {
    return this.initMain().onlyChild("activeDealPage").onlyChild("deal");
  }
  static initByPathName<PN extends SectionPathName>(
    pathName: PN
  ): SetterTesterSection<PathSectionName<PN>> {
    const activeDeal = this.initActiveDeal();
    const feInfo = activeDeal.get.sectionByFocalMixed({
      infoType: "pathName",
      pathName,
    });
    return activeDeal.setterTester(feInfo) as SetterTesterSection<any>;
  }
  get setter(): SetterSection<SN> {
    return new SetterSection(this.setterSectionTestProps);
  }
  get getter(): GetterSection<SN> {
    return new GetterSection(this.setterSectionTestProps);
  }
  get get(): GetterSection<SN> {
    return this.getter;
  }
  getterList<S extends SectionNameByType>(sectionName: S): GetterList<S> {
    return new GetterList({
      ...this.setterSectionTestProps,
      sectionName,
    });
  }
  get parent(): SetterTesterSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return new SetterTesterSection({
      ...this.sectionTesterProps,
      ...parentInfoSafe,
    });
  }
  childCounts(childName: ChildName<SN>) {
    return {
      childIds: this.get.childFeIds(childName).length,
      allSectionChildren: this.get.childList(childName).length,
    };
  }
  counts() {
    const counts = this.parent.childCounts(this.sectionName as any);
    return {
      siblings: counts.childIds,
      sectionsWithName: counts.allSectionChildren,
    };
  }
  getterVarbFromState<SN extends SectionNameByType>(
    feInfo: FeVarbInfo<SN>
  ): GetterVarb<SN> {
    return new GetterVarb({
      ...feInfo,
      ...GetterVarb.initProps({
        sections: this.state.sections,
      }),
    });
  }
}
