import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultOngoingValue() {
  const itemValueSource = "valueEditor";
  const periodicValue = PackBuilderSection.initAsOmniChild("periodicValue");
  periodicValue.updateValues({
    valueSourceName: "none",
    valuePeriodicSwitch: "monthly",
  });

  const list = periodicValue.addAndGetChild("periodicList");
  list.updateValues({ itemValueSource });
  return periodicValue.makeSectionPack();
}
