import { PackBuilderSection } from "../Packers/PackBuilderSection";
import { ConditionalRowTypeName } from "../Solvers/ValueUpdateVarb/ConditionalValueSolver";

export function makeDefaultConditionalList() {
  const conditionalList =
    PackBuilderSection.initAsOmniChild("conditionalRowList");
  const childTypeNames: ConditionalRowTypeName[] = ["if", "then", "or else"];
  for (const childTypeName of childTypeNames) {
    conditionalList.addChild("conditionalRow", {
      sectionValues: { type: childTypeName },
    });
  }
  return conditionalList.makeSectionPack();
}
