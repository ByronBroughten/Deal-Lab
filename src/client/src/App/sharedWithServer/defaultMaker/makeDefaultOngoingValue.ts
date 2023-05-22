import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultOngoingValue() {
  const itemValueSource = "valueEditor";
  const ongoingValue = PackBuilderSection.initAsOmniChild("ongoingValue");
  ongoingValue.updateValues({
    valueSourceName: "none",
    valuePeriodicSwitch: "monthly",
  });

  const list = ongoingValue.addAndGetChild("ongoingList");
  list.updateValues({ itemValueSource });
  return ongoingValue.makeSectionPack();
}
