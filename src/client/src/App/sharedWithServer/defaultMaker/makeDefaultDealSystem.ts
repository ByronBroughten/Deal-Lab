import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";

export function makeDefaultDealSystem() {
  const dealSystem = PackBuilderSection.initAsOmniChild("dealSystem");
  dealSystem.addChild("calculatedVarbs");

  dealSystem.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });
  return dealSystem.makeSectionPack();
}
