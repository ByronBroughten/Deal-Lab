import { SxProps } from "@mui/material";
import { StateValue } from "../../../../../../../../sharedWithServer/sectionVarbsConfig/StateValue";
import { dealModes } from "../../../../../../../../sharedWithServer/sectionVarbsConfig/StateValue/dealMode";
import { useGetterSection } from "../../../../../../../stateClassHooks/useGetterSection";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "../../ValueShared/ListEditorOneTime";

type Props = { feId: string; dealMode: StateValue<"dealMode">; sx?: SxProps };
export function RepairValue({ feId, dealMode, sx }: Props) {
  const feInfo = { sectionName: "repairValue", feId } as const;
  const repairValue = useGetterSection(feInfo);
  const valueSourceName = repairValue.valueNext("valueSourceName");
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;

  const items: [StateValue<"repairValueSource">, string][] = [
    ["none", "Choose method"],
    ["zero", "Turnkey (no repairs)"],
    ["valueDollarsEditor", "Enter Amount"],
    ["listTotal", "Itemize"],
  ];

  const hasZeroMode = dealModes.filter(
    (mode) => mode === "buyAndHold" || mode === "homeBuyer"
  );

  return (
    <SelectAndItemizeEditor
      {...{
        sx,
        unionValueName: "repairValueSource",
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        label: "Upfront repairs",
        items: items.filter((item) => hasZeroMode || item[0] !== "zero"),
        selectProps: { sx: { minWidth: 160 } },
        makeEditor:
          valueSourceName === "valueDollarsEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    labelProps: { showLabel: false },
                    feVarbInfo: repairValue.varbInfo2("valueDollarsEditor"),
                  }}
                />
              )
            : undefined,
        equalsValue,
        total: repairValue.varbNext("valueDollars").displayVarb(),
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
