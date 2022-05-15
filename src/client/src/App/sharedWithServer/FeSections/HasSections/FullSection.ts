import { GConstructor } from "../../../utils/classObjects";
import { HasFocalSectionProps } from "../../SectionFocal/HasFocalSectionProps";
import { FeInfoByType } from "../../SectionsMeta/Info";
import { FeVarbInfo } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  ChildName,
  DescendantIds,
  DescendantName,
  SelfOrDescendantName,
} from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { Obj } from "../../utils/Obj";
import { DescendantAdderI, DescendantAdderNext } from "./DescendantAdder";
import {
  ApplySectionPackLoader,
  SectionPackLoaderI,
} from "./SectionPackLoader";
import { ApplySectionPackMakers, SectionPackMakerI } from "./SectionPackMaker";
import {
  ApplySelfAndChildRemover,
  SelfAndChildRemoverI,
} from "./SelfAndChildRemover";

interface FullSectionMixins<SN extends SectionName>
  extends DescendantAdderI<SN>,
    SectionPackMakerI<SN>,
    SelfAndChildRemoverI<SN>,
    SectionPackLoaderI<SN> {}

export interface FullSectionI<SN extends SectionName>
  extends FullSectionMixins<SN> {
  lastChild<CN extends ChildName<SN>>(childName: CN): FullSectionI<CN>;
  child<CN extends ChildName<SN>>(
    childInfo: FeInfoByType<CN>
  ): FullSectionI<CN>;
  get descendantVarbInfos(): FeVarbInfo<DescendantName<SN>>[];
  get selfAndDescendantVarbInfos(): FeVarbInfo<SelfOrDescendantName<SN>>[];
}

const HasSectionPackMakers = ApplySectionPackMakers(DescendantAdderNext);
const HasSectionRemovers = ApplySelfAndChildRemover(HasSectionPackMakers);
const HasSectionPackLoader = ApplySectionPackLoader(HasSectionRemovers);
export const FullSection = MakeFullSection(HasSectionPackLoader);

function MakeFullSection<
  SN extends SectionName,
  TBase extends GConstructor<FullSectionMixins<SN>>
>(Base: TBase): GConstructor<FullSectionI<SN>> & TBase {
  return class FullSection extends Base implements FullSectionI<SN> {
    lastChild<CN extends ChildName<SN>>(childName: CN): FullSectionI<CN> {
      const lastChildInfo = this.childList(childName).last.info;
      return this.newFocalPoint(lastChildInfo);
    }
    child<CN extends ChildName<SN>>(
      childInfo: FeInfoByType<CN>
    ): FullSectionI<CN> {
      return this.newFocalPoint(childInfo);
    }
    get descendantVarbInfos(): FeVarbInfo<DescendantName<SN>>[] {
      const descendantVarbInfos = Obj.entries(this.descendantFeIds).reduce(
        (varbInfos, [sectionName, feIds]) => {
          for (const feId of feIds) {
            const varbs = this.sections.varbs({ sectionName, feId });
            varbInfos.push(...varbs.infos);
          }
          return varbInfos;
        },
        [] as FeVarbInfo[]
      );
      return descendantVarbInfos as FeVarbInfo<DescendantName<SN>>[];
    }
    get selfAndDescendantVarbInfos(): FeVarbInfo<SelfOrDescendantName<SN>>[] {
      return [...this.varbs.infos, ...this.descendantVarbInfos] as FeVarbInfo<
        SelfOrDescendantName<SN>
      >[];
    }

    private get descendantFeIds(): DescendantIds<SN> {
      return this.sections.descendantFeIds(this.feInfo);
    }
    private newFocalPoint<S extends SectionName>(
      info: FeInfoByType<S>
    ): FullSectionI<S> {
      return new FullSection({
        shared: this.shared,
        ...info,
      } as HasFocalSectionProps<SN>) as any as FullSectionI<S>;
    }
  };
}

// export class FullSection<SN extends SectionName> extends HasSectionPackLoader {
//   constructor(props: FullSectionConstructorProps<SN>) {
//     super(props as any);
//   }
//   lastChild<CN extends ChildName<SN>>(childName: CN): FullSectionI<CN> {
//     return this.child(this.sections.list(childName).last.info);
//   }
//   child<CN extends ChildName<SN>>(
//     childInfo: FeInfoByType<CN>
//   ): FullSectionI<CN> {
//     return this.newFocalPoint(childInfo);
//   }
//   private newFocalPoint<S extends SectionName>(
//     info: FeInfoByType<S>
//   ): FullSectionI<S> {
//     return new FullSection({
//       shared: this.shared,
//       ...info,
//     } as HasFocalSectionProps<SN>) as any as FullSectionI<S>;
//   }
// }
