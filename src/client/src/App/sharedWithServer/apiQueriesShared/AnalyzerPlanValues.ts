import { StateValue } from "../SectionsMeta/values/StateValue";
import { isLabSubscription } from "../SectionsMeta/values/StateValue/unionValues";
import { Obj } from "../utils/Obj";

export interface AnalyzerPlanValues {
  analyzerPlan: StateValue<"labSubscription">;
  analyzerPlanExp: number;
}

export function validateSubscriptionValues(props: any): AnalyzerPlanValues {
  if (!Obj.isObjToAny(props))
    throw new Error(`Expected subscriptionProps, received ${props}`);
  const { analyzerPlan, analyzerPlanExp } = props;
  if (!isLabSubscription(analyzerPlan)) {
    throw new Error(`"${analyzerPlan}" is not of type AnalyzerPlan`);
  }
  if (!(typeof analyzerPlanExp === "number")) {
    throw new Error(`analyzerPlanExp "${analyzerPlanExp}" is not a number`);
  }
  return { analyzerPlan, analyzerPlanExp };
}
