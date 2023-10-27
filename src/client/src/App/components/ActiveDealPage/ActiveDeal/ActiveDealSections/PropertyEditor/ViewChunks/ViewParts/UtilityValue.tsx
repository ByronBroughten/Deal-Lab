import { StateValue } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { DealMode } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { PeriodicMode } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOngoing } from "../../ValueShared/ListEditorOngoing";
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
      ["threeHundredPerUnit", "$300 per month"],
      ["valueDollarsPeriodicEditor", "Custom amount"],
      ["listTotal", itemizeLabel],
    ];
  } else if (periodicMode === "holding") {
    return [
      ["zero", "None"],
      ["threeHundredPerUnit", "$300 per unit per month"],
      ["valueDollarsPeriodicEditor", "Custom amount"],
      ["listTotal", itemizeLabel],
    ];
  } else {
    return [
      ["zero", "Tenant pays all utilities"],
      ["threeHundredPerUnit", "Three hundred per unit"],
      ["valueDollarsPeriodicEditor", "Custom amount"],
      ["listTotal", itemizeLabel],
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
  const valueSourceName = utilityValue.valueNext("valueSourceName");
  const valueVarb = utilityValue.switchVarb("valueDollars", "periodic");
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

        ...(valueSourceName === "valueDollarsPeriodicEditor" && {
          makeEditor: (props) => (
            <NumObjEntityEditor
              {...{
                ...props,
                feVarbInfo: utilityValue.varbInfo("valueDollarsPeriodicEditor"),
              }}
            />
          ),
        }),
        equalsValue,
        itemizedModalTitle: "Utilities",
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <ListEditorOngoing
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
