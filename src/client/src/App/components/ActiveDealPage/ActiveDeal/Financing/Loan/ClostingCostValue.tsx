import { ClosingCostValueMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { ListEditorSingleTime } from "../../PropertyGeneral/Property/ValueShared.tsx/ListEditorSingleTime";

type Props = { feId: string; fivePercentLoanDisplay: string };
export function ClosingCostValue({ feId, fivePercentLoanDisplay }: Props) {
  const closingCostValue = useSetterSection({
    sectionName: "closingCostValue",
    feId,
  });
  const valueSourceName = closingCostValue.value(
    "valueSourceName"
  ) as ClosingCostValueMode;
  const equalsValue =
    valueSourceName === "fivePercentLoan" ? fivePercentLoanDisplay : undefined;
  return (
    <SelectAndItemizeEditorSection
      {...{
        className: "ClosingCostValue-root",
        label: "Closing Costs",
        // make a note that this does not include Prepaid items
        selectValue: valueSourceName,
        onChange: (e) => {
          const value = e.target.value as string;
          closingCostValue.varb("valueSourceName").updateValue(value);
        },
        editorProps:
          valueSourceName === "valueEditor"
            ? {
                feVarbInfo: closingCostValue.varbInfo("valueLumpSumEditor"),
                editorType: "equation",
                quickViewVarbNames: ["loanTotalDollars", "numUnits"],
              }
            : undefined,
        menuItems: [
          ["fivePercentLoan", "5% of Base Loan"],
          ["valueEditor", "Enter lump sum"],
          ["listTotal", "Itemize"],
        ],
        equalsValue,
        total: closingCostValue.get.varbNext("value").displayVarb(),
        itemizeValue: "listTotal",
        itemizedModalTitle: "Closing Costs",
        itemsComponent: (
          <ListEditorSingleTime
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
              feId: closingCostValue.oneChildFeId("singleTimeList"),
            }}
          />
        ),
      }}
    />
  );
}
