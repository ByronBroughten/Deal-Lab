import { FeInfo, InfoS } from "../../SectionMetas/Info";
import {
  ChildFeInfo,
  ChildName,
  FeChildInfo,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { SectionAccessor } from "./SectionAccessor";

export class SelfAndChildRemover<
  SN extends SectionName
> extends SectionAccessor<SN> {
  removeSelf() {
    this.removeSection(this.feInfo);
  }
  wipeChildren(childName: ChildName<SN>) {
    this.wipeSectionChildren(this.feInfo, childName);
  }
  removeChild({ sectionName, feId }: FeChildInfo<SN>) {
    this.removeSection(InfoS.fe(sectionName, feId));
  }
  protected wipeSectionChildren<S extends SectionName>(
    feInfo: FeInfo<S>,
    childName: ChildName<S>
  ): void {
    const section = this.sections.section(feInfo);
    const childIds = section.childFeIds(childName);
    for (const id of childIds) {
      this.removeSection(InfoS.fe(childName, id));
    }
  }
  protected removeSection(feInfo: FeInfo) {
    const section = this.sections.section(feInfo);
    const { parentInfo } = section;
    this.removeSectionFromList(feInfo);
    if (InfoS.is.fe(parentInfo)) {
      this.removeChildId(parentInfo, feInfo as any);
    }
  }
  private removeSectionFromList({ sectionName, id }: FeInfo): void {
    this.sections = this.sections.updateList(
      this.sections.list(sectionName).removeByFeId(id)
    );
  }
  private removeChildId<S extends SectionName>(
    feInfo: FeInfo<S>,
    childInfo: ChildFeInfo<S>
  ): void {
    this.sections = this.sections.updateSection(
      this.sections.one(feInfo).removeChildFeId({
        feId: childInfo.id,
        sectionName: childInfo.sectionName,
      })
    );
  }
}
