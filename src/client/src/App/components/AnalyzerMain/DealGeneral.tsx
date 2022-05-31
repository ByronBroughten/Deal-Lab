import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import { MdCompareArrows } from "react-icons/md";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import useToggleView from "../../modules/customHooks/useToggleView";
import { auth } from "../../modules/services/authService";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { useSetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import theme from "../../theme/Theme";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import StandardToolTip from "../appWide/StandardTooltip";
import { Deal } from "./DealGeneral/Deal";

type Props = { className?: string };

export default function DealGeneral({ className }: Props) {
  const main = useSetterSection();
  const dealFeId = main.oneChildFeId("analysis");

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
      <GeneralSectionTitle title="Deal" sectionName="analysis">
        <div className="GeneralSectionTitle-children">
          <MainSectionTitleBtn
            themeName="analysis"
            className="GeneralSectionTitle-child"
            onClick={toggleDetails}
          >
            {detailsIsOpen ? (
              <>
                {"Hide Details"}
                <CgDetailsLess className="GeneralSectionTitle-detailsIcon" />
              </>
            ) : (
              <>
                {"Show Details"}
                <CgDetailsMore className="GeneralSectionTitle-detailsIcon" />
              </>
            )}
          </MainSectionTitleBtn>
          {/* // disable the link */}
          {auth.isLoggedIn && (
            <Link className="GeneralSectionTitle-dealsLink" to="/deals">
              <MainSectionTitleBtn
                themeName="analysis"
                className="GeneralSectionTitle-child"
                // disabled={!auth.isLoggedIn}
              >
                {"Compare Deals"}
                <MdCompareArrows className="GeneralSectionTitle-compareIcon" />
              </MainSectionTitleBtn>
            </Link>
          )}
          {!auth.isLoggedIn && (
            <StandardToolTip
              className="GeneralSectionTitle-toolTip"
              title="Login to compare saved deals"
            >
              <div className="GeneralSectionTitle-disabledBtnWrapper">
                <MainSectionTitleBtn
                  themeName="analysis"
                  className="GeneralSectionTitle-child GeneralSectionTitle-compareDealsBtn"
                  disabled={true}
                >
                  {"Compare Deals"}
                  <MdCompareArrows className="GeneralSectionTitle-compareIcon" />
                </MainSectionTitleBtn>
              </div>
            </StandardToolTip>
          )}
        </div>
      </GeneralSectionTitle>
      <Deal {...{ feId, detailsIsOpen }} />
      <div className="DealGeneral-appInfo">
        Ultimate Property Analyzer LLC | support@dealanalyzer.app
      </div>
    </Styled>
  );
}

const Styled = styled(MainSection)<{ $showDetails: boolean }>`
  .GeneralSectionTitle-children {
    display: flex;
    height: 100%;
    align-items: center;
    width: 50%;
  }

  .GeneralSectionTitle-dealsLink {
    display: flex;
    align-items: center;
    text-decoration: none;
    height: 100%;
    width: 100%;
  }

  .GeneralSectionTitle-toolTip {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .GeneralSectionTitle-disabledBtnWrapper {
    height: inherit;
  }

  .GeneralSectionTitle-child {
    margin: 0 ${theme.s1};
    width: 100%;
  }
  // properly disable compare deals for when you're logged out
  // make Deal stick to the bottom again

  .GeneralSectionTitle-compareIcon {
    font-size: 1.9rem;
    color: inherit;
    margin-left: ${theme.s3};
  }
  .GeneralSectionTitle-detailsIcon {
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
