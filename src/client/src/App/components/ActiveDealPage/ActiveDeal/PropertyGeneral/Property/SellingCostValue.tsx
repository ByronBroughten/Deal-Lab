import { SxProps } from "@mui/material";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { StrictExtract } from "../../../../../sharedWithServer/utils/types";
import { SelectAndItemizeEditorNext } from "../../../../appWide/SelectAndItemizeEditorNext";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { ListEditorSingleTime } from "./ValueShared.tsx/ListEditorSingleTime";

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
    <SelectAndItemizeEditorNext
      {...{
        sx,
        label: "Selling costs",
        selectProps: { sx: { minWidth: 160 } },
        itemizedModalTitle: "Selling costs",
        unionValueName: "sellingCostSource",
        itemizeValue: "itemize",
        items: [
          ["sixPercent", "6% (common)"],
          ["valueDollarsEditor", "Dollar amount"],
          ["valuePercentEditor", "Percent"],
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
          <ListEditorSingleTime
            {...{
              routeBtnProps: {
                title: "Selling cost lists",
                routeName: "sellingListMain",
              },
              menuType: "value",
              feId: sellingCost.onlyChild("singleTimeList").feId,
            }}
          />
        ),
      }}
    />
  );
}
