import { StateValue } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectEditor } from "../../../../../../appWide/SelectEditor";
import { VarbStringLabel } from "../../../../../../appWide/VarbStringLabel";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";
import {
  DealMode,
  isDealMode,
} from "./../../../../../../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";

export function MaintenanceValue({
  feId,
  propertyMode,
}: {
  feId: string;
  propertyMode: DealMode;
}) {
  const feInfo = { sectionName: "maintenanceValue", feId } as const;
  const maintenanceValue = useGetterSection(feInfo);
  const editor = maintenanceValue.onlyChild("valueDollarsEditor");
  const freq = editor.valueNext("valueEditorFrequency");

  const valueSourceName = maintenanceValue.valueNext("valueSourceName");
  const valueVarb = maintenanceValue.periodicVarb("valueDollars", freq);

  const showEquals: StateValue<"maintainanceValueSource">[] = [
    "onePercentArvAndSqft",
    "onePercentArv",
    "sqft",
  ];

  const equalsValue = showEquals.includes(valueSourceName)
    ? valueVarb.displayVarb()
    : undefined;

  const onePercentWhat = isDealMode(propertyMode, "hasHolding")
    ? "ARV"
    : "price";
  const menuItems: [StateValue<"maintainanceValueSource">, string][] = [
    ["onePercentArv", `1% ${onePercentWhat}`],
    ["sqft", "$1 per sqft"],
    ["onePercentArvAndSqft", `1% ${onePercentWhat}, $1 sqft, average`],
    ["valueDollarsEditor", "Custom amount"],
  ];

  if (valueSourceName === "none") {
    menuItems.push(["none", "Choose method"]);
  }
  const feVarbInfo = { ...feInfo, varbName: "valueSourceName" } as const;
  return (
    <SelectEditor
      inputMargins
      {...{
        selectProps: {
          sx: { minWidth: 206 },
        },
        feVarbInfo,
        unionValueName: "maintainanceValueSource",
        selectValue: valueSourceName,
        items: menuItems,
        equalsValue,
        label: <VarbStringLabel names={feVarbInfo} />,
        makeEditor:
          valueSourceName === "valueDollarsEditor"
            ? (props) => (
                <PeriodicEditor
                  {...{
                    ...props,
                    feId: maintenanceValue.onlyChildFeId("valueDollarsEditor"),
                    labelInfo: maintenanceValue.periodicVBI("valueDollars"),
                    labelProps: { showLabel: false },
                    quickViewVarbNames: ["sqft", "numUnits", "numBedrooms"],
                  }}
                />
              )
            : undefined,
      }}
    />
  );
}
