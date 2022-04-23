import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import { InEntity } from "../../../../../sharedWithServer/SectionMetas/baseSections/baseValues/entities";
import { SpecificVarbInfo } from "../../../../../sharedWithServer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { DealDetailRow } from "./DealDetailRow";

type Props = {
  level: number;
  focalVarbInfo: SpecificVarbInfo;
  inEntity: InEntity;
};
export function DetailRowVarbNotFound({
  level,
  focalVarbInfo,
  inEntity,
}: Props) {
  const { analyzer } = useAnalyzerContext();
  const { editorText } = analyzer.value(focalVarbInfo, "numObj");

  const { length, offset } = inEntity;
  const displayName = editorText.substring(offset, offset + length);
  return (
    <DealDetailRow
      {...{
        level,
        displayName,
        displayVarb: "?",
      }}
    />
  );
}
