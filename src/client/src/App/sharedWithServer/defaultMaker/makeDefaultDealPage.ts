import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";

export function makeDefaultDealPage() {
  const dealPage = PackBuilderSection.initAsOmniChild("dealPage");
  dealPage.addChild("calculatedVarbs");
  dealPage.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });
  return dealPage.makeSectionPack();
}
