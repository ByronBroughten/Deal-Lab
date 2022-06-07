import Analyzer from "../../Analyzer";
import { LoginUser } from "../../apiQueriesShared/login";
import { SectionPackRaw } from "../../SectionPack/SectionPackRaw";
import { SectionName } from "../../SectionsMeta/SectionName";
import { Obj } from "../../utils/Obj";
import { internal } from "./internal";

export function loadUserAndSolve(
  this: Analyzer,
  loginUser: LoginUser
): Analyzer {
  let next = this;

  for (const [sectionName, sectionPackArr] of Obj.entries(loginUser)) {
    next = internal.loadRawSectionPackArr(
      next,
      sectionName,
      sectionPackArr as SectionPackRaw<SectionName<"hasOneParent">>[]
    );
  }
  return next.solveVarbs();
}
