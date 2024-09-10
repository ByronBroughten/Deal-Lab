import { Box, SxProps } from "@mui/material";
import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import { useGetterSection } from "../../../../../../modules/stateHooks/useGetterSection";
import { useToggleView } from "../../../../../../modules/utilityHooks/useToggleView";
import { outputListName } from "../../../../../../sharedWithServer/StateOperators/defaultMaker/makeDefaultOutputSection";
import { StateValue } from "../../../../../../sharedWithServer/stateSchemas/StateValue";
import { dealModeLabels } from "../../../../../../sharedWithServer/stateSchemas/StateValue/unionValues";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { IdOfSectionToSaveProvider } from "../../../../../ContextsAndProviders/IdOfSectionToSaveProvider";
import { MuiRow } from "../../../../../general/MuiRow";
import { CheckMarkCircle } from "../../../../appWide/checkMarkCircle";
import { EditSectionBtn } from "../../../../appWide/EditSectionBtn";
import { MainSection } from "../../../../appWide/GeneralSection/MainSection";
import { StyledActionBtn } from "../../../../appWide/GeneralSection/MainSection/StyledActionBtn";
import { TitleAppend } from "../../../../appWide/titleAppend";
import { LoadedVarbListNext } from "../../../../appWide/VarbLists/LoadedVarbListNext";
import { useInputModalWithContext } from "../../../../Modals/InputModalProvider";
import { DealSubSectionTitle } from "../DealSubSectionTitle";
import { DealOutputListOrDetails } from "./OutputSection/DealOutputListOrDetails";

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
  const outputSection = useGetterSection({
    sectionName: "outputSection",
    feId,
  });
  const { detailsIsOpen, toggleDetails } = useToggleView("details", false);

  const listId = outputSection.oneChildFeId(outputListName(dealMode));
  const { setModal } = useInputModalWithContext();
  const openEdit = () =>
    setModal({
      showFinish: true,
      title: (
        <MuiRow>
          <Box>Outputs</Box>
          <TitleAppend
            sx={{ marginLeft: nativeTheme.s25 }}
            children={`(${dealModeLabels[dealMode]})`}
          />
        </MuiRow>
      ),
      children: (
        <IdOfSectionToSaveProvider {...{ storeId: outputSection.mainStoreId }}>
          <LoadedVarbListNext
            {...{
              feId: listId,
              sx: {
                marginTop: nativeTheme.s4,
                marginBottom: nativeTheme.s4,
              },
            }}
          />
        </IdOfSectionToSaveProvider>
      ),
    });

  return (
    <MainSection {...rest}>
      <MuiRow>
        <CheckMarkCircle
          {...{
            sx: {
              visibility: "hidden",
              marginRight: nativeTheme.s3,
            },
          }}
        />
        <DealSubSectionTitle title="Outputs" />
        <EditSectionBtn {...{ onClick: openEdit }} />
        {dealIsComplete && (
          <StyledActionBtn
            sx={{
              marginLeft: nativeTheme.s4,
              paddingTop: 0,
              paddingBottom: 0,
            }}
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
      </MuiRow>
      {/* {!dealIsComplete && (
        <Box
          sx={{
            paddingTop: nativeTheme.s3,
            paddingBottom: nativeTheme.s3,
            paddingX: nativeTheme.s5,
            display: "flex",
            // justifyContent: "center",
            fontSize: nativeTheme.fs18,
            color: nativeTheme.notice.dark,
          }}
        >
          {`Incomplete`}
        </Box>
      )} */}
      <DealOutputListOrDetails
        {...{
          detailsIsOpen,
          feId: listId,
        }}
      />
    </MainSection>
  );
}
