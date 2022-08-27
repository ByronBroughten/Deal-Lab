import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultConditionalList } from "./makeDefaultConditionalList";

export function makeDefaultUserVarbItem() {
  const userVarbItem = PackBuilderSection.initAsOmniChild("userVarbItem");
  userVarbItem.loadChild({
    childName: "conditionalRowList",
    sectionPack: makeDefaultConditionalList(),
  });
  return userVarbItem.makeSectionPack();
}
