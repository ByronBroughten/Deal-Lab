import Analyzer from "../../Analyzer";
import { ParentFinder } from "../SectionMetas/relSectionTypes";
import { SectionName } from "../SectionMetas/SectionName";
import { InitSectionAndChildrenProps } from "./protected/addSections";

export function addSectionsAndSolve(
  this: Analyzer,
  propArr: InitSectionAndChildrenProps[]
): Analyzer {
  const [next, varbInfosToSolveFor] = this.addSections(propArr);
  return next.solveVarbs(varbInfosToSolveFor);
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
