import DualInputsRadioSwap from "../../../../general/DualInputsRadioSwap";
import { FormControl } from "@material-ui/core";
import StandardLabel from "../../../../general/StandardLabel";
import NumObjEditor from "../../../../inputs/NumObjEditor";
import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import {
  FeInfo,
  Inf,
} from "../../../../../sharedWithServer/Analyzer/SectionMetas/Info";

type Props = { feInfo: FeInfo };
export default function VacancyRate({ feInfo }: Props) {
  const { analyzer } = useAnalyzerContext();
  const dollarsVarb = analyzer.feVarb("vacancyLossDollarsMonthly", feInfo);
  return (
    <DualInputsRadioSwap>
      <FormControl component="fieldset" className="labeled-input-group-part">
        <StandardLabel>Vacancy rate</StandardLabel>
        <div className="swappable-editors">
          <NumObjEditor
            className="vacancy-rate-percent"
            feVarbInfo={Inf.feVarb("vacancyRatePercent", feInfo)}
            labeled={false}
          />
          {dollarsVarb.value("numObj").number !== "?" && (
            <div className="dependent">
              <span className="equals">(</span>
              {dollarsVarb.displayVarb()}
              <span className="equals">)</span>
            </div>
          )}
        </div>
      </FormControl>
    </DualInputsRadioSwap>
  );
}
