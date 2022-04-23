import Analyzer from "../../Analyzer";
import { ParentFinder } from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { internal } from "./internal";
import { InitSectionAndChildrenProps } from "./internal/addSections";

export function addSectionsAndSolve(
  this: Analyzer,
  propArr: InitSectionAndChildrenProps[]
): Analyzer {
  const next = internal.addSections(this, propArr);
  return next.solveVarbs();
}

export type InitSectionOptions = Omit<
  InitSectionAndChildrenProps,
  "sectionName" | "parentFinder"
>;
export function addSectionAndSolve<SN extends SectionName>(
  this: Analyzer,
  sectionName: SN,
  parentFinder: ParentFinder<SN>,
  options: InitSectionOptions = {}
): Analyzer {
  return this.addSectionsAndSolve([{ sectionName, parentFinder, ...options }]);
}
