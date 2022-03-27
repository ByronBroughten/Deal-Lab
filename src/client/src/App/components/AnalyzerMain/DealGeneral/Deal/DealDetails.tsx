import styled from "styled-components";
import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import theme from "../../../../theme/Theme";
import { DealDetailRow } from "./DealDetails/DealDetailRow";
import { DetailRowVarbFound } from "./DealDetails/DetailRowVarbFound";

const sectionName = "analysis";
export default function AnalysisDetails({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer } = useAnalyzerContext();
  const level = 0;

  const section = analyzer.section(feInfo);
  const outputIds = section.childFeIds("output");
  const varbInfos = outputIds.map((outputId) =>
    analyzer.outputValues(outputId)
  );

  // at some point, there is a loop.
  // for instance, when I get to a list item, it starts referencing itself.
  // why is that?

  return (
    <Styled className="DealDetails-root">
      <div className="DealDetails-allRows">
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
