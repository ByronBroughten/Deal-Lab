import { isUserPlan, UserPlan } from "../SectionsMeta/baseSectionsVarbs";
import { Obj } from "../utils/Obj";

export interface AnalyzerPlanValues {
  analyzerPlan: UserPlan;
  analyzerPlanExp: number;
}

export function validateSubscriptionValues(props: any): AnalyzerPlanValues {
  if (!Obj.isObjToAny(props))
    throw new Error(`Expected subscriptionProps, received ${props}`);
  const { analyzerPlan, analyzerPlanExp } = props;
  if (!isUserPlan(analyzerPlan)) {
    throw new Error(`"${analyzerPlan}" is not of type UserPlan`);
  }
  if (!(typeof analyzerPlanExp === "number")) {
    throw new Error(`analyzerPlanExp "${analyzerPlanExp}" is not a number`);
  }
  return { analyzerPlan, analyzerPlanExp };
}
