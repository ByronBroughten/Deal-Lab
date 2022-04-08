import Analyzer from "../../Analyzer";
import { internal } from "./internal";
import { AddSectionProps } from "./internal/addSections/addSectionsTypes";

export function addSectionsAndSolveNext(
  this: Analyzer,
  propsArr: AddSectionProps[]
): Analyzer {
  const next = internal.addSectionsNext(this, propsArr);
  return next.solveVarbs();
}
