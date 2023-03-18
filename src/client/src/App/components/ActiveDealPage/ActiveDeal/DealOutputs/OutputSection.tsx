import { SxProps } from "@mui/material";
import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import styled from "styled-components";
import { useToggleView } from "../../../../modules/customHooks/useToggleView";
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
  disableOpenOutputs,
  outputsIsOpen,
  openOutputs,
  ...rest
}: {
  sx?: SxProps;
  feId: string;
  disableOpenOutputs: boolean;
  outputsIsOpen: boolean;
  openOutputs: () => void;
}) {
  const { detailsIsOpen, toggleDetails } = useToggleView("details", false);
  return (
    <Styled {...rest}>
      {!outputsIsOpen && (
        <FinishBtn
          {...{
            btnText: "Calculate Outputs",
            styleDisabled: disableOpenOutputs,
            tooltipText: "",
            onClick: openOutputs,
            warningText: "To calculate outputs, first complete each section.",
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
const Styled = styled(MainSection)`
  .DealOutputList-root {
    margin-left: -${theme.s2};
  }
  .DealOutputDetails-root {
    margin-top: ${theme.s3};
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
`;
