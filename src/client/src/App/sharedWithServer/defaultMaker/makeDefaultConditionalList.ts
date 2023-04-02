import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { ConditionalRowTypeName } from "../StateSolvers/ValueUpdaterVarb/ConditionalValueSolver";

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
