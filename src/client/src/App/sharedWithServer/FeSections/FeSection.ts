import { GConstructor } from "../../utils/classObjects";
import {
  ChildName,
  NewChildInfo,
} from "../SectionMetas/relSectionTypes/ChildTypes";
import {
  FeSectionNameType,
  SectionName,
  sectionNameS,
} from "../SectionMetas/SectionName";
import { Arr } from "../utils/Arr";
import {
  ChildIdGetterNext,
  IChildIdGetterNext,
} from "./FeSection/ChildIdGetter";
import {
  FeSectionCore,
  initFeSectionCore,
  InitFeSectionCoreProps,
} from "./FeSection/FeSectionCore";
import {
  ApplySectionGetters,
  FeSectionGettersI,
} from "./FeSection/FeSectionGetters";
import { HasFeSectionProps } from "./FeSection/HasFeSectionProps";
import { ApplySectionInfoGetters } from "./HasSectionInfoProps";

export interface FeSectionI<SN extends SectionName> extends TopMixins<SN> {
  addChildFeId({ idx, ...childInfo }: NewChildInfo<SN>): FeSectionI<SN>;
  removeChildFeId({ sectionName, feId }: NewChildInfo<SN>): FeSectionI<SN>;
}
function FeSectionMaker<
  SN extends SectionName,
  TBase extends TopMixinsConstructor<SN>
>(Base: TBase): FullClass<SN> {
  return class FeSection extends Base implements FeSectionI<SN> {
    addChildFeId({ idx, ...childInfo }: NewChildInfo<SN>): FeSection {
      if (typeof idx === "number")
        return this.insertChildFeId({ ...childInfo, idx });
      else return this.pushChildFeId(childInfo);
    }
    removeChildFeId({ sectionName, feId }: NewChildInfo<SN>): FeSection {
      const nextIds = Arr.findAndRmClone(
        this.childFeIds(sectionName),
        (childId) => childId === feId
      );
      return this.update({
        childFeIds: {
          ...this.core.childFeIds,
          [sectionName]: nextIds,
        },
      });
    }

    private insertChildFeId({
      sectionName,
      feId,
      idx,
    }: NewChildInfo<SN> & { idx: number }): FeSection {
      const nextIds = Arr.insert(this.childFeIds(sectionName), feId, idx);
      return this.updateChildFeIdArr(sectionName, nextIds);
    }
    private pushChildFeId({ sectionName, feId }: NewChildInfo<SN>): FeSection {
      let nextIds = [...this.childFeIds(sectionName), feId];
      return this.updateChildFeIdArr(sectionName, nextIds);
    }
    private updateChildFeIdArr(
      sectionName: ChildName<SN>,
      nextIds: string[]
    ): FeSection {
      return this.update({
        childFeIds: {
          ...this.core.childFeIds,
          [sectionName]: nextIds,
        },
      });
    }
    private update(nextBaseProps: Partial<FeSectionCore<SN>>): FeSection {
      return new FeSection({ ...this.core, ...nextBaseProps });
    }
    static is<ST extends FeSectionNameType = "all">(
      value: any,
      sectionType?: ST
    ): value is FeSectionI<SectionName<ST>> {
      if (!(value instanceof FeSection)) return false;
      return sectionNameS.is(value.sectionName, (sectionType ?? "all") as ST);
    }
    static initNext<S extends SectionName>(
      props: InitFeSectionCoreProps<S>
    ): FeSectionI<S> {
      const core = initFeSectionCore(props);
      return new FeSection(core) as any as FeSectionI<S>;
    }
  };
}

interface TopMixins<SN extends SectionName>
  extends IChildIdGetterNext<SN>,
    FeSectionGettersI<SN> {}

interface IFeSectionStatics {
  is<ST extends FeSectionNameType = "all">(
    value: any,
    sectionType?: ST
  ): value is FeSectionI<SectionName<ST>>;
  initNext<SN extends SectionName>(
    props: InitFeSectionCoreProps<SN>
  ): FeSectionI<SN>;
}

type TopMixinsConstructor<SN extends SectionName> = GConstructor<TopMixins<SN>>;
interface FullClass<SN extends SectionName>
  extends GConstructor<FeSectionI<SN>>,
    IFeSectionStatics {}

const HasSectionInfoGetters = ApplySectionInfoGetters(HasFeSectionProps);
const HasSectionGetters = ApplySectionGetters(HasSectionInfoGetters);
const HasChildIdGetters = ChildIdGetterNext(HasSectionGetters);
export const FeSection = FeSectionMaker(HasChildIdGetters);
