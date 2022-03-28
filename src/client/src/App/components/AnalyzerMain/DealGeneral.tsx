import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import styled, { css } from "styled-components";
import theme from "../../theme/Theme";
import MainSectionTitle from "../appWide/MainSection/MainSectionTitle";
import MainSectionTitleBtn from "../appWide/MainSection/MainSectionTitle/MainSectionTitleBtn";
import Deal from "./DealGeneral/Deal";
import MainSection from "../appWide/MainSection";
import useToggleView from "../../modules/customHooks/useToggleView";
import { Link } from "react-router-dom";
import { auth } from "../../modules/services/authService";
import { MdCompareArrows } from "react-icons/md";
import { CgDetailsMore, CgDetailsLess } from "react-icons/cg";
import LoginToAccessBtnTooltip from "../appWide/LoginToAccessBtnTooltip";
import StandardToolTip from "../appWide/StandardTooltip";

type Props = { className?: string };

export default function DealGeneral({ className }: Props) {
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
            {detailsIsOpen ? (
              <>
                {"Hide Details"}
                <CgDetailsLess className="MainSectionTitle-detailsIcon" />
              </>
            ) : (
              <>
                {"Show Details"}
                <CgDetailsMore className="MainSectionTitle-detailsIcon" />
              </>
            )}
          </MainSectionTitleBtn>
          {/* // disable the link */}
          {auth.isLoggedIn && (
            <Link className="MainSectionTitle-dealsLink" to="/deals">
              <MainSectionTitleBtn
                themeName="analysis"
                className="MainSectionTitle-child"
                // disabled={!auth.isLoggedIn}
              >
                {"Compare Deals"}
                <MdCompareArrows className="MainSectionTitle-compareIcon" />
              </MainSectionTitleBtn>
            </Link>
          )}
          {!auth.isLoggedIn && (
            <StandardToolTip
              className="MainSectionTitle-toolTip"
              title="Login to click"
            >
              <div className="MainSectionTitle-disabledBtnWrapper">
                <MainSectionTitleBtn
                  themeName="analysis"
                  className="MainSectionTitle-child MainSectionTitle-compareDealsBtn"
                  disabled={true}
                >
                  {"Compare Deals"}
                  <MdCompareArrows className="MainSectionTitle-compareIcon" />
                </MainSectionTitleBtn>
              </div>
            </StandardToolTip>
          )}
        </div>
      </MainSectionTitle>
      <Deal {...{ feId, detailsIsOpen }} />
      <div className="DealGeneral-appInfo">
        Ultimate Property Analyzer LLC | support@dealanalyzer.app
      </div>
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
    display: flex;
    align-items: center;
    text-decoration: none;
    height: 100%;
    width: 100%;
  }

  .MainSectionTitle-toolTip {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .MainSectionTitle-disabledBtnWrapper {
    height: inherit;
  }

  .MainSectionTitle-child {
    margin: 0 ${theme.s1};
    width: 100%;
  }
  // properly disable compare deals for when you're logged out
  // make Deal stick to the bottom again

  .MainSectionTitle-compareIcon {
    font-size: 1.9rem;
    color: inherit;
    margin-left: ${theme.s3};
  }
  .MainSectionTitle-detailsIcon {
    font-size: 1.4rem;
    color: inherit;
    margin-left: ${theme.s3};
  }

  .MainSection-entry {
    padding-bottom: ${theme.s1};
    ${({ $showDetails }) =>
      $showDetails &&
      css`
        overflow: auto;
      `}
  }

  .DealGeneral-appInfo {
    display: flex;
    justify-content: center;
    background: ${theme.analysis.dark};
    color: ${theme.analysis.light};
    font-size: 12px;
    padding: ${theme.s0} 0;
    /* font-size: 0.9rem; */
    /* line-height: 0.9rem; */
  }
`;
