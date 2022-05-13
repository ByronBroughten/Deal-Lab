import { FeSectionInfo } from "../../SectionMetas/Info";
import { ChildName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { DescendantAdderI } from "./DescendantAdder";
import { SectionAccessor } from "./SectionAccessor";
import { SectionPackMakerI } from "./SectionPackMaker";

interface FullSectionMixins<SN extends SectionName>
  extends DescendantAdderI<SN>,
    SectionPackMakerI<SN> {}

interface FullSectionI<SN extends SectionName> {
  lastChild<CN extends ChildName<SN>>(childName: CN): FullSectionI<CN>;
  child<CN extends ChildName<SN>>(
    childInfo: FeSectionInfo<CN>
  ): FullSectionI<CN>;
}

function MakeFullSection() {
  return class FullSection<SN extends SectionName> extends SectionAccessor<SN> {
    lastChild<CN extends ChildName<SN>>(childName: CN): FullSection<CN> {
      return this.child(this.childList(childName).last.info);
    }
    child<CN extends ChildName<SN>>(
      childInfo: FeSectionInfo<CN>
    ): FullSection<CN> {
      return this.fullSection(childInfo);
    }
    private fullSection<IN extends SectionName>(
      info: FeSectionInfo<IN>
    ): FullSection<IN> {
      return new FullSection({
        shared: this.shared,
        ...info,
      });
    }
  };
}
