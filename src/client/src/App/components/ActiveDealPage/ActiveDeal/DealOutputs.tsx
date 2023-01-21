import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import styled, { css } from "styled-components";
import useToggleView from "../../../modules/customHooks/useToggleView";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../theme/Theme";
import { GeneralSection } from "../../appWide/GeneralSection";
import { OutputSection } from "./DealOutputs/DealOutputSection";

type Props = { className?: string; feId: string };

export function DealOutputs({ className, feId }: Props) {
  const deal = useSetterSection({
    sectionName: "deal",
    feId,
  });

  const { detailsIsOpen, toggleDetails } = useToggleView({
    initValue: false,
    viewWhat: "details",
  });

  const detailsBtnProps = detailsIsOpen
    ? {
        text: "Hide Details",
        icon: <CgDetailsLess className="GeneralSectionTitle-detailsIcon" />,
      }
    : {
        text: "Show Details",
        icon: <CgDetailsMore className="GeneralSectionTitle-detailsIcon" />,
      };

  return (
    <OutputSection {...{ feId, detailsIsOpen }} />
    /* {!showCalculations && (
        <>
          <div className="GeneralSectionInfo-root" />
          <div className="GeneralSection-addEntryBtnDiv">
            <MainSectionTitleBtn
              themeName="deal"
              className="MainSection-addChildBtn"
              onClick={() =>
                showCalculationStatus()
              }
              text="Calculate Outputs"
            />
          </div>
        </>
      )}
      {showCalculations && <OutputSection {...{ feId, detailsIsOpen }} />} */
  );
}

const Styled = styled(GeneralSection)<{ $showDetails: boolean }>`
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
    width: 50%;
  }
  // properly disable compare deals for when you're logged out
  // make OutputSection stick to the bottom again

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

  .MainSection-root {
    padding-bottom: ${theme.s1};
    ${({ $showDetails }) =>
      $showDetails &&
      css`
        overflow: auto;
      `}
  }
`;
