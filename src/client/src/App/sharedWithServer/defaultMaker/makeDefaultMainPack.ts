import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";

export function makeDefaultMainPack(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  main.loadChild({
    childName: "feUser",
    sectionPack: makeDefaultFeUserPack(),
  });
  return main.makeSectionPack();
}
