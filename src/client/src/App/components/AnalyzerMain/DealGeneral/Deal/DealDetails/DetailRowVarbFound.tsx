import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import { SpecificVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { DealDetailRow } from "./DealDetailRow";

type Props = { varbInfo: SpecificVarbInfo; level: number };
export function DetailRowVarbFound({ varbInfo, level }: Props) {
  const { analyzer } = useAnalyzerContext();
  const varb = analyzer.varb(varbInfo);
  const { solvableText, number } = varb.value("numObj");
  const inVarbInfos = analyzer.inVarbInfos(varbInfo);

  return (
    <DealDetailRow
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
