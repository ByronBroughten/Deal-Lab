import styled from "styled-components";
import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import theme from "../../../../theme/Theme";
import { DealDetailRow } from "./DealDetails/DealDetailRow";
import { DetailRowVarbFound } from "./DealDetails/DetailRowVarbFound";

export default function DealDetails({ id }: { id: string }) {
  const { analyzer } = useAnalyzerContext();
  const level = 0;

  const section = analyzer.section("dealOutputList");
  const outputIds = section.childFeIds("output");
  const varbInfos = outputIds.map((outputId) =>
    analyzer.outputValues(outputId)
  );

  return (
    <Styled className="DealDetails-root">
      <div className="DealDetails-allRows">
        {varbInfos.map((varbInfo) => {
          if (analyzer.hasSection(varbInfo))
            return (
              <DetailRowVarbFound
                key={varbInfo.varbName}
                {...{ varbInfo, level }}
              />
            );
          else
            return (
              <DealDetailRow
                key={varbInfo.varbName}
                {...{
                  level,
                  displayName: "Not found",
                  displayVarb: "?",
                }}
              />
            );
        })}
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  padding: ${theme.s2};
  .DealDetails-allRows {
    box-shadow: ${theme.boxShadow1};
  }
`;
