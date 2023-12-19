import { RawFeSection } from "../../State/StateSectionsTypes";
import { GetterListBase } from "../../StateGetters/Bases/GetterListBase";
import { GetterList } from "../../StateGetters/GetterList";
import { SectionName } from "../../sectionVarbsConfig/SectionName";
import { Arr } from "../../utils/Arr";
import { UpdaterSection } from "./UpdaterSection";
import { UpdaterSections } from "./UpdaterSections";

export class UpdaterList<SN extends SectionName> extends GetterListBase<SN> {
  private get updaterSections() {
    return new UpdaterSections(this.getterSectionsProps);
  }
  private get raw(): RawFeSection<SN>[] {
    return this.sectionsShare.sections.rawSectionList(this.sectionName);
  }
  get get() {
    return new GetterList(this.getterListProps);
  }
  updaterSection(feId: string): UpdaterSection<SN> {
    return new UpdaterSection({
      ...this.getterListProps,
      feId,
    });
  }
  get last(): UpdaterSection<SN> {
    return this.updaterSection(this.get.last.feId);
  }
  push(section: RawFeSection<SN>): void {
    return this.update([...this.raw, section]);
  }
  replace(section: RawFeSection<SN>): void {
    const idx = this.get.idx(section.feId);
    return this.update(Arr.replaceAtIdxClone(this.raw, section, idx));
  }
  removeByFeId(feId: string): void {
    const idx = this.get.idx(feId);
    return this.update(Arr.removeAtIndexClone(this.raw, idx));
  }
  updaterList<S extends SectionName>(sectionName: S): UpdaterList<S> {
    return new UpdaterList({
      ...this.getterSectionsProps,
      sectionName,
    });
  }
  private update(raw: RawFeSection<SN>[]): void {
    this.updaterSections.updateLists({
      [this.sectionName]: raw,
    });
  }
}
