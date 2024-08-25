import { PackBuilderSection } from "../Packers/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";

export function makeDefaultDealSystem() {
  const dealSystem = PackBuilderSection.initAsOmniChild("dealSystem");
  dealSystem.addChild("calculatedVarbs");

  dealSystem.addChild("deal", {
    sectionPack: makeDefaultDealPack(),
  });
  return dealSystem.makeSectionPack();
}
