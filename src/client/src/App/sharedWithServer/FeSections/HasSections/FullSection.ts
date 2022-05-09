import { applyMixins } from "../../../utils/classObjects";
import { FeSectionInfo } from "../../SectionMetas/Info";
import { ChildName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { DescendantAdder } from "./DescendantAdder";
import { SectionAccessor } from "./SectionAccessor";
import { SectionPackLoader } from "./SectionPackLoader";
import { SectionPackMaker } from "./SectionPackMaker";
import { SelfAndChildRemover } from "./SelfAndChildRemover";

export class FullSection<SN extends SectionName> extends SectionAccessor<SN> {
  protected get selfSection(): FeSection<SN> {
    return this.sections.one(this.feInfo);
  }
  protected fullSection<IN extends SectionName>(
    info: FeSectionInfo<IN>
  ): FullSection<IN> {
    return new FullSection({
      sections: this.sections,
      ...info,
    });
  }
  lastChild<CN extends ChildName<SN>>(childName: CN): FullSection<CN> {
    return this.child(this.childList(childName).last.info);
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeSectionInfo<CN>
  ): FullSection<CN> {
    return this.fullSection(childInfo);
  }
}

export interface FullSection<SN extends SectionName>
  extends SectionPackMaker<SN>,
    DescendantAdder<SN>,
    SelfAndChildRemover<SN>,
    SectionPackLoader<SN> {}

applyMixins(FullSection, [
  SectionPackMaker,
  DescendantAdder,
  SelfAndChildRemover,
  SectionPackLoader,
]);
