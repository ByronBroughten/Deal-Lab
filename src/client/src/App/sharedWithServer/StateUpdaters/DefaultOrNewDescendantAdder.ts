import { defaultMaker } from "../Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultMaker";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
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
}
