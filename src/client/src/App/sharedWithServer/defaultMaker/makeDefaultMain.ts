import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { defaultDealOutputInfos } from "./makeDefaultOutputList";

export function makeDefaultActiveDealSystem() {
  const dealSystem = PackBuilderSection.initAsOmniChild("dealSystem");
  dealSystem.addChild("calculatedVarbs");
  return dealSystem.makeSectionPack();
}

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");

  main.addChild("mainDealMenu");
  main.addChild("variablesMenu");
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

  const dealCompare = main.addAndGetChild("dealCompare");
  defaultDealOutputInfos.forEach((outputInfo) => {
    const compareValue = dealCompare.addAndGetChild("compareValue");
    compareValue.updateValues({
      valueEntityInfo: inEntityValueInfo(outputInfo),
    });
  });

  return main.makeSectionPack();
}
