import useToggle from "../../../modules/customHooks/useToggle";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import AnalysisDetails from "./AnalysisDetails";
import AnalysisTitleRow from "./AnalysisTitleRow";
import AnalysisBasics from "./AnalysisBasics";
import styled, { css } from "styled-components";
import theme from "../../../theme/Theme";
import MainSectionEntry from "../../appWide/MainSection/MainSectionEntry";
import MainSectionTitle from "../../appWide/MainSection/MainSectionTitle";
import SectionBtn from "../../appWide/SectionBtn";
import MainSectionTitleBtn from "../../appWide/MainSection/MainSectionTitle/MainSectionTitleBtn";

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
      <MainSectionTitle title="Deal" sectionName="analysis">
        {/* <MainSectionTitleBtn>Show Details</MainSectionTitleBtn> */}
      </MainSectionTitle>
      <div {...{ className: "CurrentAnalysis-viewable" }}>
        <AnalysisTitleRow {...{ id: feId, showDetails, toggleDetails }} />
        {!showDetails && <AnalysisBasics id={feId} />}
        {showDetails && <AnalysisDetails id={feId} />}
      </div>
    </Styled>
  );
}

const Styled = styled(MainSectionEntry)<{ $showDetails: boolean }>`
  position: relative;
  z-index: 1

  .AnalysisBasics-root {
    position: relative;
    z-index: 0;
  }

  padding: 0;

  .CurrentAnalysis-viewable {
    background: ${theme.plus.light};
    padding: ${theme.s2};
  }
  /* .CurrentAnalysis-viewable {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    
    
    
    border-radius: ${theme.br1};
    /* border-top: 2px solid ${theme.plus.border}; */
    /* box-shadow: ${theme.boxShadow4}; */
  } */
  .MainSectionTitle-root {
    box-shadow: ${theme.boxShadow1};
  }

  ${({ $showDetails }) =>
    $showDetails &&
    css`
      overflow: auto;
    `}
`;
