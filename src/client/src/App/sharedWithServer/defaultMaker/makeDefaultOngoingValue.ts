import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultOngoingValue() {
  const periodicValue = PackBuilderSection.initAsOmniChild("periodicValue");
  periodicValue.updateValues({
    valueSourceName: "none",
    valuePeriodicSwitch: "monthly",
  });

  const list = periodicValue.addAndGetChild("periodicList");
  list.updateValues({ itemValueSource: "valueDollarsPeriodicEditor" });
  return periodicValue.makeSectionPack();
}
