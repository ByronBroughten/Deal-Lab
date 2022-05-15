import { GConstructor } from "../../../utils/classObjects";
import { FullSectionConstructorProps } from "../../SectionFocal/HasFocalSectionProps";
import { FeInfoByType } from "../../SectionsMeta/Info";
import {
  ChildName,
  DescendantName,
} from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { Arr } from "../../utils/Arr";
import {
  AddChildOptions,
  AddDescendantOptions,
  DescendantAdderI,
  DescendantAdderNext,
  DescendantList,
} from "./DescendantAdder";
import { ApplySectionPackMakers, SectionPackMakerI } from "./SectionPackMaker";

interface SectionPackBuilderI<SN extends SectionName>
  extends SectionPackBuilderMixins<SN> {
  addAndGetDescendant<DN extends DescendantName<SN>>(
    descendantList: DescendantList<SN, DN>,
    options: AddDescendantOptions<SN, DN>
  ): SectionPackBuilderI<DN>;
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options: AddChildOptions<SN, CN>
  ): SectionPackBuilderI<CN>;
}

// try making the new sectionPack builder and testing it.
function MakeSectionPackBuilder<
  SN extends SectionName,
  TBase extends GConstructor<SectionPackBuilderMixins<SN>>
>(Base: TBase): GConstructor<SectionPackBuilderI<SN>> & TBase {
  return class SectionPackBuilder
    extends Base
    implements SectionPackBuilderI<SN>
  {
    addAndGetDescendant<DN extends DescendantName<SN>>(
      descendantList: DescendantList<SN, DN>,
      options: AddDescendantOptions<SN, DN>
    ): SectionPackBuilderI<DN> {
      this.addDescendant(descendantList, options);
      const descendantName = Arr.lastOrThrow(descendantList) as DN;
      return this.newSectionBuilder(descendantName);
    }
    addAndGetChild<CN extends ChildName<SN>>(
      childName: CN,
      options: AddChildOptions<SN, CN>
    ): SectionPackBuilderI<CN> {
      this.addChild(childName, options);
      return this.newSectionBuilder(childName);
    }
    private newSectionBuilder<S extends SectionName>(
      sectionName: S
    ): SectionPackBuilderI<S> {
      const { info } = this.sections.list(sectionName).last;
      return this.newBuilder(info);
    }
    private newBuilder<S extends SectionName>(
      info: FeInfoByType<S>
    ): SectionPackBuilderI<S> {
      // if I want the sections to transfer, I must pass the core, not the sections
      return new SectionPackBuilder({
        shared: this.shared,
        ...info,
      } as FullSectionConstructorProps<S>) as any as SectionPackBuilderI<S>;
    }
  };
}

interface SectionPackBuilderMixins<SN extends SectionName>
  extends DescendantAdderI<SN>,
    SectionPackMakerI<SN> {}

const HasSectionPackMaker = ApplySectionPackMakers(DescendantAdderNext);
export const SectionPackBuilder = MakeSectionPackBuilder(HasSectionPackMaker);
