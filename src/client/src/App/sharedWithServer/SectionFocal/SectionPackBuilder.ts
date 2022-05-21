import { GConstructor } from "../../utils/classObjects";
import { UpdaterSections } from "../Sections/UpdaterSections";
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
import {
  ApplySectionPackMakersNext,
  SectionPackMakerINext,
} from "./SectionPackMaker";
import { SectionSelfGettersProps } from "./SectionSelfGetters";

interface SectionPackBuilderNextMixins<SN extends SectionName>
  extends DescendantAdderI<SN>,
    SectionPackMakerINext<SN> {}

interface SectionPackBuilderINext<SN extends SectionName>
  extends SectionPackBuilderNextMixins<SN> {
  addAndGetDescendant<DN extends DescendantName<SN>>(
    descendantList: DescendantList<SN, DN>,
    options: AddDescendantOptions<SN, DN>
  ): SectionPackBuilderINext<DN>;
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options: AddChildOptions<SN, CN>
  ): SectionPackBuilderINext<CN>;
}

function MakeSectionPackBuilderNext<
  SN extends SectionName,
  TBase extends GConstructor<SectionPackBuilderNextMixins<SN>>
>(Base: TBase): GConstructor<SectionPackBuilderINext<SN>> & TBase {
  return class SectionPackBuilderNext
    extends Base
    implements SectionPackBuilderINext<SN>
  {
    private sections = new UpdaterSections(this.shared);
    addAndGetDescendant<DN extends DescendantName<SN>>(
      descendantList: DescendantList<SN, DN>,
      options: AddDescendantOptions<SN, DN>
    ): SectionPackBuilderINext<DN> {
      this.addDescendant(descendantList, options);
      const descendantName = Arr.lastOrThrow(descendantList) as DN;
      return this.newSectionBuilder(descendantName);
    }
    addAndGetChild<CN extends ChildName<SN>>(
      childName: CN,
      options: AddChildOptions<SN, CN>
    ): SectionPackBuilderINext<CN> {
      this.addChild(childName, options);
      return this.newSectionBuilder(childName);
    }
    private newSectionBuilder<S extends SectionName>(
      sectionName: S
    ): SectionPackBuilderINext<S> {
      const { info } = this.sections.list(sectionName).last;
      return this.sectionBuilder(info);
    }
    private sectionBuilder<S extends SectionName>(
      info: FeSectionInfo<S>
    ): SectionPackBuilderINext<S> {
      return new SectionPackBuilderNext({
        shared: this.shared,
        ...info,
      } as SectionSelfGettersProps<S>) as any as SectionPackBuilderINext<S>;
    }
  };
}

const HasSectionPackMakers = ApplySectionPackMakersNext(DescendantAdder);
export const SectionPackBuilder =
  MakeSectionPackBuilderNext(HasSectionPackMakers);
