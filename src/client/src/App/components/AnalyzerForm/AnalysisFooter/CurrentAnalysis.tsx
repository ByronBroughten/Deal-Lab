import useToggle from "../../../modules/customHooks/useToggle";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import AnalysisDetails from "./AnalysisDetails";
import AnalysisTitleRow from "./AnalysisTitleRow";
import AnalysisBasics from "./AnalysisBasics";
import styled, { css } from "styled-components";
import theme from "../../../theme/Theme";
import MainSectionEntry from "../../appWide/MainSection/MainSectionEntry";

type Props = { className?: string };

export default function CurrentAnalysis({ className }: Props) {
  const { analyzer } = useAnalyzerContext();
  const { feId } = analyzer.firstSection("analysis");

  const { value: showDetails, toggle: toggleDetails } = useToggle();

  return (
    <Styled
      {...{
        $showDetails: showDetails,
        sectionName: "analysis",
        className: `CurrentAnalysis-root ${className}`,
      }}
    >
      <div {...{ showDetails, className: "CurrentAnalysis-viewable" }}>
        <AnalysisTitleRow {...{ id: feId, showDetails, toggleDetails }} />
        {!showDetails && <AnalysisBasics id={feId} />}
        {showDetails && <AnalysisDetails id={feId} />}
      </div>
    </Styled>
  );
}

const Styled = styled(MainSectionEntry)<{ $showDetails: boolean }>`
  padding: 0;
  .CurrentAnalysis-viewable {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    padding: ${theme.s2};
    padding-left: ${theme.s3};
    background: ${theme.plus.light};
    border-top: 2px solid ${theme.plus.border};
    border-radius: ${theme.br1};
    box-shadow: ${theme.boxShadow4};

    .btn-save-section-obj {
      margin-left: ${theme.s3};
    }
  }

  ${({ $showDetails }) =>
    $showDetails &&
    css`
      overflow: auto;
    `}
`;
