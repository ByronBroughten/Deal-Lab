import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultFeUserPack } from "./makeDefaultFeStore";
import { defaultCompareInfos } from "./makeDefaultOutputList";

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
  defaultCompareInfos.forEach((outputInfo) => {
    const compareValue = dealCompare.addAndGetChild("compareValue");
    compareValue.updateValues({
      valueEntityInfo: inEntityValueInfo(outputInfo),
    });
  });

  return main.makeSectionPack();
}
