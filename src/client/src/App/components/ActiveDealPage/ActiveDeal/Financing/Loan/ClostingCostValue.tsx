import styled from "styled-components";
import { ClosingCostValueMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { FormSection } from "../../../../appWide/FormSection";
import { VarbListSingleTime } from "../../../../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";

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
        selectValue: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          closingCostValue.varb("valueMode").updateValue(value);
        },
        editorVarbInfo:
          valueMode === "lumpSum"
            ? closingCostValue.varbInfo("valueLumpSumEditor")
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
          <VarbListSingleTime
            {...{
              feId: closingCostValue.oneChildFeId("singleTimeList"),
              menuType: "value",
            }}
          />
        ),
      }}
    />
  );
}

const Styled = styled(FormSection)``;
