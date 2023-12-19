import { GetterSection } from "../../../../../../sharedWithServer/StateGetters/GetterSection";
import { useGetterSection } from "../../../../../stateClassHooks/useGetterSection";
import { MakeEditor, SelectEditor } from "../../../../appWide/SelectEditor";
import { VarbStringLabel } from "../../../../appWide/VarbStringLabel";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { PeriodicEditor } from "../../../../inputs/PeriodicEditor";

function getProps(vacancyLoss: GetterSection<"vacancyLossValue">): {
  equalsValue?: string;
  makeEditor?: MakeEditor;
} {
  const valueSourceName = vacancyLoss.valueNext("valueSourceName");
  const dollarsVarb = vacancyLoss.varbNext("valueDollarsMonthly");

  const dollarsEditor = vacancyLoss.onlyChild("valueDollarsEditor");
  const freq = dollarsEditor.valueNext("valueEditorFrequency");

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
    case "valuePercentEditor":
      return {
        equalsValue: dollarsVarb.displayVarb(),
        makeEditor: (props) => (
          <NumObjEntityEditor
            {...{
              ...props,
              labelProps: { showLabel: false },
              feVarbInfo: vacancyLoss.varbInfo2("valuePercentEditor"),
              quickViewVarbNames: commonQuickAccess,
            }}
          />
        ),
      };
    case "valueDollarsEditor": {
      return {
        equalsValue: `${vacancyLoss.displayVarb("valuePercent")} of rent`,
        makeEditor: (props) => (
          <PeriodicEditor
            {...{
              ...props,
              feId: vacancyLoss.oneChildFeId("valueDollarsEditor"),
              labelInfo: vacancyLoss.periodicVBI("valueDollars"),
              labelProps: { showLabel: false },
              quickViewVarbNames: [
                dollarsQuickAccess[freq],
                ...commonQuickAccess,
              ],
            }}
          />
        ),
      };
    }
  }
}

export function VacancyLossValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "vacancyLossValue", feId } as const;
  const vacancyLoss = useGetterSection(feInfo);
  const { makeEditor, equalsValue } = getProps(vacancyLoss);
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
          ["valuePercentEditor", "Enter percent of rent"],
          ["valueDollarsEditor", "Enter amount"],
        ],
        label: <VarbStringLabel names={feVarbInfo} />,
        equalsValue,
        makeEditor,
      }}
    />
  );
}
