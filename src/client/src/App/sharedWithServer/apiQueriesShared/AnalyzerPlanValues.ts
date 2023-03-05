import { StateValue } from "../SectionsMeta/values/StateValue";
import { isLabSubscription } from "../SectionsMeta/values/StateValue/unionValues";
import { Obj } from "../utils/Obj";

export interface AnalyzerPlanValues {
  labSubscription: StateValue<"labSubscription">;
  labSubscriptionExp: number;
}

export function validateSubscriptionValues(props: any): AnalyzerPlanValues {
  if (!Obj.isObjToAny(props))
    throw new Error(`Expected subscriptionProps, received ${props}`);
  const { labSubscription, labSubscriptionExp } = props;
  if (!isLabSubscription(labSubscription)) {
    throw new Error(`"${labSubscription}" is not of type AnalyzerPlan`);
  }
  if (!(typeof labSubscriptionExp === "number")) {
    throw new Error(
      `labSubscriptionExp "${labSubscriptionExp}" is not a number`
    );
  }
  return { labSubscription, labSubscriptionExp };
}
