import Analyzer from "../../../Analyzer";
import { SpecificSectionInfo } from "../../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  ParentFeInfo,
  ParentFinder,
  ParentName,
  SectionFinderForParent,
} from "../../../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName, sectionNameS } from "../../../SectionsMeta/SectionName";
import StateSection from "../../StateSection";

// export function parent<S extends SectionName<"alwaysOneHasParent">>(finder: S): StateSection<ParentName<S>>;
export function parent<S extends SectionName<"hasOneParent">>(
  this: Analyzer,
  finder: S
): StateSection<ParentName<S>>;
export function parent<I extends SpecificSectionInfo<SectionName<"hasParent">>>(
  this: Analyzer,
  finder: I
): StateSection<ParentName<I["sectionName"]>>;
export function parent<
  S extends SectionName<"hasOneParent">,
  I extends SpecificSectionInfo<SectionName<"hasParent">>
>(
  this: Analyzer,
  finder: S | I
): StateSection<S | ParentName<I["sectionName"]>>;
export function parent<S extends SectionName<"hasParent">>(
  this: Analyzer,
  finder: SectionFinderForParent<S>
): StateSection<ParentName<S>> {
  if (sectionNameS.is(finder, "hasOneParent")) {
    const parentName = this.meta.parentName(finder);
    return this.section(parentName as any) as StateSection<ParentName<S>>;
  } else {
    const { parentInfo } = this.section(finder);
    return this.section(parentInfo as any) as StateSection<ParentName<S>>;
  }
}

export function parentFinderToInfo<SN extends SectionName = SectionName>(
  this: Analyzer,
  parentFinder: ParentFinder<SN>,
  _sectionName?: SN
): ParentFeInfo<SN> {
  if (typeof parentFinder !== "string") return parentFinder;
  const { feInfo } = this.section(parentFinder);
  return feInfo as ParentFeInfo<SN>;
}
