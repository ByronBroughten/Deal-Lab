import { defaultMaker } from "../Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultMaker";
import { SectionPackRaw } from "../Analyzer/SectionPackRaw";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { DescendantAdder, DescendantAdderI } from "./DescendantAdder";
import { FocalSectionBase } from "./FocalSectionBase";
import { SectionPackLoader, SectionPackLoaderI } from "./SectionPackLoader";

export class DefaultOrNewChildAdder<
  SN extends SectionName
> extends FocalSectionBase<SN> {
  private adder = new DescendantAdder(
    this.self.constructorProps
  ) as DescendantAdderI<SN>;
  private loader = new SectionPackLoader(
    this.self.constructorProps
  ) as any as SectionPackLoaderI<SN>;
  addChild<CN extends ChildName<SN>>(childName: CN): void {
    if (defaultMaker.has(childName)) {
      const sectionPack = defaultMaker.make(childName);
      this.loader.loadChildSectionPack(
        sectionPack as any as SectionPackRaw<CN>
      );
    } else {
      this.adder.addChild(childName);
    }
  }
}
