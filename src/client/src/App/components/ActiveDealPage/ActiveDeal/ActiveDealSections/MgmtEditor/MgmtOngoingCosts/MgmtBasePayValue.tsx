import { FeVarbInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueFixedVarbPathName } from "../../../../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { GetterSection } from "../../../../../../sharedWithServer/StateGetters/GetterSection";
import { SelectEditor } from "../../../../../appWide/SelectEditor";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";

function getProps(getter: GetterSection<"mgmtBasePayValue">): {
  equalsValue?: string;
  editorProps?: {
    quickViewVarbNames: ValueFixedVarbPathName[];
    feVarbInfo: FeVarbInfo;
  };
} {
  const valueSourceName = getter.valueNext("valueSourceName");
  const dollarsVarb = getter.activeSwitchTarget("valueDollars", "periodic");
  const dollarsSwitch = getter.switchValue("valueDollars", "periodic");

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
    case "valueDollarsPeriodicEditor": {
      return {
        equalsValue: `${getter.displayVarb("valuePercent")} of rent`,
        editorProps: {
          feVarbInfo: getter.varbNext("valueDollarsPeriodicEditor").feVarbInfo,
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
  const feInfo = { sectionName: "mgmtBasePayValue", feId } as const;
  const basePayValue = useGetterSection(feInfo);
  const { editorProps, equalsValue } = getProps(basePayValue);
  const valueSourceName = basePayValue.valueNext("valueSourceName");
  return (
    <SelectEditor
      inputMargins
      {...{
        unionValueName: "mgmtBasePayValueSource",
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        label: "Base Pay",
        items: [
          ["none", "Choose method"],
          ["zero", "Owner managed (no pay)"],
          [
            "tenPercentRent",
            `10% rent${
              valueSourceName === "tenPercentRent" ? "" : " (common estimate)"
            }`,
          ],
          ["percentOfRentEditor", "Custom percent of rent"],
          ["valueDollarsPeriodicEditor", "Custom amount"],
        ],
        makeEditor: editorProps
          ? (props) => (
              <NumObjEntityEditor
                {...{
                  ...props,
                  ...editorProps,
                  quickViewVarbNames: [
                    "numUnits",
                    "targetRentMonthly",
                    "targetRentYearly",
                  ],
                }}
              />
            )
          : undefined,
        selectValue: valueSourceName,
        equalsValue,
      }}
    />
  );
}
