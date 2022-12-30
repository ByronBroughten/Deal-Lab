import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";

export function makeExampleLoan() {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    dbId: "exampleloan1",
    dbVarbs: {},
  });
  const closingCostGroup = loan.addAndGetChild("closingCostListGroup");
  const closingCostList = closingCostGroup.addAndGetChild("singleTimeList", {
    dbVarbs: {
      displayName: stringObj("Closing items"),
    },
  });
  closingCostList.addChild("singleTimeItem", {
    dbVarbs: {
      displayNameEditor: "Lump Sum",
      valueEditor: numObj(6000),
    },
  });
  const wrappedInLoanGroup = loan.addAndGetChild("wrappedInLoanListGroup");
  const sellerPaidList = wrappedInLoanGroup.addAndGetChild("singleTimeList", {
    dbVarbs: {
      displayName: stringObj("Seller-paid costs"),
    },
  });
  sellerPaidList.addChild("singleTimeItem", {
    dbVarbs: {
      displayNameEditor: "Closing",
      valueEditor: numObj(2500),
    },
  });
}
