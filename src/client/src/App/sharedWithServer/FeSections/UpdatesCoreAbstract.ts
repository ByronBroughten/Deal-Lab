import { sectionMetas } from "../SectionMetas";
import { SimpleSectionName } from "../SectionMetas/baseSections";
import { SectionFinder } from "../SectionMetas/baseSectionTypes";
import { SpecificSectionInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  DescendantName,
  SelfOrDescendantName,
} from "../SectionMetas/relSectionTypes/ChildTypes";
import {
  FeParentInfo,
  ParentFinder,
  ParentName,
  SectionFinderForParent,
} from "../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName, SectionNameType } from "../SectionMetas/SectionName";
import { FeNameInfo } from "./../SectionMetas/relSections/rel/relVarbInfoTypes";
import { sectionNameS } from "./../SectionMetas/SectionName";
import FeSection from "./FeSection";
import { FeSectionListRaw, SectionList } from "./SectionList";

export type FeSectionLists<SN extends SimpleSectionName> = {
  [S in SelfOrDescendantName<SN>]: SectionList<S>;
};

export type FeSectionsCore<SN extends SimpleSectionName> = {
  sectionName: SN;
  sectionLists: FeSectionLists<SN>;
};

type SectionPackName<
  SN extends SimpleSectionName,
  ST extends SectionNameType = "all"
> = Extract<SectionName<ST>, SelfOrDescendantName<SN>>;

export class FeSectionsBase<SN extends SimpleSectionName = SimpleSectionName> {
  constructor(readonly core: FeSectionsCore<SN>) {}

  get sectionName() {
    return this.core.sectionName;
  }

  get meta() {
    return sectionMetas;
  }

  list<SD extends SelfOrDescendantName<SN>>(sectionName: SD): SectionList<SD> {
    return this.core.sectionLists[sectionName];
  }

  section<SD extends SelfOrDescendantName<SN>>(
    finder: Extract<SD, SectionName<"alwaysOne">> | SpecificSectionInfo<SD>
  ): FeSection<SD> {
    if (sectionNameS.is(finder, "alwaysOne")) {
      return this.list(finder as any).first as FeSection<SD>;
    } else {
      const { sectionName, ...idInfo } = finder as SpecificSectionInfo<SD>;
      return this.list(sectionName as any).getSpecific(idInfo) as FeSection<SD>;
    }
  }

  parent<SD extends DescendantName<SN>, PD = ParentName<SD>>(
    finder: SectionFinderForParent<SD>
  ): FeSection<PD & SimpleSectionName> {
    if (sectionNameS.is(finder, "hasOneParent")) {
      const parentName = this.meta.parentName(finder);
      return this.section(parentName as any) as FeSection<
        PD & SimpleSectionName
      >;
    } else {
      const { parentInfo } = this.section(finder as SectionFinder<SD>);
      return this.section(
        parentInfo as FeNameInfo<SelfOrDescendantName<SN>>
      ) as FeSection<PD & SimpleSectionName>;
    }
  }

  parentFinderToInfo<SD extends DescendantName<SN>>(
    parentFinder: ParentFinder<SD>,
    _sectionName?: SN
  ): FeParentInfo<SD> {
    if (sectionNameS.is(parentFinder, "alwaysOne")) {
      const { feInfo } = this.section(parentFinder as SectionFinder<SD>);
      return feInfo as FeParentInfo<SD>;
    }
    if (typeof parentFinder !== "string") {
      return parentFinder as FeParentInfo<SD>;
    }

    throw new Error(`invalid parentFinder: ${JSON.stringify(parentFinder)}`);
  }

  _test() {
    const _sectionTest1 = (
      this as any as FeSectionsBase<"propertyGeneral">
    ).section("propertyGeneral" as SectionFinder<"propertyGeneral">);
    _sectionTest1.childFeIds("property");
    const _sectionTest2 = this.section(
      "propertyGeneral" as SectionFinder<DescendantName<SN>>
    );

    const _parentTest1 = this.parent(
      "property" as SectionFinderForParent<DescendantName<SN>>
    );
    const _parentTest2 = (
      this as any as FeSectionsBase<"propertyGeneral">
    ).parent("property");
    _parentTest2.childFeIds("property");
  }
}

export abstract class UpdatesCoreAbstract<
  SN extends SimpleSectionName,
  ReturnClass
> extends FeSectionsBase<SN> {
  abstract updateList<LN extends SelfOrDescendantName<SN>>(
    listName: LN,
    nextList: SectionList<SelfOrDescendantName<SN>>
  ): ReturnClass;
  abstract updateLists(partial: Partial<FeSectionLists<SN>>): ReturnClass;
  abstract updateSection(
    nextSection: FeSection<SelfOrDescendantName<SN>>
  ): ReturnClass;
}

export type RawCore<SN extends SimpleSectionName> = {
  [S in SelfOrDescendantName<SN>]: FeSectionListRaw<SN>;
};

// section<SP extends SectionPackName<SN, "alwaysOne">>(
//   finder: SP
// ): FeSection<SP>;
// section<SP extends SectionPackName<SN>>(
//   finder: SpecificSectionInfo<SP>
// ): FeSection<SP>;
// section<SP extends SectionPackName<SN>>(
//   finder: SectionFinder<SP>
// ): FeSection<SP>;
// section<SP extends SectionPackName<SN>>(
//   finder: SectionFinder<SP>
// ): FeSection<SP> {
//   if (sectionNameS.is(finder, "alwaysOne")) {
//     return this.list(finder).first as FeSection<SP>;
//   } else {
//     const { sectionName, ...idInfo } = finder;
//     return this.list(sectionName).getSpecific(idInfo);
//   }
// }

// export function parent<S extends SectionName<"alwaysOneHasParent">>(finder: S): StateSection<ParentName<S>>;
// export function parent<S extends SectionName<"hasOneParent">>(
//   this: Analyzer,
//   finder: S
// ): StateSection<ParentName<S>>;
// export function parent<I extends SpecificSectionInfo<SectionName<"hasParent">>>(
//   this: Analyzer,
//   finder: I
// ): StateSection<ParentName<I["sectionName"]>>;
// export function parent<
//   S extends SectionName<"hasOneParent">,
//   I extends SpecificSectionInfo<SectionName<"hasParent">>
// >(
//   this: Analyzer,
//   finder: S | I
// ): StateSection<S | ParentName<I["sectionName"]>>;
// export function parent<S extends SectionName<"hasParent">>(
//   this: Analyzer,
//   finder: SectionFinderForParent<S>
// ): StateSection<ParentName<S>> {
//   if (sectionNameS.is(finder, "hasOneParent")) {
//     const parentName = this.meta.parentName(finder);
//     return this.section(parentName as any) as StateSection<ParentName<S>>;
//   } else {
//     const { parentInfo } = this.section(finder);
//     return this.section(parentInfo as any) as StateSection<ParentName<S>>;
//   }
// }

// export function parentFinderToInfo<SN extends SectionName = SectionName>(
//   this: Analyzer,
//   parentFinder: ParentFinder<SN>,
//   _sectionName?: SN
// ): FeParentInfo<SN> {
//   if (typeof parentFinder !== "string") return parentFinder;
//   const { feInfo } = this.section(parentFinder);
//   return feInfo as FeParentInfo<SN>;
// }
