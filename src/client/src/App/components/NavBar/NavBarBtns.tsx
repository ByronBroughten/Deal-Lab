import { BsArrowUpCircle } from "react-icons/bs";
import { View } from "react-native";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { DomLink } from "../ActiveDeal/general/DomLink";
import { NavBtn } from "./NavBtn";
import { NavDropDown } from "./NavDropDown";
import { NavUserMenu } from "./NavUserMenu";
import { UpgradeUserToProPanel } from "./UpgradeUserToProPanel";

function useScenarioKey() {
  const feUser = useFeUser();
  const { userDataStatus } = feUser;
  if (userDataStatus === "notLoaded") return "guest";
  else if (userDataStatus === "loading") return "loggingInUser";
  else if (userDataStatus === "unloading") return "loggingOutUser";
  else if (userDataStatus === "loaded") {
    const { analyzerPlan } = feUser;
    if (analyzerPlan === "basicPlan") return "basicUser";
    else if (analyzerPlan === "fullPlan") return "proUser";
  }
  throw new Error("One of these should be true.");
}

export function NavBarBtns() {
  const scenarios = {
    guest: () => (
      <DomLink className="NavBar-navBtnLink" to="/auth">
        <NavBtn className="NavBar-signInUpBtn" text="Sign In / Sign Up" />
      </DomLink>
    ),
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
