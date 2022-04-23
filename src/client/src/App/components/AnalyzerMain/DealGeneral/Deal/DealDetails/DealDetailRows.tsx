import styled from "styled-components";
import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import { InVarbInfo } from "../../../../../sharedWithServer/Analyzer/StateSection/StateVarb";
import { SpecificVarbInfo } from "../../../../../sharedWithServer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { DetailRowVarbFound } from "./DetailRowVarbFound";
import { DetailRowVarbNotFound } from "./DetailRowVarbNotFound";

export function DealDetailRows({
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
    <Styled className="DealDetailRows-root">
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

const Styled = styled.div``;
