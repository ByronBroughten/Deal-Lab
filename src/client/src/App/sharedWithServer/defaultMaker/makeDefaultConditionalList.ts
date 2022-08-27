import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { ConditionalRowTypeName } from "../StateSolvers/SolveValueVarb/ConditionalValueSolver";

export function makeDefaultConditionalList() {
  const conditionalList =
    PackBuilderSection.initAsOmniChild("conditionalRowList");
  const childTypeNames: ConditionalRowTypeName[] = ["if", "then", "or else"];
  for (const childTypeName of childTypeNames) {
    conditionalList.addChild("conditionalRow", {
      dbVarbs: { type: childTypeName },
    });
  }
  return conditionalList.makeSectionPack();
}
