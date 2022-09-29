import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterListBase } from "../StateGetters/Bases/GetterListBase";
import { RawFeSection } from "../StateSections/StateSectionsTypes";
import { Arr } from "../utils/Arr";
import { GetterList } from "./../StateGetters/GetterList";
import { UpdaterSections } from "./UpdaterSections";

export class UpdaterList<
  SN extends SectionNameByType
> extends GetterListBase<SN> {
  private getterList = new GetterList(this.getterListProps);
  private updaterSections = new UpdaterSections(this.getterSectionsProps);

  private get raw(): RawFeSection<SN>[] {
    return this.sectionsShare.sections.rawSectionList(this.sectionName);
  }
  get get() {
    return this.getterList;
  }
  push(section: RawFeSection<SN>): void {
    return this.update([...this.raw, section]);
  }
  replace(section: RawFeSection<SN>): void {
    const idx = this.getterList.idx(section.feId);
    return this.update(Arr.replaceAtIdxClone(this.raw, section, idx));
  }
  removeByFeId(feId: string): void {
    const idx = this.getterList.idx(feId);
    return this.update(Arr.removeAtIndexClone(this.raw, idx));
  }
  updaterList<S extends SectionNameByType>(sectionName: S): UpdaterList<S> {
    return new UpdaterList({
      sectionName,
      sectionsShare: this.sectionsShare,
    });
  }
  private update(raw: RawFeSection<SN>[]): void {
    this.updaterSections.updateLists({
      [this.sectionName]: raw,
    });
  }
}
