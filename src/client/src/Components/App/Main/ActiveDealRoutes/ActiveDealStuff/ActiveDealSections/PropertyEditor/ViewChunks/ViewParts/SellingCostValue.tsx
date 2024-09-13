import { SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../../../../../modules/stateHooks/useGetterSection";
import { StateValue } from "../../../../../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue";
import { StrictExtract } from "../../../../../../../../../sharedWithServer/utils/types";
import { SelectAndItemizeEditor } from "../../../../../../../appWide/SelectAndItemizeEditor";
import { VarbStringLabel } from "../../../../../../../appWide/VarbStringLabel";
import { NumObjEntityEditor } from "../../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "../../ValueShared/ListEditorOneTime";

function isEditorSource(
  value: any
): value is StrictExtract<
  StateValue<"sellingCostSource">,
  "valueDollarsEditor" | "valuePercentEditor"
> {
  return ["valueDollarsEditor", "valuePercentEditor"].includes(value);
}

function getEqualsVarbName(
  valueSource: StateValue<"sellingCostSource">
): "valuePercent" | "valueDollars" | null {
  switch (valueSource) {
    case "listTotal":
      return null;
    case "valueDollarsEditor":
      return "valuePercent";
    default:
      return "valueDollars";
  }
}

type Props = { feId: string; sx?: SxProps };
export function SellingCostValue({ feId, sx }: Props) {
  const feInfo = { sectionName: "sellingCostValue", feId } as const;
  const sellingCost = useGetterSection(feInfo);
  const valueSource = sellingCost.valueNext("valueSourceName");
  const equalsVarbName = getEqualsVarbName(valueSource);
  const feVarbInfo = { ...feInfo, varbName: "valueSourceName" } as const;
  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        sx,
        feVarbInfo,
        label: (
          <VarbStringLabel sx={{ marginBottom: "1px" }} names={feVarbInfo} />
        ),
        selectProps: { sx: { minWidth: 160 } },
        itemizedModalTitle: "Selling costs",
        unionValueName: "sellingCostSource",
        itemizeValue: "listTotal",
        items: [
          ["sixPercent", "6% ARV (common)"],
          ["valueDollarsEditor", "Custom amount"],
          ["valuePercentEditor", "Percent of ARV"],
          ["listTotal", "Itemize"],
        ],
        equalsValue: equalsVarbName
          ? sellingCost.displayVarb(equalsVarbName)
          : undefined,
        makeEditor: isEditorSource(valueSource)
          ? (props) => (
              <NumObjEntityEditor
                {...{
                  ...props,
                  feVarbInfo: {
                    ...feInfo,
                    varbName: valueSource,
                  },
                }}
              />
            )
          : undefined,
        total: sellingCost.varbNext("valueDollars").displayVarb(),
        itemsComponent: (
          <ListEditorOneTime
            {...{
              routeBtnProps: {
                title: "Selling cost lists",
                routeName: "sellingListMain",
              },
              menuType: "value",
              feId: sellingCost.onlyChild("onetimeList").feId,
            }}
          />
        ),
      }}
    />
  );
}
