import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { storeNames } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { FeUserSolver } from "../SectionSolvers/FeUserSolver";
import { userTokenS } from "../services/userTokenS";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

export type FeUserActorProps = StrictOmit<
  SectionActorBaseProps<"feStore">,
  "sectionName"
>;

export class FeStoreActor extends SectionActorBase<"feStore"> {
  constructor(props: FeUserActorProps) {
    super({
      ...props,
      sectionName: "feStore",
    });
  }
  async saveAllSections(): Promise<any> {
    const sectionPackArrs = this.packMaker.makeChildPackArrs(storeNames);
    return this.apiQueries.replaceSectionArrs(makeReq({ sectionPackArrs }));
  }
  get solver(): FeUserSolver {
    return new FeUserSolver(this.sectionActorBaseProps);
  }
  get setter(): SetterSection<"feStore"> {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get packMaker(): PackMakerSection<"feStore"> {
    return new PackMakerSection(this.sectionActorBaseProps);
  }
  get builder(): PackBuilderSection<"feStore"> {
    return new PackBuilderSection(this.sectionActorBaseProps);
  }
  async updateSubscriptionData() {
    const { headers, data } = await this.apiQueries.getSubscriptionData(
      makeReq({})
    );
    userTokenS.setTokenFromHeaders(headers);
    this.setter.updateValues({
      labSubscription: data.labSubscription,
      labSubscriptionExp: data.labSubscriptionExp,
    });
  }
  setSaveStatus(value: StateValue<"appSaveStatus">): void {
    this.setter.updateValues({ saveStatus: value });
  }
  get saveStatus(): StateValue<"appSaveStatus"> {
    return this.get.valueNext("saveStatus");
  }
  get labSubscription(): StateValue<"labSubscription"> {
    return this.get.valueNext("labSubscription");
  }
  get isLoggedIn(): boolean {
    return this.solver.isLoggedIn;
  }

  get isGuest(): boolean {
    return this.solver.isGuest;
  }
}
