import { SectionPackRaw } from "../Analyzer/SectionPackRaw";
import { FeSectionInfo } from "../SectionsMeta/Info";
import {
  ChildName,
  DescendantName,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { Arr } from "../utils/Arr";
import {
  AddChildOptions,
  AddDescendantOptions,
  DescendantAdder,
  DescendantAdderI,
  DescendantList,
} from "./DescendantAdder";
import { FocalSectionBase } from "./FocalSectionBase";
import { SectionPackLoader, SectionPackLoaderI } from "./SectionPackLoader";
import { SectionPackMaker, SectionPackMakerI } from "./SectionPackMaker";

export class SectionPackBuilder<
  SN extends SectionName = "main"
> extends FocalSectionBase<SN> {
  private adder = new DescendantAdder(
    this.self.constructorProps
  ) as DescendantAdderI<SN>;
  private loader = new SectionPackLoader(
    this.self.constructorProps
  ) as any as SectionPackLoaderI<SN>;
  private maker = new SectionPackMaker(
    this.self.constructorProps
  ) as any as SectionPackMakerI<SN>;
  makeSectionPack(): SectionPackRaw<SN> {
    return this.maker.makeSectionPack();
  }
  addAndGetDescendant<DN extends DescendantName<SN>>(
    descendantList: DescendantList<SN, DN>,
    options?: AddDescendantOptions<SN, DN>
  ): SectionPackBuilder<DN> {
    this.adder.addDescendant(descendantList, options);
    const descendantName = Arr.lastOrThrow(descendantList) as DN;
    return this.newSectionBuilder(descendantName);
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): SectionPackBuilder<CN> {
    this.addChild(childName, options);
    return this.newSectionBuilder(childName);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ) {
    this.adder.addChild(childName, options);
  }
  loadChild<CN extends ChildName<SN>>(childPack: SectionPackRaw<CN>) {
    this.loader.loadChildSectionPack(childPack);
  }
  private newSectionBuilder<S extends SectionName>(
    sectionName: S
  ): SectionPackBuilder<S> {
    const { feInfo } = this.getterSections.listNext(sectionName).last;
    return this.sectionBuilder(feInfo);
  }
  private sectionBuilder<S extends SectionName>(
    info: FeSectionInfo<S>
  ): SectionPackBuilder<S> {
    return new SectionPackBuilder({
      shared: this.shared,
      ...info,
    });
  }
}
