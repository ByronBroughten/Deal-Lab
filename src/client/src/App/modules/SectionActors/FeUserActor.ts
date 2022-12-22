import Session from "supertokens-auth-react/recipe/session";
import { AnalyzerPlanValues } from "../../sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import {
  guestAccessNames,
  GuestAccessSectionPackArrs,
} from "../../sharedWithServer/apiQueriesShared/register";
import {
  AnalyzerPlan,
  AuthStatus,
  UserDataStatus,
} from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { FeUserSolver } from "../SectionSolvers/FeUserSolver";
import { makeReq } from "./../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SetterSection } from "./../../sharedWithServer/StateSetters/SetterSection";
import { UserDataSetter } from "./FeUserActor/UserDataSetter";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

type FeUserProps = StrictOmit<SectionActorBaseProps<"feUser">, "sectionName">;
export class FeUserActor extends SectionActorBase<"feUser"> {
  constructor(props: FeUserProps) {
    super({
      ...props,
      sectionName: "feUser",
    });
  }
  get solver(): FeUserSolver {
    return new FeUserSolver(this.sectionActorBaseProps);
  }
  get setter(): SetterSection<"feUser"> {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get userDataSetter() {
    return new UserDataSetter(this.sectionActorBaseProps);
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
  get userDataStatus(): UserDataStatus {
    return this.get.valueNext("userDataStatus") as UserDataStatus;
  }
  updateUserDataStatus(userDataStatus: UserDataStatus): void {
    this.setter.varb("userDataStatus").updateValue(userDataStatus);
  }
  async shouldLoadUserData() {
    return this.userDataStatus === "notLoaded" && (await this.sessionExists);
  }
  async triggerLoadUserData() {
    this.setter.varb("userDataStatus").updateValue("loading");
  }
  async shouldUnloadUserData() {
    return (
      this.get.valueNext("userDataStatus") === "loaded" &&
      !(await this.sessionExists)
    );
  }
  async triggerUnloadUserData() {
    this.setter.varb("userDataStatus").updateValue("unloading");
  }
  async abortSignIn(): Promise<void> {
    this.setter.varb("userDataStatus").updateValue("notLoaded");
  }
  async updateSubscriptionData() {
    const { headers, data } = await this.apiQueries.getSubscriptionData(
      makeReq({})
    );
    this.userDataSetter.setUserInfoToken(headers);
    this.setter.updateValues({
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
    this.userDataSetter.loadUserData(res);
  }
  get subscriptionValues(): AnalyzerPlanValues {
    return {
      analyzerPlan: this.analyzerPlan,
      analyzerPlanExp: this.get.valueNext("analyzerPlanExp"),
    };
  }
  get analyzerPlan(): AnalyzerPlan {
    return this.get.valueNext("analyzerPlan") as AnalyzerPlan;
  }
  get isPro(): boolean {
    return this.analyzerPlan === "fullPlan";
  }
  get isBasic(): boolean {
    return this.analyzerPlan === "basicPlan";
  }
  get sessionExists(): Promise<boolean> {
    return Session.doesSessionExist();
  }
  get isLoggedIn(): boolean {
    return this.solver.isLoggedIn;
  }
  get authStatus(): AuthStatus {
    return this.solver.authStatus;
  }
  get isGuest(): boolean {
    return this.solver.isGuest;
  }
}
