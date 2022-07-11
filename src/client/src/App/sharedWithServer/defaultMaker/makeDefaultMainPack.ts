import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeStorePack } from "./makeDefaultFeStore";

export function makeDefaultMainPack(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  main.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });
  main.loadChild({
    childName: "feStore",
    sectionPack: makeDefaultFeStorePack(),
  });
  const childNames = ["login", "register"] as const;
  for (const childName of childNames) {
    main.addChild(childName);
  }
  return main.makeSectionPack();
}
