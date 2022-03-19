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
import MainEntryTitleRow from "../../appWide/MainSection/MainSectionEntry/MainEntryTitleRow";
import Deal from "./Deal";
import MainSection from "../../appWide/MainSection";
import useToggleView from "../../../modules/customHooks/useToggleView";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { auth } from "../../../modules/services/authService";

type Props = { className?: string };

export default function CurrentAnalysis({ className }: Props) {
  const { analyzer } = useAnalyzerContext();
  const { feId } = analyzer.firstSection("analysis");
  const { detailsIsOpen, toggleDetails } = useToggleView({
    initValue: false,
    viewWhat: "details",
  });
  return (
    <Styled
      {...{
        $showDetails: detailsIsOpen,
        sectionName: "analysis",
        className: `DealGeneral-root ${className}`,
      }}
    >
      <MainSectionTitle title="Deal" sectionName="analysis">
        <div className="MainSectionTitle-children">
          <MainSectionTitleBtn
            themeName="analysis"
            className="MainSectionTitle-child"
            onClick={toggleDetails}
          >
            {detailsIsOpen ? "Hide Details" : "Show Details"}
          </MainSectionTitleBtn>
          {/* // disable the link */}
          <Link className="MainSectionTitle-dealsLink" to="/deals">
            <MainSectionTitleBtn
              themeName="analysis"
              className="MainSectionTitle-child"
              // disabled={!auth.isLoggedIn}
            >
              {"Compare Deals"}
              <GoArrowRight className="MainSectionTitle-goArrow" />
            </MainSectionTitleBtn>
          </Link>
        </div>
      </MainSectionTitle>
      <Deal {...{ feId, detailsIsOpen }} />
    </Styled>
  );
}

const Styled = styled(MainSection)<{ $showDetails: boolean }>`
  .MainSectionTitle-children {
    display: flex;
    height: 100%;
    align-items: center;
    width: 50%;
  }

  .MainSectionTitle-dealsLink {
    text-decoration: none;
    height: inherit;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .MainSectionTitle-child {
    margin: 0 ${theme.s1};
    width: 100%;
  }
  // properly disable compare deals for when you're logged out
  // make Deal stick to the bottom again

  .MainSectionTitle-goArrow {
    font-size: 1.2rem;
  }

  .MainSection-entry {
    ${({ $showDetails }) =>
      $showDetails &&
      css`
        overflow: auto;
      `}
  }
`;
