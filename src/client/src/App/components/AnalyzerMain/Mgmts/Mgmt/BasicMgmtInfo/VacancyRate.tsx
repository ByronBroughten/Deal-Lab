import NumObjEditor from "../../../../inputs/NumObjEditor";
import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import {
  FeInfo,
  Inf,
} from "../../../../../sharedWithServer/Analyzer/SectionMetas/Info";

type Props = { feInfo: FeInfo };
export default function VacancyRate({ feInfo }: Props) {
  const { analyzer } = useAnalyzerContext();
  const { endAdornment } = analyzer.feVarb("vacancyRatePercent", feInfo).meta;
  const dollarsVarb = analyzer.feVarb("vacancyLossDollarsMonthly", feInfo);
  const dollarsValue = dollarsVarb.value("numObj");
  return (
    <NumObjEditor
      className="VacancyRate-root"
      label="Vacancy Rate"
      feVarbInfo={Inf.feVarb("vacancyRatePercent", feInfo)}
      endAdornment={`${endAdornment} ${
        dollarsValue.number === "?" ? "" : `(${dollarsVarb.displayVarb()})`
      }`}
    />
  );
}
