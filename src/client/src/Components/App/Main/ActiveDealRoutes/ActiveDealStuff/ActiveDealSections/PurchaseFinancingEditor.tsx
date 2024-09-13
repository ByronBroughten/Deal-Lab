import { useGetterSection } from "../../../../../../modules/stateHooks/useGetterSection";
import { StateValue } from "../../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue";
import { FinancingEditorBody } from "./FinancingEditor/FinancingEditorBody";
import { FinancingLoans } from "./FinancingEditor/FinancingLoans";
import { FinancingMethodSelector } from "./FinancingEditor/FinancingMethodSelector";

type Props = {
  feId: string;
  dealMode: StateValue<"dealMode">;
};

export function PurchaseFinancingEditor({ feId, dealMode }: Props) {
  const financing = useGetterSection({
    sectionName: "financing",
    feId,
  });
  const financingMethod = financing.value("financingMethod");
  return (
    <FinancingEditorBody {...{ feId, dealMode }}>
      <FinancingMethodSelector feId={feId} />
      {financingMethod === "useLoan" && <FinancingLoans feId={feId} />}
    </FinancingEditorBody>
  );
}
