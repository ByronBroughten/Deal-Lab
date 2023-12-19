import { SectionPack } from "../SectionPacks/SectionPack";
import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultFeUserPack } from "./makeDefaultFeStore";

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");

  main.addChild("dealCompareCache");
  main.addChild("sessionStore");
  main.addChild("newDealMenu");
  main.addChild("mainDealMenu");
  main.addChild("variablesMenu");
  main.addChild("dealCompareDealSelectMenu");
  main.addChild("feStore", { sectionPack: makeDefaultFeUserPack() });

  const latent = main.addAndGetChild("latentDealSystem");
  latent.addChild("calculatedVarbs");
  latent.addChild("deal", { sectionPack: makeDefaultDealPack() });

  return main.makeSectionPack();
}
