import { ChildName } from "../../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ParentNameSafe } from "../../SectionsMeta/sectionChildrenDerived/ParentName";
import {
  FeSectionInfo,
  FeVarbInfo,
} from "../../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../SectionsMeta/SectionName";
import { SectionNameByType } from "../../SectionsMeta/SectionNameByType";
import { GetterList } from "../../StateGetters/GetterList";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { SolverSections } from "../../StateSolvers/SolverSections";
import { SetterSection } from "../SetterSection";
import {
  SectionTesterBase,
  SectionTesterProps,
} from "./Bases/SectionTesterBase";

export class SetterTesterSection<
  SN extends SectionName
> extends SectionTesterBase<SN> {
  static initProps<S extends SectionName>(
    sectionName: S
  ): SectionTesterProps<S> {
    const sections = SolverSections.initSectionsFromDefaultMain();
    const list = new GetterList({
      sectionName,
      ...GetterList.initProps({ sections, sectionContextName: "default" }),
    });
    return {
      ...list.last.feInfo,
      state: { sections },
    };
  }
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): SetterTesterSection<ChildSectionName<SN, CN>> {
    const child = this.get.onlyChild(childName);
    return this.setterTester(child.feInfo);
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
    return this.initMain().onlyChild("activeDeal");
  }
  static init<S extends SectionNameByType>(
    sectionName: S
  ): SetterTesterSection<S> {
    return new SetterTesterSection(this.initProps(sectionName));
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
        sectionContextName: "default",
      }),
    });
  }
}
