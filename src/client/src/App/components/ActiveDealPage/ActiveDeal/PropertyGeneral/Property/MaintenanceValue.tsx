import { MaintenanceValueMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { SelectEditorSection } from "../../../../appWide/SelectEditorSection";

export function MaintenanceValue({ feId }: { feId: string }) {
  const maintenanceValue = useSetterSection({
    sectionName: "maintenanceValue",
    feId,
  });
  const valueMode = maintenanceValue.value("valueMode") as MaintenanceValueMode;
  const valueVarb = maintenanceValue.get.switchVarb("value", "ongoing");
  const showEquals: MaintenanceValueMode[] = [
    "onePercentAndSqft",
    "onePercentPrice",
    "sqft",
  ];

  const equalsValue = showEquals.includes(valueMode)
    ? valueVarb.displayVarb()
    : undefined;

  return (
    <SelectEditorSection
      {...{
        label: "Ongoing Maintenance Budget",
        selectValue: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          maintenanceValue.varb("valueMode").updateValue(value);
        },
        menuItems: [
          ["onePercentPrice", "1% purchase price"],
          ["sqft", "$1 per sqft"],
          ["onePercentAndSqft", "1% purchase price and $1 sqft, average"],
          ["lumpSum", "Custom amount"],
        ],
        equalsValue,
        editorProps:
          valueMode === "lumpSum"
            ? {
                feVarbInfo: maintenanceValue.varbInfo("valueLumpSumEditor"),
                editorType: "equation",
                quickViewVarbNames: ["sqft", "numUnits", "numBedrooms"],
              }
            : undefined,
      }}
    />
  );
}
