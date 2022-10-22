import Session from "supertokens-auth-react/recipe/session";
import { AnalyzerPlanValues } from "../../sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import {
  guestAccessNames,
  GuestAccessSectionPackArrs,
} from "../../sharedWithServer/apiQueriesShared/register";
import {
  AuthStatus,
  UserPlan,
} from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { auth } from "../services/authService";
import { makeReq } from "./../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SetterSection } from "./../../sharedWithServer/StateSetters/SetterSection";
import { LoginSetter } from "./FeUserActor/LoginSetter";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

type FeUserProps = StrictOmit<SectionActorBaseProps<"feUser">, "sectionName">;
export class FeUserActor extends SectionActorBase<"feUser"> {
  constructor(props: FeUserProps) {
    super({
      ...props,
      sectionName: "feUser",
    });
  }
  get setter(): SetterSection<"feUser"> {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get loginSetter() {
    return new LoginSetter(this.sectionActorBaseProps);
  }
  private get guestAccessSectionPacks(): GuestAccessSectionPackArrs {
    const { sections } = this.get;
    const { getterSectionsProps } = sections;
    const feUser = sections.oneAndOnly("feUser");
    const feStorePackMaker = new PackMakerSection({
      ...getterSectionsProps,
      ...feUser.feInfo,
    });
    return feStorePackMaker.makeChildPackArrs(
      guestAccessNames
    ) as GuestAccessSectionPackArrs;
  }
  async updateSubscriptionData() {
    const { headers, data } = await this.apiQueries.getSubscriptionData(
      makeReq({})
    );
    this.loginSetter.setUserInfoToken(headers);
    const subInfo = this.setter.onlyChild("userInfoNext");
    subInfo.updateValues({
      analyzerPlan: data.analyzerPlan,
      analyzerPlanExp: data.analyzerPlanExp,
    });
  }
  async loadUserData(): Promise<void> {
    const res = await this.apiQueries.getUserData(
      makeReq({
        guestAccessSections: this.guestAccessSectionPacks,
      })
    );
    this.loginSetter.setLogin(res);
  }
  get subscriptionValues(): AnalyzerPlanValues {
    const subInfo = this.get.onlyChild("userInfoNext");
    return {
      analyzerPlan: subInfo.valueNext("analyzerPlan") as UserPlan,
      analyzerPlanExp: subInfo.valueNext("analyzerPlanExp"),
    };
  }
  get userPlan(): UserPlan {
    return this.subscriptionValues.analyzerPlan;
  }
  get isPro(): boolean {
    return this.userPlan === "fullPlan";
  }
  get isBasic(): boolean {
    return this.userPlan === "basicPlan";
  }
  get sessionExists() {
    return Session.doesSessionExist();
  }
  get isLoggedIn() {
    return auth.isToken;
  }
  get authStatus() {
    const userInfo = this.get.onlyChild("userInfoNext");
    return userInfo.valueNext("authStatus") as AuthStatus;
  }
  get isGuest() {
    return this.authStatus === "guest";
  }
}
