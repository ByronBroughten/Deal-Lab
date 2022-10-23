import { AiOutlineYoutube } from "react-icons/ai";
import { BsArrowUpCircle } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";
import { View } from "react-native";
import { Link } from "react-router-dom";
import { constants } from "../../Constants";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { FeedbackPanel } from "./FeedbackPanel";
import NavBtn from "./NavBtn";
import NavDropDown from "./NavDropDown";
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
      <>
        <Link className="NavBar-navBtnLink" to="/auth">
          <NavBtn className="NavBar-signInUpBtn" text="Sign In / Sign Up" />
        </Link>
      </>
    ),
    loggingInUser: () => (
      <NavBtn className="NavBar-isLoadingBtn" text="Logging in..." />
    ),
    loggingOutUser: () => (
      <NavBtn className="NavBar-isLoadingBtn" text="Logging out..." />
    ),
    basicUser: () => (
      <>
        {!constants.isBeta && (
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
        )}
      </>
    ),
    proUser: () => <></>,
  };
  const scenarioKey = useScenarioKey();
  return (
    <View style={{ flexDirection: "row" }}>
      <NavBtn
        className="NavBar-demoBtn NavBtn"
        href="https://www.youtube.com/watch?v=wGfb8xX2FsI"
        target="_blank"
        icon={<AiOutlineYoutube className="NavBar-demoBtnIcon" />}
        text="Demo"
      />
      {constants.isBeta && (
        <NavDropDown
          className="NavBar-feedbackDropDown"
          btnText="Give Feedback"
          btnIcon={<VscFeedback />}
        >
          <FeedbackPanel />
        </NavDropDown>
      )}
      {scenarios[scenarioKey]()}
    </View>
  );
}
