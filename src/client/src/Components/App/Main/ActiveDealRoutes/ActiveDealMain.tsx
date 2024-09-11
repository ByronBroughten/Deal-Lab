import { Box } from "@mui/material";
import { MoonLoader } from "react-spinners";
import { useGetterSectionOnlyOne } from "../../../../modules/stateHooks/useGetterSection";
import { constants } from "../../../../sharedWithServer/Constants";
import { isDealMode } from "../../../../sharedWithServer/stateSchemas/StateValue/dealMode";
import { dealModeLabels } from "../../../../sharedWithServer/stateSchemas/StateValue/unionValues";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { MuiRow } from "../../../general/MuiRow";
import { Row } from "../../../general/Row";
import { BackBtnWrapper } from "../../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../../appWide/BackgroundContainter";
import { PageTitle } from "../../appWide/PageTitle";
import { useGoToPage } from "../../customHooks/useGoToPage";
import { useIsDevices } from "../../customHooks/useMediaQueries";
import { BigStringEditor } from "../../inputs/BigStringEditor";
import { Column } from "./../../../general/Column";
import { OutputSection } from "./ActiveDealStuff/DealOutputs/OutputSection";
import { DealSubSectionClosed } from "./ActiveDealStuff/DealSubSectionClosed";
import { FinishBtn } from "./ActiveDealStuff/FinishBtn";
import { useActiveDealPage } from "./ActiveDealStuff/useActiveDealSection";

const dealElementProps = {
  sx: {
    marginTop: nativeTheme.s5,
  },
};

export function ActiveDealMain() {
  const session = useGetterSectionOnlyOne("sessionStore");
  const isCreatingDeal = session.valueNext("isCreatingDeal");
  return (
    <BackBtnWrapper {...{ to: "account", label: `${constants.appUnit} Menu` }}>
      <BackgroundContainer>
        {isCreatingDeal ? <CreatingActiveDeal /> : <CurrentActiveDeal />}
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}

function CreatingActiveDeal() {
  return (
    <Box>
      <PageTitle
        sx={{ marginTop: nativeTheme.s35 }}
        text={`Initializing ${constants.appUnit}...`}
      />
      <Box>
        <MuiRow
          sx={{
            justifyContent: "center",
            padding: nativeTheme.s5,
          }}
        >
          <MoonLoader
            {...{
              loading: true,
              color: nativeTheme.primary.main,
              size: 150,
              speedMultiplier: 0.8,
              cssOverride: { marginTop: nativeTheme.s4 },
            }}
          />
        </MuiRow>
      </Box>
    </Box>
  );
}

function CurrentActiveDeal() {
  const goToAccountPage = useGoToPage("account");
  const { deal, feStore } = useActiveDealPage();
  const dealMode = deal.valueNext("dealMode");
  const completionStatus = deal.valueNext("completionStatus");
  const { isPhone } = useIsDevices();
  return (
    <Box sx={{ ...(!isPhone && { minWidth: "700px" }) }}>
      <PageTitle
        sx={{ marginTop: nativeTheme.s35 }}
        text={`${dealModeLabels[dealMode]}`}
      />
      <Row
        sx={{
          alignItems: "flex-end",
          marginTop: nativeTheme.s35,
        }}
      >
        <BigStringEditor
          {...{
            label: "Title",
            feVarbInfo: deal.varbNext("displayNameEditor").feVarbInfo,
          }}
        />
      </Row>
      <Column>
        <DealSubSectionClosed {...dealElementProps} childName="property" />
        <DealSubSectionClosed
          {...dealElementProps}
          childName="purchaseFinancing"
        />
        {isDealMode(dealMode, "hasRefi") && (
          <DealSubSectionClosed
            {...dealElementProps}
            childName="refiFinancing"
          />
        )}
        {isDealMode(dealMode, "hasMgmt") && (
          <DealSubSectionClosed {...dealElementProps} childName="mgmtOngoing" />
        )}
      </Column>
      <OutputSection
        {...{
          ...dealElementProps,
          dealIsComplete: completionStatus === "allValid",
          feId: feStore.onlyChildFeId("outputSection"),
          dealMode,
        }}
      />
      <FinishBtn
        {...{
          sx: {
            ...dealElementProps.sx,
            marginBottom: dealElementProps.sx.marginTop,
            border: "none",
          },
          btnText: "Finish",
          onClick: goToAccountPage,
        }}
      />
    </Box>
  );
}
