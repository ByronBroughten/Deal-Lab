import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";

export function makeDefaultMainPack(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  main.loadChild({
    childName: "feUser",
    sectionPack: makeDefaultFeUserPack(),
  });
  main.loadChild({
    childName: "activeDeal",
    sectionPack: makeDefaultDealPack(),
  });
  return main.makeSectionPack();
}
