import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { SpecificVarbInfo } from "../../../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { AnalysisDetailRow } from "./AnalysisDetailRow";

type Props = { varbInfo: SpecificVarbInfo; level: number };
export function DetailRowVarbFound({ varbInfo, level }: Props) {
  const { analyzer } = useAnalyzerContext();
  const varb = analyzer.varb(varbInfo);
  const { solvableText, number } = varb.value("numObj");
  const inVarbInfos = analyzer.inVarbInfos(varbInfo);

  return (
    <AnalysisDetailRow
      {...{
        displayName: analyzer.displayName(varbInfo),
        displayVarb: varb.displayVarb(),
        solvableText: solvableText === `${number}` ? undefined : solvableText,
        inVarbInfos: inVarbInfos.filter(
          (info) => analyzer.findVarb(info)?.meta.type === "numObj"
        ),
        varbInfo,
        level,
      }}
    />
  );
}
