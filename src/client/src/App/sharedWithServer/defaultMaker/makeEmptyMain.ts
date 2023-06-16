import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultFeUserPack } from "./makeDefaultFeStore";

export function makeEmptyMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  main.loadChild({
    childName: "feStore",
    sectionPack: makeDefaultFeUserPack(),
  });

  return main.makeSectionPack();
}
