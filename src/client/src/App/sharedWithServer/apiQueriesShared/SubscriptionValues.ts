import { isUserPlan, UserPlan } from "../SectionsMeta/baseSectionsVarbs";
import { Obj } from "../utils/Obj";

export interface SubscriptionValues {
  subscriptionPlan: UserPlan;
  planExp: number;
}

export function validateSubscriptionValues(props: any): SubscriptionValues {
  if (!Obj.isObjToAny(props))
    throw new Error(`Expected subscriptionProps, received ${props}`);
  const { subscriptionPlan, planExp } = props;
  if (!isUserPlan(subscriptionPlan)) {
    throw new Error(`"${subscriptionPlan}" is not of type UserPlan`);
  }
  if (!(typeof planExp === "number")) {
    throw new Error(`planExp "${planExp}" is not a number`);
  }
  return { subscriptionPlan, planExp };
}
