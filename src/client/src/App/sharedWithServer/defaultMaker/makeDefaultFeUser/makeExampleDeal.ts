import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { timeS } from "../../utils/timeS";
import { makeDefaultDealPack } from "../makeDefaultDeal";
import { dealExampleLoan } from "./makeExampleLoan";
import { exampleDealMgmt } from "./makeExampleMgmt";
import { makeExampleDealProperty } from "./makeExampleProperty";

export function makeExampleDeal(displayName: string) {
  const deal = PackBuilderSection.initAsOmniChild("deal");
  deal.loadSelf(makeDefaultDealPack());
  const now = timeS.now();
  deal.updateValues({
    dateTimeFirstSaved: now,
    dateTimeLastSaved: now,
  });

  const property = deal.onlyChild("property");
  property.loadSelf(makeExampleDealProperty(""));

  const financing = deal.onlyChild("financing");
  const loan = financing.onlyChild("loan");
  loan.loadSelf(dealExampleLoan);

  financing.updateValues({
    financingMode: "useLoan",
    displayName: loan.get.valueNext("displayName"),
  });

  const mgmt = deal.onlyChild("mgmt");
  mgmt.loadSelf(exampleDealMgmt);

  deal.updateValues({
    displayNameEditor: displayName,
    displayNameSource: "displayNameEditor",
  });

  return deal.makeSectionPack();
}
