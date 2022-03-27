import Analyzer from "../../../Analyzer";
import { sectionMetas } from "../../SectionMetas";
import { SpecificSectionInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  FeParentInfo,
  ParentFinder,
  ParentName,
} from "../../SectionMetas/relNameArrs";
import { SectionNam, SectionName } from "../../SectionMetas/SectionName";
import StateSection from "../../StateSection";

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
export function parent(
  this: Analyzer,
  finder:
    | SectionName<"hasOneParent">
    | SpecificSectionInfo<SectionName<"hasParent">>
) {
  if (SectionNam.is(finder, "hasOneParent")) {
    const parentName = sectionMetas.parentName(finder);
    return this.section(parentName);
  } else {
    const { parentInfo } = this.section(finder);
    return this.section(parentInfo);
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
