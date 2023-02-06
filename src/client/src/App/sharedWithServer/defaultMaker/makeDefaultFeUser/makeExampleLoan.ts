import { numObj } from "../../SectionsMeta/allBaseSectionVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/allBaseSectionVarbs/baseValues/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";

export function makeExampleLoan() {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    dbId: "exampleloan1",
    dbVarbs: {},
  });

  loan.addChild("closingCostValue", {
    dbVarbs: {
      valueLumpSumEditor: numObj(6000),
      valueMode: "lumpSum",
    },
  });
  loan.addChild("wrappedInLoanValue", {
    dbVarbs: { displayNameEditor: stringObj("Other financed costs") },
  });

  const closingCostGroup = loan.addAndGetChild("closingCostValue");
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
  const wrappedInLoanGroup = loan.addAndGetChild("wrappedInLoanValue");
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
