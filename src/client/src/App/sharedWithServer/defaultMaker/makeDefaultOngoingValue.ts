import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultOngoingValue() {
  const itemValueSwitch = "valueEditor";
  const ongoingValue = PackBuilderSection.initAsOmniChild("ongoingValue", {
    dbVarbs: {
      itemValueSwitch,
      valueSourceName: "none",
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
