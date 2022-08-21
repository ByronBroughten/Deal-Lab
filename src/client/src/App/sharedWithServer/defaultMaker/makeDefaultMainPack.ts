import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";

export function makeDefaultMainPack(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  main.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });
  main.loadChild({
    childName: "feUser",
    sectionPack: makeDefaultFeUserPack(),
  });
  const childNames = ["login", "register"] as const;
  for (const childName of childNames) {
    main.addChild(childName);
  }
  return main.makeSectionPack();
}
