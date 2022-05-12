import { applyMixins, GConstructor } from "../../../utils/classObjects";
import { FeSectionInfo } from "../../SectionMetas/Info";
import {
  ChildName,
  DescendantName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { Arr } from "../../utils/Arr";
import { ApplySectionInfoGetters } from "../HasSectionInfoProps";
import {
  AddChildOptions,
  AddDescendantOptions,
  ApplyDescendantAdder,
  DescendantAdder,
  DescendantAdderI,
  DescendantList,
} from "./DescendantAdder";
import { HasFullSectionProps } from "./HasFullSectionProps";
import { SectionPackLoader } from "./SectionPackLoader";
import {
  ApplySectionPackMakers,
  SectionPackMaker,
  SectionPackMakerI,
} from "./SectionPackMaker";
import { FeSections } from "./Sections";

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
  return class SectionPackBuilderNext
    extends Base
    implements SectionPackBuilderI<SN>
  {
    private get sections(): FeSections {
      return this.core.sections;
    }
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
      info: FeSectionInfo<S>
    ): SectionPackBuilderI<S> {
      // if I want the sections to transfer, I must pass the core, not the sections
      return new SectionPackBuilderNext({
        sections: this.sections,
        ...info,
      }) as any as SectionPackBuilderI<S>;
    }
  };
}

interface SectionPackBuilderMixins<SN extends SectionName>
  extends DescendantAdderI<SN>,
    SectionPackMakerI<SN> {}

const HasInfoGetters = ApplySectionInfoGetters(HasFullSectionProps);
const HasPackMaker = ApplySectionPackMakers(HasInfoGetters);
const HasDescendantAdder = ApplyDescendantAdder(HasPackMaker);
export const SectionPackBuilderNext =
  MakeSectionPackBuilder(HasDescendantAdder);

class SectionPackBuilder<SN extends SectionName> extends DescendantAdder<SN> {
  addAndGetDescendant<DN extends DescendantName<SN>>(
    descendantList: DescendantList<SN, DN>,
    options: AddDescendantOptions<SN, DN>
  ): SectionPackBuilder<DN> {
    this.addDescendant(descendantList, options);
    const descendantName = Arr.lastOrThrow(descendantList) as DN;
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
      shared: this.core,
      ...info,
    }) as SectionPackBuilder<SN>;
  }
}

interface SectionPackBuilder<SN extends SectionName>
  extends SectionPackMaker<SN> {}

applyMixins(SectionPackLoader, [SectionPackMaker]);

export { SectionPackBuilder };
