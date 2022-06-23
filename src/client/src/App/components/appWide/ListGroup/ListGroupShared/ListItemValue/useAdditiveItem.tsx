import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../../../../sharedWithServer/SectionsMeta/SectionName";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";

const valueSwitchValues = [
  "loadedVarb",
  "labeledEquation",
  "labeledSpanOverCost",
  "ifThen",
] as const;

export type ValueSwitchValue = typeof valueSwitchValues[number];
function isValueSwitchValue(value: any): value is ValueSwitchValue {
  return valueSwitchValues.includes(value);
}

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
  feInfo: FeSectionInfo,
  itemType: SectionName<"userListItem">
) {
  const section = useGetterSection(feInfo);
  return {
    switchValues: valueSwitches[itemType],
    valueVarbName:
      itemType === "ongoingItem"
        ? section.switchVarbName("value", "ongoing")
        : "value",
  };
}
export function useAdditiveItem(
  feInfo: FeSectionInfo,
  itemType: SectionName<"userListItem">
) {
  const section = useSetterSection(feInfo);
  const valueSwitchVarb = section.varb("valueSwitch");
  const valueSwitch = valueSwitchVarb.value("string");
  if (!isValueSwitchValue(valueSwitch)) {
    throw new Error(
      `valueSwitch should be a ValueSwitchValue but is ${valueSwitch}`
    );
  }
  const { switchValues, valueVarbName } = useOngoingOrSingleItem(
    feInfo,
    itemType
  );
  return {
    valueSwitch,
    valueVarbName,
    toggleValueSwitch: () => {
      const nextSwitch = nextSwitchValue(valueSwitch, switchValues);
      valueSwitchVarb.updateValueDirectly(nextSwitch);
    },
  };
}
