import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ValueFixedVarbPathName } from "../../../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { GetterSection } from "../../../../../sharedWithServer/StateGetters/GetterSection";
import { SelectEditorSection } from "../../../../appWide/SelectEditorSection";

function getProps(getter: GetterSection<"mgmtBasePayValue">): {
  equalsValue?: string;
  editorProps?: {
    quickViewVarbNames: ValueFixedVarbPathName[];
    feVarbInfo: FeVarbInfo;
  };
} {
  const valueSourceName = getter.valueNext("valueSourceName");
  const dollarsVarb = getter.activeSwitchTarget("valueDollars", "ongoing");
  const dollarsSwitch = getter.switchValue("valueDollars", "ongoing");

  const commonQuickAccess = ["sqft", "numUnits"] as const;
  const dollarsQuickAccess = {
    monthly: "targetRentMonthly",
    yearly: "targetRentYearly",
  } as const;

  switch (valueSourceName) {
    case "none":
      return {};
    case "zero":
      return { equalsValue: "$0" };
    case "tenPercentRent":
      return { equalsValue: dollarsVarb.displayVarb() };
    case "percentOfRentEditor":
      return {
        equalsValue: dollarsVarb.displayVarb(),
        editorProps: {
          feVarbInfo: getter.varbNext("valuePercentEditor").feVarbInfo,
          quickViewVarbNames: [...commonQuickAccess],
        },
      };
    case "dollarsEditor": {
      return {
        equalsValue: `${getter.displayVarb("valuePercent")} of rent`,
        editorProps: {
          feVarbInfo: getter.varbNext("valueDollarsOngoingEditor").feVarbInfo,
          quickViewVarbNames: [
            dollarsQuickAccess[dollarsSwitch],
            ...commonQuickAccess,
          ],
        },
      };
    }
  }
}

export function BasePayValue({ feId }: { feId: string }) {
  const basePayValue = useSetterSection({
    sectionName: "mgmtBasePayValue",
    feId,
  });
  const props = getProps(basePayValue.get);
  const valueSourceName = basePayValue.value("valueSourceName");
  const menuItems: [StateValue<"mgmtBasePayValueSource">, string][] = [
    ["zero", "Owner managed (no pay)"],
    [
      "tenPercentRent",
      `10% rent${
        valueSourceName === "tenPercentRent" ? "" : " (common estimate)"
      }`,
    ],
    ["percentOfRentEditor", "Custom percent of rent"],
    ["dollarsEditor", "Custom dollar amount"],
  ];

  return (
    <SelectEditorSection
      {...{
        label: "Base Pay",
        editorProps: props.editorProps && {
          ...props.editorProps,
          editorType: "numeric",
        },
        selectValue: valueSourceName,
        onChange: (e) => {
          const value = e.target.value as string;
          basePayValue.varb("valueSourceName").updateValue(value);
        },
        menuItems,
        equalsValue: props.equalsValue,
      }}
    />
  );
}
