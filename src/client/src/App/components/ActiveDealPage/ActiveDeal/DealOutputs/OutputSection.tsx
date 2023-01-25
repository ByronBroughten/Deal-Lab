import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import styled, { css } from "styled-components";
import { useToggleViewNext } from "../../../../modules/customHooks/useToggleView";
import { CompletionStatus } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { SectionTitle } from "../../../appWide/SectionTitle";
import { StyledIconBtn } from "../../../appWide/StyledIconBtn";
import { FinishBtn } from "../FinishBtn";
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
  const { outputsIsOpen, openOutputs } = useToggleViewNext("outputs", false);
  const { detailsIsOpen, toggleDetails } = useToggleViewNext("details", false);
  const isComplete = completionStatus === "allValid";
  return (
    <Styled className="OutputSection-root" $hide={hide}>
      {!outputsIsOpen && (
        <FinishBtn
          {...{
            btnText: "Calculate Outputs",
            styleDisabled: !isComplete,
            tooltipText: "",
            onClick: openOutputs,
            warningText: "Please complete each of the sections first.",
          }}
        />
      )}
      {outputsIsOpen && (
        <>
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
        </>
      )}
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
