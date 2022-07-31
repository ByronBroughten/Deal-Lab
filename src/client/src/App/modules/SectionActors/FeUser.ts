import Session from "supertokens-auth-react/recipe/session";
import { UserOrGuestPlan } from "../../sharedWithServer/SectionsMeta/baseSections";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { auth } from "../services/authService";

type FeUserProps = StrictOmit<GetterSectionProps<"feStore">, "sectionName">;
export class FeUser extends GetterSectionBase<"feStore"> {
  constructor(props: FeUserProps) {
    super({
      ...props,
      sectionName: "feStore",
    });
  }
  get get(): GetterSection<"feStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get userPlan(): UserOrGuestPlan {
    const subInfo = this.get.onlyChild("subscriptionInfo");
    return subInfo.value("plan", "string") as UserOrGuestPlan;
  }
  get isPro(): boolean {
    return this.userPlan === "fullPlan";
  }
  get isBasic(): boolean {
    return this.userPlan === "basicPlan";
  }
  get isSuperLoggedIn() {
    return Session.doesSessionExist();
  }
  get isLoggedIn() {
    return auth.isToken;
  }
  get isGuest() {
    return !this.isLoggedIn;
  }
}
