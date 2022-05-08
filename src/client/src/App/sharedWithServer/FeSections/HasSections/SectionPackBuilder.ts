import { applyMixins } from "../../../utils/classObjects";
import { FeSectionInfo } from "../../SectionMetas/Info";
import {
  ChildName,
  DescendantName
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import Arr from "../../utils/Arr";
import {
  AddChildOptions,
  AddDescendantOptions,
  DescendantAdder,
  DescendantList
} from "./DescendantAdder";
import { HasFullSectionProps } from "./FullSection";
import { SectionPackLoader } from "./SectionPackLoader";
import { SectionPackMaker } from "./SectionPackMaker";

export class SectionPackBuilder<
  SN extends SectionName
> extends HasFullSectionProps<SN> {
  addAndGetDescendant<DN extends DescendantName<SN>>(
    descendantList: DescendantList<SN, DN>,
    options: AddDescendantOptions<SN, DN>
  ): SectionPackBuilder<DN> {
    this.addDescendant(descendantList, options);
    const descendantName = Arr.lastVal(descendantList) as DN;
    return this.newSectionBuilder(descendantName);
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options: AddChildOptions<SN, CN>
  ): SectionPackBuilder<CN> {
    this.addChild(childName, options);
    return this.newSectionBuilder(childName);
  }
  private newSectionBuilder<SN extends SectionName>(
    sectionName: SN
  ): SectionPackBuilder<SN> {
    const { info } = this.sectionList(sectionName).last;
    return this.newBuilder(info);
  }
  private newBuilder<SN extends SectionName>(
    info: FeSectionInfo<SN>
  ): SectionPackBuilder<SN> {
    return new SectionPackBuilder({
      sections: this.sections,
      ...info,
    }) as SectionPackBuilder<SN>;
  }
}
export interface SectionPackBuilder<SN extends SectionName>
  extends DescendantAdder<SN>,
    SectionPackMaker<SN> {}

applyMixins(SectionPackLoader, [DescendantAdder, SectionPackMaker]);
