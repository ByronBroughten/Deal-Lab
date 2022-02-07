import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import LabeledVarb from "./LabeledVarb";

const sectionName = "output";
export function LabeledVarbOutput({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer, handleRemoveSection } = useAnalyzerContext();

  const multiVarbInfo = analyzer.outputValues(id);
  const varb = analyzer.findVarb(multiVarbInfo);
  const feVarbInfo = varb ? varb.feVarbInfo : undefined;
  return (
    <LabeledVarb
      id={id}
      feVarbInfo={feVarbInfo}
      onXBtnClick={() => handleRemoveSection(feInfo)}
    />
  );
}
