import { ClosingCostValueMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { ListEditorSingleTime } from "../../PropertyGeneral/Property/ValueShared.tsx/ListEditorSingleTime";

type Props = { feId: string; fivePercentLoanDisplay: string };
export function ClosingCostValue({ feId, fivePercentLoanDisplay }: Props) {
  const closingCostValue = useSetterSection({
    sectionName: "closingCostValue",
    feId,
  });
  const valueMode = closingCostValue.value("valueMode") as ClosingCostValueMode;
  const equalsValue =
    valueMode === "fivePercentLoan" ? fivePercentLoanDisplay : undefined;
  return (
    <SelectAndItemizeEditorSection
      {...{
        className: "ClosingCostValue-root",
        label: "Closing Costs",
        // make a note that this does not include Prepaid items
        selectValue: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          closingCostValue.varb("valueMode").updateValue(value);
        },
        editorProps:
          valueMode === "lumpSum"
            ? {
                feVarbInfo: closingCostValue.varbInfo("valueLumpSumEditor"),
                editorType: "equation",
                quickViewVarbNames: ["loanTotalDollars", "numUnits"],
              }
            : undefined,
        menuItems: [
          ["fivePercentLoan", "5% of Base Loan"],
          ["lumpSum", "Enter lump sum"],
          ["itemize", "Itemize"],
        ],
        equalsValue,
        total: closingCostValue.get.varbNext("value").displayVarb(),
        itemizeValue: "itemize",
        itemizedModalTitle: "Closing Costs",
        itemsComponent: (
          <ListEditorSingleTime
            {...{
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
              feId: closingCostValue.oneChildFeId("singleTimeList"),
            }}
          />
        ),
      }}
    />
  );
}
