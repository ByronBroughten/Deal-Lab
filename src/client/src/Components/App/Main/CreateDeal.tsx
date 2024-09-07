import { Box } from "@mui/material";
import React from "react";
import { MoonLoader } from "react-spinners";
import { constants } from "../../../sharedWithServer/Constants";
import { useGetterSectionOnlyOne } from "../../../stateHooks/useGetterSection";
import { nativeTheme } from "../../../theme/nativeTheme";
import { MuiRow } from "../../general/MuiRow";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { MainSection } from "../appWide/GeneralSection/MainSection";
import { PageTitle } from "../appWide/PageTitle";
import { useGoToPage } from "../customHooks/useGoToPage";
import { NewDealSelector } from "./AccountPage/NewDealSelector";

const dealElementProps = {
  sx: {
    marginTop: nativeTheme.s5,
  },
};

export function CreateDeal() {
  const session = useGetterSectionOnlyOne("sessionStore");
  const isCreatingDeal = session.valueNext("isCreatingDeal");
  const goToActiveDealPage = useGoToPage("activeDeal");

  const ref = React.useRef(false);
  React.useEffect(() => {
    if (ref.current === true && isCreatingDeal === false) {
      goToActiveDealPage();
    }
    ref.current = isCreatingDeal;
  }, [ref, isCreatingDeal]);

  return (
    <BackBtnWrapper {...{ to: "account", label: `${constants.appUnit} Menu` }}>
      <BackgroundContainer>
        {isCreatingDeal ? <CreatingActiveDeal /> : <CreateDealMenu />}
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

function CreateDealMenu() {
  return (
    <MainSection>
      <PageTitle
        sx={{ marginTop: nativeTheme.s35 }}
        text={`New ${constants.appUnit}`}
      />
      <NewDealSelector />
    </MainSection>
  );
}
