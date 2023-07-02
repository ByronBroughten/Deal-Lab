import { StateValue } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectEditor } from "../../../../../../appWide/SelectEditor";
import { VarbStringLabel } from "../../../../../../appWide/VarbStringLabel";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";

export function MaintenanceValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "maintenanceValue", feId } as const;
  const maintenanceValue = useGetterSection(feInfo);
  const valueSourceName = maintenanceValue.valueNext("valueSourceName");
  const valueVarb = maintenanceValue.switchVarb("valueDollars", "periodic");
  const showEquals: StateValue<"maintainanceValueSource">[] = [
    "onePercentAndSqft",
    "onePercentPrice",
    "sqft",
  ];

  const equalsValue = showEquals.includes(valueSourceName)
    ? valueVarb.displayVarb()
    : undefined;

  const menuItems: [StateValue<"maintainanceValueSource">, string][] = [
    ["onePercentPrice", "1% purchase price"],
    ["sqft", "$1 per sqft"],
    ["onePercentAndSqft", "1% purchase price and $1 sqft, average"],
    ["valueDollarsPeriodicEditor", "Custom amount"],
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
          valueSourceName === "valueDollarsPeriodicEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: maintenanceValue.varbInfo(
                      "valueDollarsPeriodicEditor"
                    ),
                    quickViewVarbNames: ["sqft", "numUnits", "numBedrooms"],
                  }}
                />
              )
            : undefined,
      }}
    />
  );
}
