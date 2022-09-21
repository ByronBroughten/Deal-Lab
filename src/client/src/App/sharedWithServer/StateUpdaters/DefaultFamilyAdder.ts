import { defaultMaker } from "../defaultMaker/defaultMaker";
import { VarbValues } from "../SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { ChildName } from "../SectionsMeta/childSectionsDerived/ChildName";
import { ParentNameSafe } from "../SectionsMeta/childSectionsDerived/ParentName";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { PackLoaderSection } from "../StatePackers.ts/PackLoaderSection";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { AddChildOptions, UpdaterSection } from "./UpdaterSection";

export class DefaultFamilyAdder<
  SN extends SectionNameByType
> extends UpdaterSectionBase<SN> {
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  get loader(): PackLoaderSection<SN> {
    return new PackLoaderSection(this.getterSectionProps);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    { dbVarbs, ...rest }: AddChildOptions<SN, CN> = {}
  ): void {
    this.updater.addChild(childName, rest);
    const { sectionName, feInfo } = this.get.youngestChild(childName);
    if (defaultMaker.has(sectionName)) {
      const sectionPack = defaultMaker.makeSectionPack(sectionName);
      const childLoader = this.loader.packLoaderSection(feInfo);
      childLoader.loadSelfSectionPack(sectionPack as SectionPack<any>);
    }
    if (dbVarbs) {
      const childUpdater = this.updater.updaterSection(feInfo);
      childUpdater.updateValuesDirectly(dbVarbs as VarbValues);
    }
  }
  private get parent(): DefaultFamilyAdder<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.newAdder(parentInfoSafe);
  }
  newAdder<SN extends SectionNameByType>(
    feInfo: FeSectionInfo<SN>
  ): DefaultFamilyAdder<SN> {
    return new DefaultFamilyAdder({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
}
