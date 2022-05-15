import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { FeInfo, InfoS } from "../../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";

const valueSwitchValues = [
  "loadedVarb",
  "labeledEquation",
  "labeledSpanOverCost",
  "ifThen",
] as const;
export type ValueSwitchValue = typeof valueSwitchValues[number];
export const valueSwitches: Record<
  SectionName<"userListItem">,
  ValueSwitchValue[]
> = {
  singleTimeItem: ["loadedVarb", "labeledEquation"],
  ongoingItem: ["loadedVarb", "labeledEquation", "labeledSpanOverCost"],
  userVarbItem: ["labeledEquation", "ifThen"],
};
type ValueSwitches = typeof valueSwitches;
type SwitchValues = ValueSwitches[keyof ValueSwitches];

function nextSwitchValue(
  currentValue: ValueSwitchValue,
  switchValues: SwitchValues
): ValueSwitchValue {
  const currentIdx = switchValues.indexOf(currentValue as any);
  const nextIdx = (currentIdx + 1) % switchValues.length;
  return switchValues[nextIdx];
}

function useOngoingOrSingleItem(
  feInfo: FeInfo,
  itemType: SectionName<"userListItem">
) {
  const { analyzer } = useAnalyzerContext();
  return {
    switchValues: valueSwitches[itemType],
    valueVarbName:
      itemType === "ongoingItem"
        ? analyzer.switchedOngoingVarbName(feInfo, "value")
        : "value",
  };
}
export function useAdditiveItem(
  feInfo: FeInfo,
  itemType: SectionName<"userListItem">
) {
  const { analyzer, handleDirectUpdate } = useAnalyzerContext();
  const { switchValues, valueVarbName } = useOngoingOrSingleItem(
    feInfo,
    itemType
  );

  const valueSwitchInfo = InfoS.feVarb("valueSwitch", feInfo);
  const valueSwitch = analyzer.value(
    valueSwitchInfo,
    "string"
  ) as ValueSwitchValue;
  function toggleValueSwitch() {
    const nextSwitch = nextSwitchValue(valueSwitch, switchValues);
    handleDirectUpdate(valueSwitchInfo, nextSwitch);
  }

  return {
    valueSwitch,
    toggleValueSwitch,
    valueVarbName,
  };
}
