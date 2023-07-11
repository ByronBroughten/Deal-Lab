import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { DealMode } from "../SectionsMeta/values/StateValue/dealMode";
import { GetterSection } from "./../StateGetters/GetterSection";
import { PackBuilderSection } from "./../StatePackers/PackBuilderSection";

const outputPerDeal: Record<DealMode, VarbName<"deal">> = {
  homeBuyer: "averageNonPrincipalOngoingMonthly",
  buyAndHold: "cocRoiYearly",
  fixAndFlip: "valueAddRoiPercent",
  brrrr: "valueAddRoiPercent",
};

export function makeDefaultSessionDeal(deal: GetterSection<"deal">) {
  const dealMode = deal.valueNext("dealMode");
  const sessionDeal = PackBuilderSection.initAsOmniChild("sessionSection", {
    dbId: deal.dbId,
  });
  sessionDeal.updateValues({
    dateTimeCreated: deal.valueNext("dateTimeFirstSaved"),
    displayName: deal.valueNext("displayName").mainText,
  });

  const varbName = outputPerDeal[dealMode];
  const varb = deal.varbNext(varbName);
  const displayVarb = varb.displayVarb();
  const { displayName } = varb;

  sessionDeal.addChild("sessionVarb", {
    sectionValues: { varbName, label: displayName, value: displayVarb },
  });

  return sessionDeal.makeSectionPack();
}
