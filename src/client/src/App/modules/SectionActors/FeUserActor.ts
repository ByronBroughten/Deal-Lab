import { AnalyzerPlan } from "../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { FeUserSolver } from "../SectionSolvers/FeUserSolver";
import { userTokenS } from "../services/userTokenS";
import { makeReq } from "./../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SetterSection } from "./../../sharedWithServer/StateSetters/SetterSection";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

export type FeUserActorProps = StrictOmit<
  SectionActorBaseProps<"feUser">,
  "sectionName"
>;

export class FeUserActor extends SectionActorBase<"feUser"> {
  constructor(props: FeUserActorProps) {
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
  get builder(): PackBuilderSection<"feUser"> {
    return new PackBuilderSection(this.sectionActorBaseProps);
  }
  async updateSubscriptionData() {
    const { headers, data } = await this.apiQueries.getSubscriptionData(
      makeReq({})
    );
    userTokenS.setTokenFromHeaders(headers);
    this.setter.updateValues({
      analyzerPlan: data.analyzerPlan,
      analyzerPlanExp: data.analyzerPlanExp,
    });
  }
  get analyzerPlan(): AnalyzerPlan {
    return this.get.valueNext("analyzerPlan") as AnalyzerPlan;
  }
  get isLoggedIn(): boolean {
    return this.solver.isLoggedIn;
  }

  get isGuest(): boolean {
    return this.solver.isGuest;
  }
}
