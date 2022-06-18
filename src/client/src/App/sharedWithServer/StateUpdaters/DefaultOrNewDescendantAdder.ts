import { defaultMaker } from "../defaultMaker/defaultMaker";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { PackLoaderSection } from "../StatePackers.ts/PackLoaderSection";
import { AddChildOptions, UpdaterSection } from "./UpdaterSection";

export class DefaultOrNewChildAdder<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  private updater = new UpdaterSection(this.getterSectionProps);
  private loader = new PackLoaderSection(this.getterSectionProps);
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<CN>
  ): void {
    if (defaultMaker.has(childName)) {
      const sectionPack = defaultMaker.make(childName);
      this.loader.loadChildSectionPack(sectionPack);
    } else {
      this.updater.addChild(childName, options);
    }
  }
  private get parent(): DefaultOrNewChildAdder<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.updater.get;
    return this.newAdder(parentInfoSafe);
  }
  addSibling(options?: AddChildOptions<SN>): void {
    this.parent.addChild(this.sectionName as any, options);
  }
  newAdder<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): DefaultOrNewChildAdder<SN> {
    return new DefaultOrNewChildAdder({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
}
