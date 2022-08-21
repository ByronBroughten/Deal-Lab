import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import styled, { css } from "styled-components";
import useToggleView from "../../modules/customHooks/useToggleView";
import { auth } from "../../modules/services/authService";
import theme from "../../theme/Theme";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import { Deal } from "./DealStats/Deal";

type Props = { className?: string; feId: string };

export default function DealStats({ className, feId }: Props) {
  const { detailsIsOpen, toggleDetails } = useToggleView({
    initValue: false,
    viewWhat: "details",
  });
  return (
    <Styled
      {...{
        $showDetails: detailsIsOpen,
        themeName: "deal",
        className: `DealStats-root ${className}`,
      }}
    >
      <GeneralSectionTitle title="Deal" themeName="deal">
        <div className="GeneralSectionTitle-children">
          <MainSectionTitleBtn
            themeName="deal"
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
          {
            auth.isToken && null
            // <Link className="GeneralSectionTitle-dealsLink" to="/deals">
            //   <MainSectionTitleBtn
            //     themeName="deal"
            //     className="GeneralSectionTitle-child"
            //     // disabled={!auth.isToken}
            //   >
            //     {"Compare Deals"}
            //     <MdCompareArrows className="GeneralSectionTitle-compareIcon" />
            //   </MainSectionTitleBtn>
            // </Link>
          }
          {
            !auth.isToken && null
            // <StandardToolTip
            //   className="GeneralSectionTitle-toolTip"
            //   title="Login to compare saved deals"
            // >
            //   <div className="GeneralSectionTitle-disabledBtnWrapper">
            //     <MainSectionTitleBtn
            //       themeName="deal"
            //       className="GeneralSectionTitle-child GeneralSectionTitle-compareDealsBtn"
            //       disabled={true}
            //     >
            //       {"Compare Deals"}
            //       <MdCompareArrows className="GeneralSectionTitle-compareIcon" />
            //     </MainSectionTitleBtn>
            //   </div>
            // </StandardToolTip>
          }
        </div>
      </GeneralSectionTitle>
      <Deal {...{ feId, detailsIsOpen }} />
      <div className="DealStats-appInfo">
        Questions or feedback? support@ultimatepropertyanalyzer.com
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

  .DealStats-appInfo {
    display: flex;
    justify-content: center;
    background: ${theme.deal.main};
    color: ${theme.dark};
    font-size: 14px;
    padding: ${theme.s1} 0;
    /* font-size: 0.9rem; */
    /* line-height: 0.9rem; */
  }
`;
