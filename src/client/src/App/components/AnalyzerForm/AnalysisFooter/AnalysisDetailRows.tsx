import styled from "styled-components";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { SpecificVarbInfo } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { InVarbInfo } from "../../../sharedWithServer/Analyzer/StateSection/StateVarb";
import { DetailRowVarbFound } from "./AnalysisDetailRows/DetailRowVarbFound";
import { DetailRowVarbNotFound } from "./AnalysisDetailRows/DetailRowVarbNotFound";

export function AnalysisDetailRows({
  focalVarbInfo,
  inVarbInfos,
  level,
}: {
  focalVarbInfo: SpecificVarbInfo;
  inVarbInfos: InVarbInfo[];
  level: number;
}) {
  const { analyzer } = useAnalyzerContext();
  level = level + 1;
  return (
    <Styled>
      {inVarbInfos.map((inInfo) => {
        if ("offset" in inInfo && !analyzer.hasSection(inInfo)) {
          return (
            <DetailRowVarbNotFound
              {...{
                focalVarbInfo,
                level,
                inEntity: inInfo,
                key: inInfo.entityId,
              }}
            />
          );
        } else {
          const inVarb = analyzer.varb(inInfo);
          return (
            <DetailRowVarbFound
              {...{
                varbInfo: inVarb.feVarbInfo,
                key: inVarb.stringFeVarbInfo,
                level,
              }}
            />
          );
        }
      })}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: auto;
  width: 100%;
  .AnalysisDetails-row {
    width: 100%;
  }
`;
