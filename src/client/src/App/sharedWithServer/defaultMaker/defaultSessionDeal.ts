import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { DealMode } from "../SectionsMeta/values/StateValue/dealMode";

const outputPerDeal: Record<DealMode, VarbName<"deal">> = {
  homeBuyer: "averageNonPrincipalOngoingMonthly",
  buyAndHold: "cocRoiYearly",
  fixAndFlip: "valueAddRoiPercent",
  brrrr: "valueAddRoiPercent",
};
