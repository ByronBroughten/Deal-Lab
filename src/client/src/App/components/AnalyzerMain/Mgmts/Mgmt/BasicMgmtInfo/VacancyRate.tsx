import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import {
  FeInfo,
  InfoS,
} from "../../../../../sharedWithServer/SectionsMeta/Info";
import NumObjEditor from "../../../../inputs/NumObjEditor";

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
      feVarbInfo={InfoS.feVarb("vacancyRatePercent", feInfo)}
      endAdornment={`${endAdornment} ${
        dollarsValue.number === "?" ? "" : `(${dollarsVarb.displayVarb()})`
      }`}
    />
  );
}
