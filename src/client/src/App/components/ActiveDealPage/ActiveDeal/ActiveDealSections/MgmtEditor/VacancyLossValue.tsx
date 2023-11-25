import { FeVI } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueFixedVarbPathName } from "../../../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { GetterSection } from "../../../../../sharedWithServer/StateGetters/GetterSection";
import { SelectEditor } from "../../../../appWide/SelectEditor";
import { VarbStringLabel } from "../../../../appWide/VarbStringLabel";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

function getProps(vacancyLoss: GetterSection<"vacancyLossValue">): {
  equalsValue?: string;
  editorProps?: {
    quickViewVarbNames: ValueFixedVarbPathName[];
    feVarbInfo: FeVI;
  };
} {
  const valueSourceName = vacancyLoss.valueNext("valueSourceName");
  const dollarsVarb = vacancyLoss.activeSwitchTarget(
    "valueDollars",
    "periodic"
  );
  const dollarsSwitch = vacancyLoss.switchValue("valueDollars", "periodic");

  const commonQuickAccess = ["sqft", "numUnits"] as const;
  const dollarsQuickAccess = {
    monthly: "targetRentMonthly",
    yearly: "targetRentYearly",
  } as const;

  switch (valueSourceName) {
    case "none":
      return {};
    case "fivePercentRent":
    case "tenPercentRent":
      return { equalsValue: dollarsVarb.displayVarb() };
    case "percentOfRentEditor":
      return {
        equalsValue: dollarsVarb.displayVarb(),
        editorProps: {
          feVarbInfo: vacancyLoss.varbInfo2("valuePercentEditor"),
          quickViewVarbNames: [...commonQuickAccess],
        },
      };
    case "valueDollarsPeriodicEditor": {
      return {
        equalsValue: `${vacancyLoss.displayVarb("valuePercent")} of rent`,
        editorProps: {
          feVarbInfo: vacancyLoss.varbInfo2("valueDollarsPeriodicEditor"),
          quickViewVarbNames: [
            dollarsQuickAccess[dollarsSwitch],
            ...commonQuickAccess,
          ],
        },
      };
    }
  }
}

export function VacancyLossValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "vacancyLossValue", feId } as const;
  const vacancyLoss = useGetterSection(feInfo);
  const { editorProps, equalsValue } = getProps(vacancyLoss);
  const valueSourceName = vacancyLoss.valueNext("valueSourceName");
  const feVarbInfo = { ...feInfo, varbName: "valueSourceName" } as const;
  return (
    <SelectEditor
      inputMargins
      {...{
        selectProps: { sx: { minWidth: 140 } },
        feVarbInfo,
        unionValueName: "vacancyLossValueSource",
        items: [
          [
            "fivePercentRent",
            `5% rent${
              valueSourceName === "fivePercentRent"
                ? ""
                : " (common low estimate)"
            }`,
          ],
          [
            "tenPercentRent",
            `10% rent${
              valueSourceName === "tenPercentRent"
                ? ""
                : " (common high estimate)"
            }`,
          ],
          ["percentOfRentEditor", "Custom percent of rent"],
          ["valueDollarsPeriodicEditor", "Custom amount"],
        ],
        label: <VarbStringLabel names={feVarbInfo} />,
        equalsValue,
        makeEditor: editorProps
          ? (props) => (
              <NumObjEntityEditor
                {...{
                  ...props,
                  ...editorProps,
                }}
              />
            )
          : undefined,
      }}
    />
  );
}
