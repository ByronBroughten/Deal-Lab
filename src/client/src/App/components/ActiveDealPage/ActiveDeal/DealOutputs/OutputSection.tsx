import { Box, SxProps } from "@mui/material";
import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import { useToggleView } from "../../../../modules/customHooks/useToggleView";
import { outputListName } from "../../../../sharedWithServer/defaultMaker/makeDefaultOutputSection";
import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { dealModeLabels } from "../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { IdOfSectionToSaveProvider } from "../../../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { CheckMarkCircle } from "../../../appWide/checkMarkCircle";
import { EditSectionBtn } from "../../../appWide/EditSectionBtn";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import { StyledActionBtn } from "../../../appWide/GeneralSection/MainSection/StyledActionBtn";
import { TitleAppend } from "../../../appWide/titleAppend";
import { LoadedVarbList } from "../../../appWide/VarbLists/LoadedVarbList";
import { MuiRow } from "../../../general/MuiRow";
import { useDealModeContextInputModal } from "../../../Modals/InputModalProvider";
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
  const { setModal } = useDealModeContextInputModal();
  const openEdit = () =>
    setModal({
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
          <LoadedVarbList
            {...{
              feId: listId,
              menuType: "value",
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
      {!dealIsComplete && (
        <Box
          sx={{
            paddingY: nativeTheme.s4,
            paddingX: nativeTheme.s5,
            display: "flex",
            justifyContent: "center",
            fontSize: nativeTheme.fs22,
            color: nativeTheme.notice.dark,
          }}
        >
          Deal Incomplete
        </Box>
      )}
      <DealOutputListOrDetails
        {...{
          detailsIsOpen,
          feId: listId,
        }}
      />
    </MainSection>
  );
}
