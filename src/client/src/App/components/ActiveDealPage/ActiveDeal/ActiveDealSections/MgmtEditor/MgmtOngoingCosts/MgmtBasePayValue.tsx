import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { GetterSection } from "../../../../../../sharedWithServer/StateGetters/GetterSection";
import { MakeEditor, SelectEditor } from "../../../../../appWide/SelectEditor";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { PeriodicEditor } from "../../../../../inputs/PeriodicEditor";

function getProps(mgmtBasePay: GetterSection<"mgmtBasePayValue">): {
  equalsValue?: string;
  makeEditor?: MakeEditor;
} {
  const valueSourceName = mgmtBasePay.valueNext("valueSourceName");
  const dollarsVarb = mgmtBasePay.varbNext("valueDollarsMonthly");

  const dollarsEditor = mgmtBasePay.onlyChild("periodicEditor");
  const freq = dollarsEditor.valueNext("valueEditorFrequency");

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
    case "valuePercentEditor":
      return {
        equalsValue: dollarsVarb.displayVarb(),
        makeEditor: (props) => (
          <NumObjEntityEditor
            {...{
              ...props,
              labelProps: { showLabel: false },
              feVarbInfo: mgmtBasePay.varbInfo2("valuePercentEditor"),
              quickViewVarbNames: commonQuickAccess,
            }}
          />
        ),
      };
    case "valueDollarsEditor": {
      return {
        equalsValue: `${mgmtBasePay.displayVarb("valuePercent")} of rent`,
        makeEditor: (props) => (
          <PeriodicEditor
            {...{
              ...props,
              feId: mgmtBasePay.oneChildFeId("periodicEditor"),
              labelInfo: mgmtBasePay.periodicVBI("valueDollars"),
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

export function BasePayValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "mgmtBasePayValue", feId } as const;
  const basePayValue = useGetterSection(feInfo);
  const { makeEditor, equalsValue } = getProps(basePayValue);
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
          ["valuePercentEditor", "Enter percent of rent"],
          ["valueDollarsEditor", "Custom amount"],
        ],
        makeEditor,
        selectValue: valueSourceName,
        equalsValue,
      }}
    />
  );
}
