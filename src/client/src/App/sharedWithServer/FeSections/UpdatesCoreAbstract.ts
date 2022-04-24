import { sectionMetas } from "../SectionMetas";
import { SimpleSectionName } from "../SectionMetas/baseSections";
import { SelfOrDescendantName } from "../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName, SectionNameType } from "../SectionMetas/SectionName";
import { FeSectionList, FeSectionListRaw } from "./FeSectionList";

export type FeSectionsCore<SN extends SimpleSectionName> = {
  [S in SelfOrDescendantName<SN>]: FeSectionList<S>;
};

type SectionPackName<
  SN extends SimpleSectionName,
  ST extends SectionNameType = "all"
> = Extract<SectionName<ST>, SelfOrDescendantName<SN>>;

export class FeSectionsBase<SN extends SimpleSectionName> {
  constructor(readonly core: FeSectionsCore<SN>) {}

  get meta() {
    return sectionMetas;
  }

  list<SD extends SelfOrDescendantName<SN>>(
    sectionName: SD
  ): FeSectionList<SD> {
    return this.core[sectionName];
  }

  // section<
  //   SD extends SelfOrDescendantName<SN>,
  //   SF extends NextSectionFinder<SD>
  // >(finder: SF): FeSection<SD> {
  //   if (sectionNameS.is(finder, "alwaysOne")) {
  //     return this.list(finder as SD).first as FeSection<SD>;
  //   } else {
  //     const { sectionName, ...idInfo } = finder as SpecificSectionInfo<SD>;
  //     return this.list(sectionName).getSpecific(idInfo);
  //   }
  // }

  // parent<SD extends DescendantName<SN>, PF extends SectionParentFinder<SD>>(
  //   finder: PF
  // ): FeSection<ParentName<SD>> {
  //   if (sectionNameS.is(finder, "hasOneParent")) {
  //     const parentName = this.meta.parentName(finder);
  //     return this.section(parentName) as FeSection<ParentName<SD>>;
  //   } else {
  //     const { parentInfo } = this.section(finder);
  //     return this.section(parentInfo) as FeSection<ParentName<SD>>;
  //   }
  // }

  // parentFinderToInfo<SD extends DescendantName<SN>>(
  //   parentFinder: ParentFinder<SD>,
  //   _sectionName?: SN
  // ): FeaParentInfo<SD> {
  //   const num: number = "string";

  //   if (typeof parentFinder !== "string") return parentFinder;
  //   const { feInfo } = this.section(parentFinder);
  //   return feInfo as FeParentInfo<SD>;
  // }
}

export abstract class UpdatesCoreAbstract<
  SN extends SimpleSectionName,
  ReturnClass
> extends FeSectionsBase<SN> {
  abstract update(partial: Partial<FeSectionsCore<SN>>): ReturnClass;
}

export type RawCore<SN extends SimpleSectionName> = {
  [S in SelfOrDescendantName<SN>]: FeSectionListRaw<SN>;
};
