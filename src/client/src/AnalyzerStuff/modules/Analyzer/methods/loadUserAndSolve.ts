import { LoginUser } from "../../../../App/sharedWithServer/apiQueriesShared/login";
import { SectionPackRaw } from "../../../../App/sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../../../App/sharedWithServer/SectionsMeta/SectionName";
import { Obj } from "../../../../App/sharedWithServer/utils/Obj";
import Analyzer from "../../Analyzer";
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
