import { useGetterSection } from "../../../../../../stateClassHooks/useGetterSection";
import { FormSectionNext } from "../../../../../appWide/FormSectionNext";
import { ClosingCostValue } from "./ClosingCostValue";

type Props = { feId: string };
export function LoanCosts({ feId }: Props) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;
  const loan = useGetterSection(feInfo);
  return (
    <FormSectionNext label="Other Costs">
      <ClosingCostValue
        {...{
          feId: loan.onlyChildFeId("closingCostValue"),
          fivePercentLoanDisplay: loan
            .varbNext("fivePercentBaseLoan")
            .displayVarb(),
        }}
      />
    </FormSectionNext>
  );
}
