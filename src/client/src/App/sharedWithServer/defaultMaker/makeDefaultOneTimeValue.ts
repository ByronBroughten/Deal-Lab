import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultOneTimeValue() {
  const itemValueSwitch = "valueEditor";
  const singleTimeValue = PackBuilderSection.initAsOmniChild(
    "singleTimeValue",
    {
      dbVarbs: {
        itemValueSwitch,
        valueSourceName: "none",
        isItemized: false,
      },
    }
  );
  singleTimeValue.addChild("singleTimeList", {
    dbVarbs: { itemValueSwitch },
  });
  return singleTimeValue.makeSectionPack();
}
