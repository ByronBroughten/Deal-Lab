import { SectionName } from "../SectionsMeta/SectionName";
import { FeSectionI } from "../SectionsState/FeSection";
import { Arr } from "../utils/Arr";
import {
  GetterList,
  GetterListBase,
  GetterListProps,
} from "./../StateGetters/GetterList";
import { UpdaterSections } from "./UpdaterSections";

export class UpdaterList<SN extends SectionName> extends GetterListBase<SN> {
  private getterList: GetterList<SN>;
  private updaterSections: UpdaterSections;
  constructor(props: GetterListProps<SN>) {
    super(props);
    this.getterList = new GetterList(props);
    this.updaterSections = new UpdaterSections(props.shared);
  }
  private get stateList() {
    return this.getterList.stateList;
  }
  push(section: FeSectionI<SN>): void {
    return this.update([...this.stateList, section]);
  }
  insert({ section, idx }: { section: FeSectionI<SN>; idx: number }): void {
    return this.update(Arr.insert(this.stateList, section, idx));
  }
  replace(section: FeSectionI<SN>): void {
    const idx = this.getterList.idx(section.feId);
    return this.update(Arr.replaceAtIdxClone(this.stateList, section, idx));
  }
  removeByFeId(feId: string): void {
    const idx = this.getterList.idx(feId);
    return this.update(Arr.removeAtIndexClone(this.stateList, idx));
  }
  updaterList<S extends SectionName>(sectionName: S): UpdaterList<S> {
    return new UpdaterList({
      sectionName,
      shared: this.shared,
    });
  }
  private update(stateList: FeSectionI<SN>[]): void {
    this.updaterSections.updateLists({
      [this.sectionName]: stateList,
    });
  }
}
