import Analyzer from "../../../Analyzer";
import { sectionMetas } from "../../SectionMetas";
import {
  FeParentInfo,
  ParentFinder,
  ParentName,
  SectionParentFinder,
} from "../../SectionMetas/relNameArrs/ParentTypes";
import { SectionFinder } from "../../SectionMetas/relSections/baseSectionTypes";
import { SpecificSectionInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionNam, SectionName } from "../../SectionMetas/SectionName";
import StateSection from "../../StateSection";

// export function parent<S extends SectionName<"alwaysOneHasParent">>(finder: S): StateSection<ParentName<S>>;
export function parent<S extends SectionName<"hasOneParent">>(
  finder: S
): StateSection<ParentName<S>>;
export function parent<I extends SpecificSectionInfo<SectionName<"hasParent">>>(
  finder: I
): StateSection<ParentName<I["sectionName"]>>;
export function parent<
  S extends SectionName<"hasOneParent">,
  I extends SpecificSectionInfo<SectionName<"hasParent">>
>(finder: S | I): StateSection<S | ParentName<I["sectionName"]>>;
export function parent<S extends SectionName<"hasParent">>(
  this: Analyzer,
  finder: SectionParentFinder<S>
): StateSection<ParentName<S>> {
  if (SectionNam.is(finder, "hasOneParent")) {
    const parentName = this.meta.parentName(finder);
    return this.section(parentName as any) as StateSection<ParentName<S>>;
  } else {
    const { parentInfo } = this.section(finder);
    return this.section(parentInfo as any) as StateSection<ParentName<S>>;
  }
}

export function parentFinderToInfo<SN extends SectionName>(
  this: Analyzer,
  _sectionName: SN,
  parentFinder: ParentFinder<SN>
): FeParentInfo<SN> {
  if (typeof parentFinder !== "string") return parentFinder;
  const { feInfo } = this.section(parentFinder);
  return feInfo as FeParentInfo<SN>;
}
