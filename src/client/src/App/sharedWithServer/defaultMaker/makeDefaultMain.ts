import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultDealCompareMenu } from "./makeDefaultDealCompareMenu";
import { makeDefaultFeUserPack } from "./makeDefaultFeStore";

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");

  main.addChild("newDealMenu");
  main.addChild("mainDealMenu");
  main.addChild("variablesMenu");
  main.loadChild({
    childName: "feStore",
    sectionPack: makeDefaultFeUserPack(),
  });

  main.loadChild({
    childName: "dealCompare",
    sectionPack: makeDefaultDealCompareMenu(),
  });

  const latent = main.addAndGetChild("latentDealSystem");
  latent.addChild("calculatedVarbs");
  latent.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });

  return main.makeSectionPack();
}
