import { Box } from "@mui/material";
import { BsArrowUpCircle } from "react-icons/bs";
import { useUserDataStatus } from "../../../../modules/stateHooks/useFeStore";
import { useUserSubscription } from "../../../../modules/utilityHooks/useSubscriptions";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { Column } from "../../../general/Column";
import { MuiRow } from "../../../general/MuiRow";
import { NavBtn } from "./NavBtn";
import { NavDropDown } from "./NavDropDown";
import { NavUserMenu } from "./NavUserMenu";
import { UpgradeUserToProPanel } from "./UpgradeUserToProPanel";

function useScenarioKey() {
  const userDataStatus = useUserDataStatus();
  const { userPlan } = useUserSubscription();
  if (userDataStatus === "notLoaded") return "guest";
  else if (userDataStatus === "loading") return "loggingInUser";
  else if (userDataStatus === "loaded") {
    if (userPlan === "basicPlan") return "basicUser";
    else if (userPlan === "fullPlan") return "proUser";
  }
  throw new Error("One of these should be true.");
}

export function NavBarBtns() {
  const scenarios = {
    guest: () => null,
    loggingInUser: () => (
      <NavBtn className="NavBar-isLoadingBtn" text="Loading..." />
    ),
    basicUser: () => (
      <>
        {/* <GiveFeedbackBtn /> */}
        <NavDropDown
          className="NavBar-upgradeToProDropdown"
          btnIcon={
            <BsArrowUpCircle size={25} className="NavBar-GetProDropdownIcon" />
          }
          btnText={
            <Box
              className="NavBar-ProText"
              sx={{
                color: nativeTheme.notice.dark,
                fontSize: 20,
                ml: nativeTheme.s2,
              }}
            >
              Pro
            </Box>
          }
        >
          <UpgradeUserToProPanel />
        </NavDropDown>
        <NavUserMenu />
      </>
    ),
    proUser: () => (
      <>
        {/* <GiveFeedbackBtn /> */}
        <NavUserMenu />
      </>
    ),
  };
  const scenarioKey = useScenarioKey();
  return (
    <Column sx={{ flexDirection: "row" }}>{scenarios[scenarioKey]()}</Column>
  );
}

function GiveFeedbackBtn() {
  return (
    <NavBtn
      href="https://homeestimator.net/contact"
      target="_blank"
      text={
        <MuiRow sx={{ justifyContent: "center" }}>
          <div style={{ whiteSpace: "pre-line", lineHeight: "20px" }}>
            {"Give\nFeedback"}
          </div>
        </MuiRow>
      }
    />
  );
}
