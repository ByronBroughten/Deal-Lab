import { GetterSection } from "../../StateGetters/GetterSection";
import { VarbName } from "../../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { DealMode } from "../../stateSchemas/schema4ValueTraits/StateValue/dealMode";
import { PackBuilderSection } from "../Packers/PackBuilderSection";

const outputPerDeal: Record<DealMode, VarbName<"deal">> = {
  homeBuyer: "expensesOngoingMonthly",
  buyAndHold: "cocRoiYearly",
  fixAndFlip: "valueAddRoiPercent",
  brrrr: "valueAddRoiPercent",
};

export function makeDefaultSessionDeal(deal: GetterSection<"deal">) {
  const dealMode = deal.valueNext("dealMode");
  const sessionDeal = PackBuilderSection.initAsOmniChild("sessionDeal", {
    dbId: deal.dbId,
  });
  sessionDeal.updateValues({
    dateTimeCreated: deal.valueNext("dateTimeFirstSaved"),
    displayName: deal.valueNext("displayName").mainText,
    dealMode,
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
