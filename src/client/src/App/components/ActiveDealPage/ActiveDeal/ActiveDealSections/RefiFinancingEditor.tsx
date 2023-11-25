import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { FinancingEditorBody } from "./FinancingEditor/FinancingEditorBody";
import { FinancingLoans } from "./FinancingEditor/FinancingLoans";

type Props = {
  feId: string;
  dealMode: StateValue<"dealMode">;
};

export function RefiFinancingEditor({ feId, dealMode }: Props) {
  const financing = useGetterSection({
    sectionName: "financing",
    feId,
  });

  financing.varbInfo("timeTillRefinanceSpanEditor");
  return (
    <FinancingEditorBody {...{ feId, dealMode }}>
      <NumObjEntityEditor
        label="Time till refinance"
        sx={{
          "& .DraftEditor-root": {
            minWidth: "135px",
          },
        }}
        feVarbInfo={financing.varbInfo2("timeTillRefinanceSpanEditor")}
      />
      <FinancingLoans feId={feId} />
    </FinancingEditorBody>
  );
}
