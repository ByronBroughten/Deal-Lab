import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultConditionalList } from "./makeDefaultConditionalList";

export function makeDefaultUserVarbItem() {
  const numVarbItem = PackBuilderSection.initAsOmniChild("numVarbItem");
  numVarbItem.loadChild({
    childName: "conditionalRowList",
    sectionPack: makeDefaultConditionalList(),
  });
  return numVarbItem.makeSectionPack();
}
