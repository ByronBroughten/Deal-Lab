import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";

export function makeDefaultMainPack(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  main.loadChild({
    childName: "feUser",
    sectionPack: makeDefaultFeUserPack(),
  });
  const defaultDealPack = makeDefaultDealPack();
  main.loadChild({
    childName: "activeDeal",
    sectionPack: defaultDealPack,
  });
  // const latentSections = main.addAndGetChild("latentSections");
  // latentSections.loadChild({
  //   childName: "deal",
  //   sectionPack: defaultDealPack,
  // });
  return main.makeSectionPack();
}
