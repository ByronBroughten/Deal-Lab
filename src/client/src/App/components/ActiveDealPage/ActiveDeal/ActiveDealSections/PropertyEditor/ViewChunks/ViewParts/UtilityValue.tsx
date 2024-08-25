import { periodicName } from "../../../../../../../../sharedWithServer/stateSchemas/GroupName";
import { StateValue } from "../../../../../../../../sharedWithServer/stateSchemas/StateValue";
import { DealMode } from "../../../../../../../../sharedWithServer/stateSchemas/StateValue/dealMode";
import { PeriodicMode } from "../../../../../../../../sharedWithServer/stateSchemas/StateValue/unionValues";
import { useGetterSection } from "../../../../../../../stateClassHooks/useGetterSection";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";
import { PeriodicList } from "../../ValueShared/PeriodicList";
import { MuiSelectItems } from "./../../../../../../appWide/MuiSelect";

function getItems(
  dealMode: DealMode,
  periodicMode: PeriodicMode,
  valueSourceName: StateValue<"utilityValueSource">
): MuiSelectItems<"utilityValueSource"> {
  const itemizeLabel = `Itemize${
    valueSourceName === "listTotal" ? "" : " (recommended)"
  }`;
  if (dealMode === "homeBuyer") {
    return [
      ["zero", "Choose method"],
      ["listTotal", itemizeLabel],
      ["threeHundredPerUnit", "$300 per month"],
      ["valueDollarsEditor", "Custom amount"],
    ];
  } else if (periodicMode === "holding") {
    return [
      ["zero", "None"],
      ["listTotal", itemizeLabel],
      ["threeHundredPerUnit", "$300 per unit per month"],
      ["valueDollarsEditor", "Custom amount"],
    ];
  } else {
    return [
      ["zero", "Tenant pays all utilities"],
      ["listTotal", itemizeLabel],
      ["threeHundredPerUnit", "Three hundred per unit"],
      ["valueDollarsEditor", "Custom amount"],
    ];
  }
}

type Props = {
  feId: string;
  propertyMode: DealMode;
  periodicMode: PeriodicMode;
};
export function UtilityValue({ feId, propertyMode, periodicMode }: Props) {
  const feInfo = { sectionName: "utilityValue", feId } as const;
  const utilityValue = useGetterSection(feInfo);
  const editor = utilityValue.onlyChild("valueDollarsEditor");
  const freq = editor.valueNext("valueEditorFrequency");

  const valueSourceName = utilityValue.valueNext("valueSourceName");

  const valueVarb = utilityValue.varbNext(periodicName("valueDollars", freq));
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;
  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        selectProps: { sx: { minWidth: 170 } },
        unionValueName: "utilityValueSource",
        label: "Utilities",
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        items: getItems(propertyMode, periodicMode, valueSourceName),

        ...(valueSourceName === "valueDollarsEditor" && {
          makeEditor: (props) => (
            <PeriodicEditor
              {...{
                ...props,
                feId: utilityValue.onlyChildFeId("valueDollarsEditor"),
                labelInfo: utilityValue.periodicVBI("valueDollars"),
                labelProps: { showLabel: false },
              }}
            />
          ),
        }),
        equalsValue,
        itemizedModalTitle: "Utilities",
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <PeriodicList
            {...{
              feId: utilityValue.oneChildFeId("periodicList"),
              menuType: "value",
              routeBtnProps: {
                title: "Utility Lists",
                routeName: "utilitiesListMain",
              },
              menuDisplayNames: [
                "Water/sewer",
                "Garbage",
                "Natural gas",
                "Electricity",
              ],
            }}
          />
        ),
      }}
    />
  );
}
