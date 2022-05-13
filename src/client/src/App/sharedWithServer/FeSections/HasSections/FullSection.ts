import { FeSectionInfo } from "../../SectionMetas/Info";
import { ChildName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { DescendantAdderI, DescendantAdderNext } from "./DescendantAdder";
import {
  FullSectionsContructorProps,
  HasFullSectionProps,
} from "./HasFullSectionProps";
import { ApplySectionPackMakers, SectionPackMakerI } from "./SectionPackMaker";

interface FullSectionMixins<SN extends SectionName>
  extends DescendantAdderI<SN>,
    SectionPackMakerI<SN> {}

interface FullSectionI<SN extends SectionName> extends FullSectionMixins<SN> {
  lastChild<CN extends ChildName<SN>>(childName: CN): FullSectionI<CN>;
  child<CN extends ChildName<SN>>(
    childInfo: FeSectionInfo<CN>
  ): FullSectionI<CN>;
}

const HasSectionPackMakers = ApplySectionPackMakers(DescendantAdderNext);
export class FullSection<SN extends SectionName> extends HasSectionPackMakers {
  constructor(props: FullSectionsContructorProps<SN>) {
    super(props as any);
  }
  lastChild<CN extends ChildName<SN>>(childName: CN): FullSectionI<CN> {
    return this.child(this.sections.list(childName).last.info);
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeSectionInfo<CN>
  ): FullSectionI<CN> {
    return this.fullSection(childInfo);
  }
  private get sections() {
    return this.shared.sections;
  }
  private fullSection<S extends SectionName>(
    info: FeSectionInfo<S>
  ): FullSectionI<S> {
    return new FullSection({
      shared: this.shared,
      ...info,
    } as HasFullSectionProps<SN>) as any as FullSectionI<S>;
  }
}

// function MakeFullSection<
//   SN extends SectionName,
//   TBase extends GConstructor<FullSectionMixins<SN>>
// >(Base: TBase): GConstructor<FullSectionI<SN>> {
//   return class FullSection extends Base implements FullSectionI<SN> {
//     lastChild<CN extends ChildName<SN>>(childName: CN): FullSectionI<CN> {
//       return this.child(this.sections.list(childName).last.info);
//     }
//     child<CN extends ChildName<SN>>(
//       childInfo: FeSectionInfo<CN>
//     ): FullSectionI<CN> {
//       return this.fullSection(childInfo);
//     }
//     private get sections() {
//       return this.shared.sections;
//     }
//     private fullSection<S extends SectionName>(
//       info: FeSectionInfo<S>
//     ): FullSectionI<S> {
//       return new FullSection({
//         shared: this.shared,
//         ...info,
//       } as HasFullSectionProps<SN>) as any as FullSectionI<S>;
//     }
//   };
// }
// export const FullSectionOld = MakeFullSection(HasSectionPackMakers);
