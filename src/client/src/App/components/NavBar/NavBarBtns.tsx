import { Box } from "@mui/material";
import { BsArrowUpCircle } from "react-icons/bs";
import { View } from "react-native";
import { useUserSubscription } from "../../modules/customHooks/useSubscriptions";
import { useUserDataActor } from "../../modules/SectionActors/UserDataActor";
import { nativeTheme } from "../../theme/nativeTheme";
import { NavBtn } from "./NavBtn";
import { NavDropDown } from "./NavDropDown";
import { NavUserMenu } from "./NavUserMenu";
import { UpgradeUserToProPanel } from "./UpgradeUserToProPanel";

function useScenarioKey() {
  const { userDataStatus } = useUserDataActor();
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
    proUser: () => <NavUserMenu />,
  };
  const scenarioKey = useScenarioKey();
  return (
    <View style={{ flexDirection: "row" }}>
      {/* <NavBtn
        className="NavBar-demoBtn NavBtn"
        href="https://youtu.be/81Ed3e54YS8"
        target="_blank"
        icon={<AiOutlineYoutube className="NavBar-demoBtnIcon" />}
        text="1 Min Demo"
      /> */}
      {/* <NavDropDown
        className="NavBar-feedbackDropDown"
        btnText="Feedback"
        btnIcon={<VscFeedback />}
      >
        <FeedbackPanel />
      </NavDropDown> */}
      {scenarios[scenarioKey]()}
    </View>
  );
}
