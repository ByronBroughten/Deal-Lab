import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";
import { makeDefaultConditionalList } from "./makeDefaultConditionalList";

export function makeDefaultUserVarbItem() {
  const numVarbItem = PackBuilderSection.initAsOmniChild("numVarbItem");
  numVarbItem.addChild("conditionalRowList", {
    sectionPack: makeDefaultConditionalList(),
  });
  return numVarbItem.makeSectionPack();
}
