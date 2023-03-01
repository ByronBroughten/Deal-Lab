import { BsArrowUpCircle } from "react-icons/bs";
import { View } from "react-native";
import { useUserSubscription } from "../../modules/customHooks/useSubscriptions";
import { useUserDataActor } from "../../modules/customHooks/useUserData";
import { NavBtn } from "./NavBtn";
import { NavDropDown } from "./NavDropDown";
import { NavUserMenu } from "./NavUserMenu";
import { UpgradeUserToProPanel } from "./UpgradeUserToProPanel";

function useScenarioKey() {
  const { userDataStatus } = useUserDataActor();
  const { userPlan } = useUserSubscription();
  if (userDataStatus === "notLoaded") return "guest";
  else if (userDataStatus === "loading") return "loggingInUser";
  else if (userDataStatus === "unloading") return "loggingOutUser";
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
    loggingOutUser: () => (
      <NavBtn className="NavBar-isLoadingBtn" text="Logging out..." />
    ),
    basicUser: () => (
      <>
        <NavDropDown
          className="NavBar-GetProDropdown"
          btnText={
            <>
              <BsArrowUpCircle className="NavBar-GetProDropdownIcon" />
              <span className="NavBar-GetProDropdownText">Pro</span>
            </>
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
