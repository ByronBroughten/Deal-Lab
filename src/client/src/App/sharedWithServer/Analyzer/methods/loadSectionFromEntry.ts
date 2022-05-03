import Analyzer from "../../Analyzer";
import { FeParentInfo } from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { DbEntry } from "../DbEntry";
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
      next = next.resetSectionAndChildDbIds(feInfo);
    }
    return next;
  }, next as Analyzer);
  return next.solveVarbs();
}
