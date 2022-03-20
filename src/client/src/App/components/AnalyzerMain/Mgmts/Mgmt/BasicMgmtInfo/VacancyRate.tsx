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
  const displayDollars = analyzer.displayVarb(
    "vacancyLossDollarsMonthly",
    feInfo
  );
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
          <div className="dependent">
            <span className="equals">=</span>
            {displayDollars}
          </div>
        </div>
      </FormControl>
    </DualInputsRadioSwap>
  );
}
