import { GConstructor } from "../../utils/classObjects";
import { UpdaterSections } from "../Sections/UpdaterSections";
import { FeSectionInfo, InfoS } from "../SectionsMeta/Info";
import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { FocalSectionBase } from "./FocalSectionBase";

export interface SelfAndChildRemoverI<SN extends SectionName>
  extends FocalSectionBase<SN> {
  sections: UpdaterSections;
  removeSelf(): void;
  wipeChildren(childName: ChildName<SN>): void;
  removeChild({ sectionName, feId }: FeChildInfo<SN>): void;
}

export function ApplySelfAndChildRemover<
  SN extends SectionName,
  TBase extends GConstructor<FocalSectionBase<SN>>
>(Base: TBase): GConstructor<SelfAndChildRemoverI<SN>> & TBase {
  return class SelfAndChildRemover
    extends Base
    implements SelfAndChildRemoverI<SN>
  {
    sections = new UpdaterSections(this.shared);
    removeSelf(): void {
      this.removeSection(this.self.feInfo);
    }
    wipeChildren(childName: ChildName<SN>): void {
      this.wipeSectionChildren(this.self.feInfo, childName);
    }
    removeChild(info: FeChildInfo<SN>): void {
      this.removeSection(info);
    }
    private wipeSectionChildren<S extends SectionName>(
      feInfo: FeSectionInfo<S>,
      childName: ChildName<S>
    ): void {
      const section = this.sections.section(feInfo);
      const childIds = section.childFeIds(childName);
      for (const feId of childIds) {
        this.removeSection({ sectionName: childName, feId });
      }
    }
    private removeSection(feInfo: FeSectionInfo) {
      const section = this.sections.section(feInfo);
      const { parentInfo } = section;
      this.removeSectionFromList(feInfo);
      if (InfoS.is.fe(parentInfo)) {
        this.removeChildId(parentInfo, feInfo as any);
      }
    }
    private removeSectionFromList({ sectionName, feId }: FeSectionInfo): void {
      const nextList = this.sections.list(sectionName).removeByFeId(feId);
      this.sections.updateList(nextList);
    }
    private removeChildId<S extends SectionName>(
      feInfo: FeSectionInfo<S>,
      childInfo: FeChildInfo<S>
    ): void {
      const nextSection = this.sections.one(feInfo).removeChildFeId(childInfo);
      this.sections.updateSection(nextSection);
    }
  };
}

export const SelfAndChildRemover = ApplySelfAndChildRemover(FocalSectionBase);
