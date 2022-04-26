import Analyzer from "../../Analyzer";
import { LoginUserNext } from "../../apiQueriesShared/login";
import { ParentName } from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { Obj } from "../../utils/Obj";
import { SectionPackRaw } from "../SectionPackRaw";
import { internal } from "./internal";

export function loadUserAndSolve(
  this: Analyzer,
  loginUser: LoginUserNext
): Analyzer {
  let next = this;
  for (const [sectionName, sectionPackArr] of Obj.entries(loginUser)) {
    next = internal.loadRawSectionPackArr(
      next,
      sectionName,
      sectionPackArr as SectionPackRaw<"fe", SectionName<"hasOneParent">>[]
    );
  }
  return next.solveVarbs();
}

type Test = SectionName<"hasOneParent">;
type Test2 = ParentName<"userSingleList">;
