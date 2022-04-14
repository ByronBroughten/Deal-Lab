import Analyzer from "../../Analyzer";
import { LoginUserNext } from "../../apiQueriesShared/login";
import { Obj } from "../../utils/Obj";
import { SectionName } from "../SectionMetas/SectionName";
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
