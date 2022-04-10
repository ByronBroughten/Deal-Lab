import Analyzer from "../../Analyzer";
import { Obj } from "../../utils/Obj";
import { DbEntry } from "../DbEntry";
import { FeParentInfo } from "../SectionMetas/relNameArrs/ParentTypes";
import { SectionName } from "../SectionMetas/SectionName";
import { internal } from "./internal";

export function loadSectionArrAndSolve<S extends SectionName<"hasOneParent">>(
  this: Analyzer,
  sectionName: S,
  dbEntryArr: DbEntry[],
  { resetDbIds }: { resetDbIds?: boolean } = {} // options
) {
  let next = this;
  next = next.wipeSectionArrAndSolve(sectionName);

  const parentFinder = next.parent(sectionName).feInfo as FeParentInfo<S>;
  next = dbEntryArr.reduce((next, dbEntry) => {
    next = internal.addSections(next, [
      {
        sectionName,
        parentFinder,
        dbEntry,
      },
    ]);
    if (resetDbIds) {
      const { feInfo } = next.lastSection(sectionName);
      next = internal.resetSectionAndChildDbIds(next, feInfo);
    }
    return next;
  }, next as Analyzer);
  return next.solveVarbs();
}

type SectionArrs = Record<SectionName<"hasOneParent">, DbEntry[]>;
export function loadSectionArrsAndSolve(
  this: Analyzer,
  sectionArrs: Partial<SectionArrs>
): Analyzer {
  // This could be implemented so as solves fewer times.
  let next = this;
  for (const [sectionName, dbSectionArr] of Obj.entries(
    sectionArrs as SectionArrs
  )) {
    next = next.loadSectionArrAndSolve(sectionName, dbSectionArr);
  }
  return next;
}
