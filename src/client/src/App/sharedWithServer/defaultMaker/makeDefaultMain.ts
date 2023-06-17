import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultFeUserPack } from "./makeDefaultFeStore";

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");

  main.addChild("newDealMenu");
  main.addChild("mainDealMenu");
  main.addChild("variablesMenu");
  main.addChild("dealCompareDealSelectMenu");
  main.loadChild({
    childName: "feStore",
    sectionPack: makeDefaultFeUserPack(),
  });

  const latent = main.addAndGetChild("latentDealSystem");
  latent.addChild("calculatedVarbs");
  latent.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });

  return main.makeSectionPack();
}
