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
  get isPro(): boolean {
    const subscription = this.get.onlyChild("subscriptionInfo");
    const plan = subscription.value("plan", "string") as UserOrGuestPlan;
    return plan === "fullPlan";
  }
  get isLoggedIn() {
    return auth.isToken;
  }
  get isGuest() {
    return !this.isLoggedIn;
  }
}
