import { defaultMaker } from "../defaultMaker/defaultMaker";
import { ChildName } from "../SectionsMeta/childSectionsDerived/ChildName";
import { ParentNameSafe } from "../SectionsMeta/childSectionsDerived/ParentName";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { PackLoaderSection } from "../StatePackers.ts/PackLoaderSection";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { AddChildOptions, UpdaterSection } from "./UpdaterSection";

export class DefaultFamilyAdder<
  SN extends SectionName
> extends UpdaterSectionBase<SN> {
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  get loader(): PackLoaderSection<SN> {
    return new PackLoaderSection(this.getterSectionProps);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    const sectionName = this.get.meta.childType(childName);
    if (defaultMaker.has(sectionName)) {
      const sectionPack = defaultMaker.makeSectionPack(sectionName);
      this.loader.loadChildSectionPack({
        childName,
        sectionPack,
      });
    } else {
      this.updater.addChild(childName, options);
    }
  }
  private get parent(): DefaultFamilyAdder<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.newAdder(parentInfoSafe);
  }
  addSibling(options?: AddChildOptions<SN>): void {
    this.parent.addChild(this.sectionName as any, options);
  }
  newAdder<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): DefaultFamilyAdder<SN> {
    return new DefaultFamilyAdder({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
}
