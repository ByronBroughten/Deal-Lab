import { validateStateValue } from "../../../../../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectAndItemizeEditorSection } from "../../../../../appWide/SelectAndItemizeEditorSection";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { ListEditorSingleTime } from "../../PropertyEditor/ValueShared.tsx/ListEditorSingleTime";

type Props = { feId: string; fivePercentLoanDisplay: string };
export function ClosingCostValue({ feId, fivePercentLoanDisplay }: Props) {
  const updateValue = useAction("updateValue");
  const feInfo = { sectionName: "closingCostValue", feId } as const;

  const closingCostValue = useGetterSection({
    sectionName: "closingCostValue",
    feId,
  });
  const valueSourceName = closingCostValue.valueNext("valueSourceName");
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
          updateValue({
            ...feInfo,
            varbName: "valueSourceName",
            value: validateStateValue(e.target.value, "closingCostValueSource"),
          });
        },
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
        menuItems: [
          ["fivePercentLoan", "5% of Base Loan"],
          ["valueEditor", "Enter lump sum"],
          ["listTotal", "Itemize"],
        ],
        equalsValue,
        total: closingCostValue.varbNext("value").displayVarb(),
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
