import { SxProps } from "@mui/material";
import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useToggleView } from "../../../../modules/customHooks/useToggleView";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../theme/Theme";
import { arrSx } from "../../../../utils/mui";
import {
  MainSection,
  MainSectionBtn,
} from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { SectionTitle } from "../../../appWide/SectionTitle";
import { StyledIconBtn } from "../../../appWide/StyledIconBtn";
import { DealOutputDetails } from "./OutputSection/DealOutputDetails";
import { DealOutputList } from "./OutputSection/DealOutputList";

const warnNeedComplete = () =>
  toast.info("To calculate outputs, first complete each section.");

export function OutputSection({
  feId,
  disableOpenOutputs,
  ...rest
}: {
  sx?: SxProps;
  feId: string;
  disableOpenOutputs: boolean;
}) {
  const outputSection = useSetterSection({
    sectionName: "outputSection",
    feId,
  });
  const { detailsIsOpen, toggleDetails } = useToggleView("details", false);
  const outputsIsOpen = outputSection.value("showOutputs");
  const openOutputs = () => {
    outputSection.updateValues({
      showOutputs: true,
    });
  };

  const listId = outputSection.oneChildFeId("buyAndHoldOutputList");
  return !outputsIsOpen ? (
    <MainSectionBtn
      {...{
        sx: [{ width: "100%" }, ...arrSx(rest.sx)],
        middle: "View Outputs",
        styleDisabled: disableOpenOutputs,
        tooltipText: "",
        onClick: disableOpenOutputs ? warnNeedComplete : openOutputs,
      }}
    />
  ) : (
    <Styled {...rest}>
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
              <DealOutputList feId={listId} />
            </div>
          </div>
        )}
        {detailsIsOpen && <DealOutputDetails {...{ feId: listId }} />}
      </MainSectionBody>
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
