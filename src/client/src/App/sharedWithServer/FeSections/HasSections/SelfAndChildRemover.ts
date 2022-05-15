import { GConstructor } from "../../../utils/classObjects";
import { FullSectionBaseI } from "../../SectionFocal/FocalSectionBase";
import { FeInfo, InfoS } from "../../SectionsMeta/Info";
import {
  ChildFeInfo,
  ChildName,
  FeChildInfo,
} from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { FeSections } from "../../SectionsState/SectionsState";

export interface SelfAndChildRemoverI<SN extends SectionName>
  extends FullSectionBaseI<SN> {
  removeSelf(): void;
  wipeChildren(childName: ChildName<SN>): void;
  removeChild({ sectionName, feId }: FeChildInfo<SN>): void;
}

export function ApplySelfAndChildRemover<
  SN extends SectionName,
  TBase extends GConstructor<FullSectionBaseI<SN>>
>(Base: TBase): GConstructor<SelfAndChildRemoverI<SN>> & TBase {
  return class SelfAndChildRemover
    extends Base
    implements SelfAndChildRemoverI<SN>
  {
    removeSelf(): void {
      this.removeSection(this.feInfo);
    }
    wipeChildren(childName: ChildName<SN>): void {
      this.wipeSectionChildren(this.feInfo, childName);
    }
    removeChild({ sectionName, feId }: FeChildInfo<SN>): void {
      this.removeSection(InfoS.fe(sectionName, feId));
    }
    private wipeSectionChildren<S extends SectionName>(
      feInfo: FeInfo<S>,
      childName: ChildName<S>
    ): void {
      const section = this.sections.section(feInfo);
      const childIds = section.childFeIds(childName);
      for (const id of childIds) {
        this.removeSection(InfoS.fe(childName, id));
      }
    }
    private removeSection(feInfo: FeInfo) {
      const section = this.sections.section(feInfo);
      const { parentInfo } = section;
      this.removeSectionFromList(feInfo);
      if (InfoS.is.fe(parentInfo)) {
        this.removeChildId(parentInfo, feInfo as any);
      }
    }
    private removeSectionFromList({ sectionName, id }: FeInfo): void {
      const nextSections = this.sections.updateList(
        this.sections.list(sectionName).removeByFeId(id)
      );
      this.setSections(nextSections);
    }
    private removeChildId<S extends SectionName>(
      feInfo: FeInfo<S>,
      childInfo: ChildFeInfo<S>
    ): void {
      const nextSections = this.sections.updateSection(
        this.sections.one(feInfo).removeChildFeId({
          feId: childInfo.id,
          sectionName: childInfo.sectionName,
        })
      );
      this.setSections(nextSections);
    }
    private setSections(sections: FeSections) {
      this.shared.sections = sections;
    }
  };
}
