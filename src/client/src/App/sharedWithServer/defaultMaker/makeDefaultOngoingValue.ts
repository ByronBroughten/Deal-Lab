import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultOngoingValue() {
  const itemValueSwitch = "labeledEquation";
  const ongoingValue = PackBuilderSection.initAsOmniChild("ongoingValue", {
    dbVarbs: {
      itemValueSwitch,
      valueSourceSwitch: "valueEditor",
      isItemized: false,
      valueOngoingSwitch: "monthly",
    },
  });
  ongoingValue.addChild("ongoingList", {
    dbVarbs: {
      itemValueSwitch,
    },
  });
  return ongoingValue.makeSectionPack();
}
