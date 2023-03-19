import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { timeS } from "../../utils/date";
import { makeDefaultDealPack } from "../makeDefaultDeal";
import { dealExampleLoan } from "./makeExampleLoan";
import { exampleDealMgmt } from "./makeExampleMgmt";
import { makeExampleDealProperty } from "./makeExampleProperty";

export function makeExampleDeal(propertyTitle: string) {
  const deal = PackBuilderSection.initAsOmniChild("deal");
  deal.loadSelf(makeDefaultDealPack());
  const now = timeS.now();
  deal.updateValues({
    dateTimeFirstSaved: now,
    dateTimeLastSaved: now,
  });

  const property = deal.onlyChild("property");
  property.loadSelf(makeExampleDealProperty(propertyTitle));

  const financing = deal.onlyChild("financing");
  financing.updateValues({
    financingMode: "useLoan",
  });
  const loan = financing.onlyChild("loan");
  loan.loadSelf(dealExampleLoan);

  const mgmt = deal.onlyChild("mgmt");
  mgmt.loadSelf(exampleDealMgmt);

  return deal.makeSectionPack();
}
