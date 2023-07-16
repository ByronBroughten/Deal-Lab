import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { ChildNameOfType } from "../SectionsMeta/SectionNameByType";
import {
  DealMode,
  getDealModes,
} from "../SectionsMeta/values/StateValue/dealMode";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultOutputList } from "./makeDefaultOutputList";

type DealModeToOutputChildName = Record<
  DealMode,
  ChildNameOfType<"outputSection", "outputList">
>;

const _checkOutputListNames = <T extends DealModeToOutputChildName>(t: T) => t;
const dealModeToOutputListName = _checkOutputListNames({
  homeBuyer: "homeBuyerOutputList",
  buyAndHold: "buyAndHoldOutputList",
  fixAndFlip: "fixAndFlipOutputList",
  brrrr: "brrrrOutputList",
});
type DealModeToOutputListName = typeof dealModeToOutputListName;
export function outputListName<DM extends DealMode>(
  dealMode: DM
): DealModeToOutputListName[DM] {
  return dealModeToOutputListName[dealMode];
}

export function makeDefaultOutputSection(): SectionPack<"outputSection"> {
  const outputSection = PackBuilderSection.initAsOmniChild("outputSection");
  for (const dealMode of getDealModes("all")) {
    outputSection.addChild(dealModeToOutputListName[dealMode], {
      sectionPack: makeDefaultOutputList(dealMode),
    });
  }
  return outputSection.makeSectionPack();
}
