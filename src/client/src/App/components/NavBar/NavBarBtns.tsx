import { AiOutlineYoutube } from "react-icons/ai";
import { BsArrowUpCircle } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";
import { View } from "react-native";
import { constants } from "../../Constants";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { DomLink } from "../ActiveDeal/general/DomLink";
import { FeedbackPanel } from "./FeedbackPanel";
import NavBtn from "./NavBtn";
import { NavDropDown } from "./NavDropDown";
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
        href="https://youtu.be/81Ed3e54YS8"
        target="_blank"
        icon={<AiOutlineYoutube className="NavBar-demoBtnIcon" />}
        text="Demo"
      />
      <NavDropDown
        className="NavBar-feedbackDropDown"
        btnText="Give Feedback"
        btnIcon={<VscFeedback />}
      >
        <FeedbackPanel />
      </NavDropDown>
      {scenarios[scenarioKey]()}
    </View>
  );
}
