import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { ChildNameOfType } from "../SectionsMeta/SectionNameByType";
import { StateValue } from "../SectionsMeta/values/StateValue";
import {
  DealMode,
  getDealModes,
} from "../SectionsMeta/values/StateValue/dealMode";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultOutputList } from "./makeDefaultOutputList";

type DealModeToOutputChildName = Record<
  DealMode<"plusMixed">,
  ChildNameOfType<"dealCompareMainMenu", "outputList">
>;

const _checkOutputListNames = <T extends DealModeToOutputChildName>(t: T) => t;
const dealModeToOutputListName = _checkOutputListNames({
  homeBuyer: "homeBuyerOutputList",
  buyAndHold: "buyAndHoldOutputList",
  fixAndFlip: "fixAndFlipOutputList",
  brrrr: "brrrrOutputList",
  mixed: "mixedOutputList",
});
type DealModeToOutputListName = typeof dealModeToOutputListName;
export function outputListName<DM extends StateValue<"dealModePlusMixed">>(
  dealMode: DM
): DealModeToOutputListName[DM] {
  return dealModeToOutputListName[dealMode];
}

export function makeDefaultOutputSection(): SectionPack<"outputSection"> {
  const outputSection = PackBuilderSection.initAsOmniChild("outputSection");
  for (const dealMode of getDealModes("all")) {
    outputSection.loadChild({
      childName: dealModeToOutputListName[dealMode],
      sectionPack: makeDefaultOutputList(dealMode),
    });
  }
  return outputSection.makeSectionPack();
}
