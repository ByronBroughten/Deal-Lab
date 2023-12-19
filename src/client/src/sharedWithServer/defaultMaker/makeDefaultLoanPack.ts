import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";
import { numObj } from "../sectionVarbsConfig/StateValue/NumObj";
import { FinancingMode } from "../sectionVarbsConfig/StateValue/financingMode";

export function makeDefaultLoanPack(
  financingMode?: FinancingMode
): SectionPack<"loan"> {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    sectionValues: {
      ...(financingMode && { financingMode }),
    },
  });

  loan.addChild("interestRateEditor", {
    sectionValues: { valueEditorFrequency: "yearly" },
  });
  loan.addChild("loanTermEditor", {
    sectionValues: { valueEditorUnit: "years", valueEditor: numObj(30) },
  });

  loan.addChild("prepaidInterest");
  (["prepaidTaxes", "prepaidHomeIns"] as const).forEach((childName) => {
    const child = loan.addAndGetChild(childName);
    child.addChild("timespanEditor");
  });

  financingMode = loan.get.valueNext("financingMode");
  const baseValue = loan.addAndGetChild("loanBaseValue", {
    sectionValues: {
      financingMode,
      valueSourceName:
        financingMode === "purchase" ? "purchaseLoanValue" : "arvLoanValue",
    },
  });

  baseValue.addChild("purchaseLoanValue");
  baseValue.addChild("repairLoanValue");
  baseValue.addChild("arvLoanValue");

  const loanExtra = baseValue.addAndGetChild("loanBaseExtra");
  loanExtra.addChild("onetimeList");
  const customBase = baseValue.addAndGetChild("customLoanBase");
  customBase.addChild("onetimeList");

  const closingCostValue = loan.addAndGetChild("closingCostValue");
  closingCostValue.addChild("onetimeList");

  loan.addChild("mortgageInsUpfrontValue");
  const mortIns = loan.addAndGetChild("mortgageInsPeriodicValue", {
    sectionValues: { valueSourceName: "valuePercentEditor" },
  });
  mortIns.addChild("valueDollarsEditor");
  mortIns.addChild("valuePercentEditor", {
    sectionValues: {
      valueEditorFrequency: "yearly",
      valueEditor: numObj(0),
    },
  });
  return loan.makeSectionPack();
}
