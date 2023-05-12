import { SxProps } from "@mui/material";
import { StateValue } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { StrictExtract } from "../../../../../../../sharedWithServer/utils/types";
import { LabelWithInfo } from "../../../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
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
    case "itemize":
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
  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        sx,
        label: (
          <LabelWithInfo
            {...{
              label: "Selling costs",
              infoTitle: "Selling Costs",
              infoText:
                "Selling costs are the costs associated with selling a property, to pay for things things real estate agents, title fees, broker companies, etc.\n\nThese costs commonly add up to around 5-6% of the price that the property is being sold at.",
            }}
          />
        ),
        selectProps: { sx: { minWidth: 160 } },
        itemizedModalTitle: "Selling costs",
        unionValueName: "sellingCostSource",
        itemizeValue: "itemize",
        items: [
          ["sixPercent", "6% ARV (common)"],
          ["valueDollarsEditor", "Custom amount"],
          ["valuePercentEditor", "Percent of ARV"],
          ["itemize", "Itemize"],
        ],
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
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
