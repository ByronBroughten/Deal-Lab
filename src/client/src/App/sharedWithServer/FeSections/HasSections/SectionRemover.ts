import { FeInfo, InfoS } from "../../SectionMetas/Info";
import {
  ChildFeInfo,
  ChildName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { HasSharableSections } from "./Sections";

export class SectionRemover extends HasSharableSections {
  wipeChildren<SN extends SectionName>(
    feInfo: FeInfo<SN>,
    childName: ChildName<SN>
  ): void {
    const section = this.sections.section(feInfo);
    const childIds = section.childFeIds(childName);
    for (const id of childIds) {
      this.removeSection(InfoS.fe(childName, id));
    }
  }
  removeSection(feInfo: FeInfo<"hasParent">) {
    const section = this.sections.section(feInfo);
    const { parentInfo } = section;
    this.removeSectionFromList(feInfo);
    this.removeChildId(parentInfo, feInfo);
  }
  private removeSectionFromList({ sectionName, id }: FeInfo): void {
    this.sections = this.sections.updateList(
      this.sections.list(sectionName).removeByFeId(id)
    );
  }
  private removeChildId<SN extends SectionName>(
    feInfo: FeInfo<SN>,
    childInfo: ChildFeInfo<SN>
  ): void {
    this.sections = this.sections.updateSection(
      this.sections.section(feInfo).removeChildFeId(childInfo)
    );
  }
}
