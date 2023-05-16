import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { FinancingEditorBody } from "./FinancingEditor/FinancingEditorBody";
import { FinancingLoans } from "./FinancingEditor/FinancingLoans";

type Props = {
  feId: string;
  dealMode: StateValue<"dealMode">;
};

export function RefiFinancingEditor({ feId, dealMode }: Props) {
  return (
    <FinancingEditorBody {...{ feId, dealMode }}>
      <FinancingLoans feId={feId} />
    </FinancingEditorBody>
  );
}
