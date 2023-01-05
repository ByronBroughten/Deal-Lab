import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultOneTimeValue() {
  const itemValueSwitch = "labeledEquation";
  const singleTimeValue = PackBuilderSection.initAsOmniChild(
    "singleTimeValue",
    {
      dbVarbs: {
        itemValueSwitch,
        valueSourceSwitch: "valueEditor",
        isItemized: false,
      },
    }
  );
  singleTimeValue.addChild("singleTimeList", {
    dbVarbs: { itemValueSwitch },
  });
  return singleTimeValue.makeSectionPack();
}
