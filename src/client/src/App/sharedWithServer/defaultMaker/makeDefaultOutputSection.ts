import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { ChildNameOfType } from "../SectionsMeta/SectionNameByType";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { Obj } from "../utils/Obj";
import { makeDefaultOutputList } from "./makeDefaultOutputList";

type DealModeToOutputChildName = Record<
  StateValue<"dealMode">,
  ChildNameOfType<"outputSection", "outputList">
>;

const _checkOutputListNames = <T extends DealModeToOutputChildName>(t: T) => t;
const dealModeToOutputListName = _checkOutputListNames({
  buyAndHold: "buyAndHoldOutputList",
  fixAndFlip: "fixAndFlipOutputList",
});
type DealModeToOutputListName = typeof dealModeToOutputListName;
export function outputListName<DM extends StateValue<"dealMode">>(
  dealMode: DM
): DealModeToOutputListName[DM] {
  return dealModeToOutputListName[dealMode];
}

export function makeDefaultOutputSection(): SectionPack<"outputSection"> {
  const outputSection = PackBuilderSection.initAsOmniChild("outputSection");
  for (const dealMode of Obj.keys(dealModeToOutputListName)) {
    outputSection.loadChild({
      childName: dealModeToOutputListName[dealMode],
      sectionPack: makeDefaultOutputList(dealMode),
    });
  }
  return outputSection.makeSectionPack();
}
