import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import styled, { css } from "styled-components";
import { useToggleViewNext } from "../../../../modules/customHooks/useToggleView";
import { CompletionStatus } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { SectionTitle } from "../../../appWide/SectionTitle";
import { StyledIconBtn } from "../../../appWide/StyledIconBtn";
import { DealOutputDetails } from "./OutputSection/DealOutputDetails";
import { DealOutputList } from "./OutputSection/DealOutputList";

export function OutputSection({
  feId,
  hide,
  completionStatus,
}: {
  feId: string;
  hide?: boolean;
  completionStatus: CompletionStatus;
}) {
  const { detailsIsOpen, toggleDetails } = useToggleViewNext("details", false);
  return (
    // I want a button that says, "calculate outputs"
    // I want to show progress towards the outputs being calculatable

    <Styled className="OutputSection-root" $hide={hide}>
      <div className="OutputSection-titleRow">
        <SectionTitle text="Outputs" />
        <StyledIconBtn
          className="OutputSection-detailsBtn"
          left={
            detailsIsOpen ? (
              <CgDetailsLess size={20} />
            ) : (
              <CgDetailsMore size={20} />
            )
          }
          middle="Details"
          onClick={toggleDetails}
        />
      </div>
      <MainSectionBody>
        {!detailsIsOpen && (
          <div className="ListGroup-root">
            <div className="OutputSection-viewable viewable">
              <DealOutputList feId={feId} />
            </div>
          </div>
        )}
        {detailsIsOpen && <DealOutputDetails {...{ feId }} />}
      </MainSectionBody>
    </Styled>
  );
}
const Styled = styled(MainSection)<{ $hide?: boolean }>`
  .DealOutputList-root {
    margin-left: -${theme.s2};
  }
  .OutputSection-detailsBtn {
    margin-left: ${theme.s4};
    font-size: ${theme.infoSize};
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .OutputSection-titleRow {
    display: flex;
    align-items: center;
  }
  ${({ $hide }) =>
    $hide &&
    css`
      display: none;
    `}
`;
