import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { validateStateValue } from "../../../../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { ListEditorSingleTime } from "./ValueShared.tsx/ListEditorSingleTime";

type Props = { feId: string };
export function RepairValue({ feId }: Props) {
  const feInfo = { sectionName: "repairValue", feId } as const;
  const updateValue = useAction("updateValue");
  const repairValue = useGetterSection(feInfo);
  const valueSourceName = repairValue.valueNext("valueSourceName");
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;

  const menuItems: [StateValue<"repairValueSource">, string][] = [
    ["zero", "Turnkey (no repairs)"],
    ["valueEditor", "Enter lump sum"],
    ["listTotal", "Itemize"],
  ];

  return (
    <SelectAndItemizeEditorSection
      {...{
        label: "Upfront Repair Costs",
        menuItems,
        selectValue: valueSourceName,
        onChange: (e) => {
          updateValue({
            ...feInfo,
            varbName: "valueSourceName",
            value: validateStateValue(e.target.value, "repairValueSource"),
          });
        },
        makeEditor:
          valueSourceName === "valueEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: repairValue.varbInfo("valueDollarsEditor"),
                  }}
                />
              )
            : undefined,
        equalsValue,
        total: repairValue.varbNext("value").displayVarb(),
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
