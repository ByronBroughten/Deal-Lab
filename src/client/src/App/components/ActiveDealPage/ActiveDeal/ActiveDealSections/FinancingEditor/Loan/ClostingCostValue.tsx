import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditor } from "../../../../../appWide/SelectAndItemizeEditor";
import { VarbLabel } from "../../../../../appWide/VarbLabel";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "../../PropertyEditor/ValueShared/ListEditorOneTime";

type Props = { feId: string; fivePercentLoanDisplay: string };
export function ClosingCostValue({ feId, fivePercentLoanDisplay }: Props) {
  const feInfo = { sectionName: "closingCostValue", feId } as const;
  const closingCostValue = useGetterSection({
    sectionName: "closingCostValue",
    feId,
  });
  const valueSourceName = closingCostValue.valueNext("valueSourceName");
  const equalsValue =
    valueSourceName === "fivePercentLoan" ? fivePercentLoanDisplay : undefined;
  const feVarbInfo = { ...feInfo, varbName: "valueSourceName" } as const;
  return (
    <SelectAndItemizeEditor
      {...{
        sx: { pt: nativeTheme.editorMargins.my },
        selectProps: { sx: { minWidth: 140 } },
        feVarbInfo,
        unionValueName: "closingCostValueSource",
        label: <VarbLabel names={feVarbInfo} />,
        makeEditor:
          valueSourceName === "valueDollarsEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: closingCostValue.varbInfo("valueDollarsEditor"),
                    quickViewVarbNames: ["numUnits"],
                  }}
                />
              )
            : undefined,
        items: [
          ["fivePercentLoan", "5% of Base Loan"],
          ["valueDollarsEditor", "Enter lump sum"],
          ["listTotal", "Itemize"],
        ],
        equalsValue,
        total: closingCostValue.varbNext("value").displayVarb(),
        itemizeValue: "listTotal",
        itemizedModalTitle: "Closing Costs",
        itemsComponent: (
          <ListEditorOneTime
            {...{
              routeBtnProps: {
                title: "Closing Cost Lists",
                routeName: "closingCostsListMain",
              },
              menuDisplayNames: [
                "Appraisal",
                "Credit report",
                "Discount points",
                "Flood Certification",
                "Government fees",
                "Processing fees",
                "Title fees",
                "Underwriting fees",
              ],
              menuType: "value",
              feId: closingCostValue.oneChildFeId("onetimeList"),
            }}
          />
        ),
      }}
    />
  );
}
