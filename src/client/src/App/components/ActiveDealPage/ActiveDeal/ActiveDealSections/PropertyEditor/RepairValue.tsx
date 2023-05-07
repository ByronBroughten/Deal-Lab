import { SxProps } from "@mui/material";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectAndItemizeEditorNext } from "../../../../appWide/SelectAndItemizeEditorNext";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "./ValueShared/ListEditorOneTime";

type Props = { feId: string; dealMode: StateValue<"dealMode">; sx?: SxProps };
export function RepairValue({ feId, dealMode, sx }: Props) {
  const feInfo = { sectionName: "repairValue", feId } as const;
  const repairValue = useGetterSection(feInfo);
  const valueSourceName = repairValue.valueNext("valueSourceName");
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;

  const items: [StateValue<"repairValueSource">, string][] = [
    ["none", "Choose method"],
    ["zero", "Turnkey (no repairs)"],
    ["valueEditor", "Enter lump sum"],
    ["listTotal", "Itemize"],
  ];

  return (
    <SelectAndItemizeEditorNext
      {...{
        sx,
        unionValueName: "repairValueSource",
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        label: "Repair cost",
        items: items.filter(
          (item) => dealMode === "buyAndHold" || item[0] !== "zero"
        ),
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
          <ListEditorOneTime
            {...{
              routeBtnProps: {
                title: "Repair Lists",
                routeName: "repairsListMain",
              },
              menuType: "value",
              feId: repairValue.onlyChild("onetimeList").feId,
            }}
          />
        ),
      }}
    />
  );
}
