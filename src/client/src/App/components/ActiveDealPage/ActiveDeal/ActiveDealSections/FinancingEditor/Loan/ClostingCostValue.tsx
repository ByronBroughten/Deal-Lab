import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { LabelWithInfo } from "../../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditorNext } from "../../../../../appWide/SelectAndItemizeEditorNext";
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
  return (
    <SelectAndItemizeEditorNext
      {...{
        sx: { pt: nativeTheme.editorMargins.my },
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        unionValueName: "closingCostValueSource",
        label: (
          <LabelWithInfo
            {...{
              label: "Closing costs",
              infoText: `Most loans require that the borrower pay a number of one-time fees—appraisal fees, title fees, government fees. Collectively, these fees are called closing costs.\n\nNote that closing costs don't include prepaid or escrow costs, such as prepaid home insurance or taxes.`,
            }}
          />
        ),
        makeEditor:
          valueSourceName === "valueEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: closingCostValue.varbInfo("valueDollarsEditor"),
                    quickViewVarbNames: ["loanTotalDollars", "numUnits"],
                  }}
                />
              )
            : undefined,
        items: [
          ["fivePercentLoan", "5% of Base Loan"],
          ["valueEditor", "Enter lump sum"],
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
