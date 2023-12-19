import { SectionPack } from "../SectionPacks/SectionPack";
import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";
import { makeDefaultFeUserPack } from "./makeDefaultFeStore";

export function makeEmptyMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  main.addChild("feStore", { sectionPack: makeDefaultFeUserPack() });
  return main.makeSectionPack();
}
