import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultOngoingValue() {
  const itemValueSource = "valueEditor";
  const ongoingValue = PackBuilderSection.initAsOmniChild("ongoingValue");
  ongoingValue.updateValues({
    valueSourceName: "none",
    valueOngoingSwitch: "monthly",
  });

  const list = ongoingValue.addAndGetChild("ongoingList");
  list.updateValues({ itemValueSource });
  return ongoingValue.makeSectionPack();
}
