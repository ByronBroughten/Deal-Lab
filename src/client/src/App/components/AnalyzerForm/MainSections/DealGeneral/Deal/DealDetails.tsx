import styled from "styled-components";
import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import theme from "../../../../../theme/Theme";
import { DealDetailRow } from "./DealDetails/DealDetailRow";
import { DetailRowVarbFound } from "./DealDetails/DetailRowVarbFound";

const sectionName = "analysis";
export default function AnalysisDetails({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer } = useAnalyzerContext();
  const level = 0;

  const outputIds = analyzer.childFeIds([feInfo, "output"]);
  const varbInfos = outputIds.map((outputId) =>
    analyzer.outputValues(outputId)
  );

  // at some point, there is a loop.
  // for instance, when I get to a list item, it starts referencing itself.
  // why is that?

  return (
    <Styled className="AnalysisDetails-root">
      {varbInfos.map((varbInfo) => {
        if (analyzer.hasSection(varbInfo))
          return <DetailRowVarbFound {...{ varbInfo, level }} />;
        else
          return (
            <DealDetailRow
              {...{
                level,
                displayName: "Not found",
                displayVarb: "?",
              }}
            />
          );
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
  padding: ${theme.s1};
  .AnalysisDetails-row {
    width: 100%;
  }
`;
