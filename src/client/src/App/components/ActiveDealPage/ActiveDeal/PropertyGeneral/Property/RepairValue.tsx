import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectAndItemizeEditorNext } from "../../../../appWide/SelectAndItemizeEditorNext";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { ListEditorSingleTime } from "./ValueShared.tsx/ListEditorSingleTime";

type Props = { feId: string };
export function RepairValue({ feId }: Props) {
  const feInfo = { sectionName: "repairValue", feId } as const;
  const repairValue = useGetterSection(feInfo);
  const valueSourceName = repairValue.valueNext("valueSourceName");
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;
  return (
    <SelectAndItemizeEditorNext
      {...{
        unionValueName: "repairValueSource",
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        label: "Repair cost base",
        items: [
          ["zero", "Turnkey (no repairs)"],
          ["valueEditor", "Enter lump sum"],
          ["listTotal", "Itemize"],
        ],
        selectProps: { sx: { minWidth: 160 } },
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
