import Analyzer from "../../Analyzer";
import { internal } from "./internal";
import { AddSectionPropsNext } from "./internal/addSections/addSectionsTypes";

export function addSectionsAndSolveNext(
  this: Analyzer,
  propsArr: AddSectionPropsNext[]
): Analyzer {
  const next = internal.addSectionsNext(this, propsArr);
  return next.solveVarbs();
}
