import { StateValue } from "../../../../../sharedWithServer/sectionVarbsConfig/StateValue";
import { useGetterSection } from "../../../../stateClassHooks/useGetterSection";
import { TimespanEditor } from "../../../inputs/TimespanEditor";
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
  return (
    <FinancingEditorBody {...{ feId, dealMode }}>
      <TimespanEditor
        feId={financing.oneChildFeId("timeTillRefinance")}
        labelInfo={financing.timespanVBI("timeTillRefinance")}
        sx={{
          "& .DraftEditor-root": {
            minWidth: "135px",
          },
        }}
      />
      <FinancingLoans feId={feId} />
    </FinancingEditorBody>
  );
}
