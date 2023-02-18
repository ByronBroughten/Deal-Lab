import { RepairValueMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { ListEditorSingleTime } from "./ValueShared.tsx/ListEditorSingleTime";

type Props = { feId: string };
export function RepairValue({ feId }: Props) {
  const repairValue = useSetterSection({
    sectionName: "repairValue",
    feId,
  });
  const valueMode = repairValue.value("valueMode") as RepairValueMode;
  const equalsValue = valueMode === "turnkey" ? "$0" : undefined;
  return (
    <SelectAndItemizeEditorSection
      {...{
        label: "Upfront Repair Costs",
        selectValue: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          repairValue.varb("valueMode").updateValue(value);
        },
        editorProps:
          valueMode === "lumpSum"
            ? {
                feVarbInfo: repairValue.varbInfo("valueLumpSumEditor"),
                editorType: "equation",
              }
            : undefined,
        menuItems: [
          ["turnkey", "Turnkey (no repairs)"],
          ["lumpSum", "Enter lump sum"],
          ["itemize", "Itemize"],
        ],
        equalsValue,
        total: repairValue.get.varbNext("value").displayVarb(),
        itemizeValue: "itemize",
        itemizedModalTitle: "Repairs",
        itemsComponent: (
          <ListEditorSingleTime
            {...{
              menuType: "value",
              feId: repairValue.onlyChild("singleTimeList").feId,
            }}
          />
        ),
      }}
    />
  );
}
