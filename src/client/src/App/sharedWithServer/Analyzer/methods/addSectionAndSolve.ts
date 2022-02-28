import Analyzer from "../../Analyzer";
import { FeParentInfo } from "../SectionMetas/relSectionTypes";
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
  "sectionName" | "parentInfo"
>;
export function addSectionAndSolve<S extends SectionName>(
  this: Analyzer,
  sectionName: S,
  parentInfo: FeParentInfo<S>,
  options: InitSectionOptions = {}
): Analyzer {
  return this.addSectionsAndSolve([{ sectionName, parentInfo, ...options }]);
}
