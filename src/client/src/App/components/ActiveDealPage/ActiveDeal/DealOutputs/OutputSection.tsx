import { Box, SxProps } from "@mui/material";
import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useToggleView } from "../../../../modules/customHooks/useToggleView";
import { outputListName } from "../../../../sharedWithServer/defaultMaker/makeDefaultOutputSection";
import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { nativeTheme } from "../../../../theme/nativeTheme";
import theme from "../../../../theme/Theme";
import { CheckMarkCircle } from "../../../appWide/checkMarkCircle";
import { EditSectionBtn } from "../../../appWide/EditSectionBtn";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { StyledActionBtn } from "../../../appWide/GeneralSection/MainSection/StyledActionBtn";
import { DealSubSectionTitle } from "../DealSubSectionTitle";
import { DealOutputListOrDetails } from "./OutputSection/DealOutputListOrDetails";

const warnNeedComplete = () =>
  toast.info("To calculate outputs, first complete each section.");

export function OutputSection({
  feId,
  dealMode,
  dealIsComplete,
  ...rest
}: {
  sx?: SxProps;
  feId: string;
  dealIsComplete: boolean;
  dealMode: StateValue<"dealMode">;
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

  const listId = outputSection.oneChildFeId(outputListName(dealMode));
  return (
    <Styled {...rest}>
      <div className="OutputSection-titleRow">
        <CheckMarkCircle
          {...{
            sx: {
              visibility: "hidden",
              marginRight: nativeTheme.s3,
            },
          }}
        />
        <DealSubSectionTitle title="Outputs" />
        <EditSectionBtn {...{}} />
        {dealIsComplete && (
          <StyledActionBtn
            className="OutputSection-detailsBtn"
            left={
              detailsIsOpen ? (
                <CgDetailsLess size={20} />
              ) : (
                <CgDetailsMore size={20} />
              )
            }
            middle={`${detailsIsOpen ? "Hide" : "Show"} Details`}
            onClick={toggleDetails}
          />
        )}
      </div>
      {dealIsComplete && (
        <DealOutputListOrDetails
          {...{
            detailsIsOpen,
            feId: listId,
          }}
        />
      )}
      {!dealIsComplete && (
        <MainSectionBody>
          <Box
            sx={{
              paddingY: nativeTheme.s4,
              display: "flex",
              justifyContent: "center",
              fontSize: nativeTheme.fs22,
              color: nativeTheme.darkBlue.main,
            }}
          >
            Complete all deal sections to see outputs
          </Box>
        </MainSectionBody>
      )}
    </Styled>
  );
}

const Styled = styled(MainSection)`
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
