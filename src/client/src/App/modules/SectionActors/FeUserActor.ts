import Session from "supertokens-auth-react/recipe/session";
import {
  guestAccessNames,
  GuestAccessSectionPackArrs,
} from "../../sharedWithServer/apiQueriesShared/register";
import { SubscriptionValues } from "../../sharedWithServer/apiQueriesShared/SubscriptionValues";
import {
  AuthStatus,
  UserPlan,
} from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
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
  private get activeDealPack(): SectionPack<"deal"> {
    const feUser = this.get.sections.oneAndOnly("feUser");
    return feUser.onlyChild("activeDeal").packMaker.makeSectionPack();
  }
  async updateSubscriptionData() {
    const { headers, data } = await this.apiQueries.getSubscriptionData(
      makeReq({})
    );
    this.loginSetter.setUserInfoToken(headers);
    const subInfo = this.setter.onlyChild("subscriptionInfo");
    subInfo.updateValues({
      plan: data.subscriptionPlan,
      planExp: data.planExp,
    });
  }
  async loadUserData(): Promise<void> {
    const res = await this.apiQueries.getUserData(
      makeReq({
        activeDeal: this.activeDealPack,
        guestAccessSections: this.guestAccessSectionPacks,
      })
    );
    this.loginSetter.setLogin(res);
  }
  get subscriptionValues(): SubscriptionValues {
    const subInfo = this.get.onlyChild("subscriptionInfo");
    return {
      subscriptionPlan: subInfo.valueNext("plan") as UserPlan,
      planExp: subInfo.valueNext("planExp"),
    };
  }
  get userPlan(): UserPlan {
    return this.subscriptionValues.subscriptionPlan;
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
    const authInfo = this.get.onlyChild("authInfo");
    return authInfo.value("authStatus", "string") as AuthStatus;
  }
  get isGuest() {
    return this.authStatus === "guest";
  }
}
