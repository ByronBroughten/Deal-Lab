import Analyzer from "../../Analyzer";
import { LoginUserNext } from "../../Crud/Login";
import { Obj } from "../../utils/Obj";
import { RawSectionPack } from "../RawSectionPack";
import { SectionName } from "../SectionMetas/SectionName";
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
      sectionPackArr as RawSectionPack<"fe", SectionName<"hasOneParent">>[]
    );
  }
  return next.solveVarbs();
}
