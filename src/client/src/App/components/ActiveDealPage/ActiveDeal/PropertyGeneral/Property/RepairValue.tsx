import { RepairValueMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { ListEditorSingleTime } from "./ValueShared.tsx/ListEditorSingleTime";

type Props = { feId: string };
export function RepairValue({ feId }: Props) {
  const repairValue = useSetterSection({
    sectionName: "repairValue",
    feId,
  });
  const valueSourceName = repairValue.value(
    "valueSourceName"
  ) as RepairValueMode;
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;
  return (
    <SelectAndItemizeEditorSection
      {...{
        label: "Upfront Repair Costs",
        selectValue: valueSourceName,
        onChange: (e) => {
          const value = e.target.value as string;
          repairValue.varb("valueSourceName").updateValue(value);
        },
        editorProps:
          valueSourceName === "valueEditor"
            ? {
                feVarbInfo: repairValue.varbInfo("valueLumpSumEditor"),
                editorType: "equation",
              }
            : undefined,
        menuItems: [
          ["zero", "Turnkey (no repairs)"],
          ["valueEditor", "Enter lump sum"],
          ["listTotal", "Itemize"],
        ],
        equalsValue,
        total: repairValue.get.varbNext("value").displayVarb(),
        itemizeValue: "listTotal",
        itemizedModalTitle: "Repairs",
        itemsComponent: (
          <ListEditorSingleTime
            {...{
              routeBtnProps: {
                title: "Repair Lists",
                routeName: "repairsListMain",
              },
              menuType: "value",
              feId: repairValue.onlyChild("singleTimeList").feId,
            }}
          />
        ),
      }}
    />
  );
}
