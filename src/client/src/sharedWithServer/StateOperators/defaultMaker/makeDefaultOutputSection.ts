import {
  DealMode,
  getDealModes,
} from "../../stateSchemas/schema4ValueTraits/StateValue/dealMode";
import { ChildNameOfType } from "../../stateSchemas/schema6SectionChildren/SectionNameByType";
import { SectionPack } from "../../StateTransports/SectionPack";
import { PackBuilderSection } from "../Packers/PackBuilderSection";
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
