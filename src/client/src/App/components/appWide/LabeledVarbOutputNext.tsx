import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import LabeledVarb from "./LabeledVarb";
import LabeledVarbNext from "./LabeledVarbNext";

const sectionName = "output";
export function LabeledVarbOutputNext({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer, handleRemoveSection } = useAnalyzerContext();

  const multiVarbInfo = analyzer.outputValues(id);
  const varb = analyzer.findVarb(multiVarbInfo);
  const feVarbInfo = varb ? varb.feVarbInfo : undefined;
  return (
    <LabeledVarbNext
      id={id}
      feVarbInfo={feVarbInfo}
      onXBtnClick={() => handleRemoveSection(feInfo)}
    />
  );
}
