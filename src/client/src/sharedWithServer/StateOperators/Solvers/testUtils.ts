import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { GroupKey } from "../../stateSchemas/schema3SectionStructures/GroupName";
import { DealMode } from "../../stateSchemas/schema4ValueTraits/StateValue/dealMode";
import { numObj } from "../../stateSchemas/schema4ValueTraits/StateValue/NumObj";
import { StrictExclude, StrictExtract } from "../../utils/types";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";

export function makeTestProperty(dealMode: DealMode) {
  return SolverActiveDeal.init(dealMode).property;
}

export function makeTestPurchaseFinancing(dealMode: DealMode) {
  return SolverActiveDeal.init(dealMode).purchaseFinancing;
}

export function addHoldingTaxesHomeInsYearly(
  property: SolverSection<"property">,
  taxesVal: number,
  homeInsVal: number
): number {
  const taxes = property.onlyChild("taxesHolding");
  taxes.onlyChild("valueDollarsEditor").updateValues({
    valueEditor: numObj(taxesVal),
    valueEditorFrequency: "yearly",
  });
  const homeIns = property.onlyChild("homeInsHolding");
  homeIns.onlyChild("valueDollarsEditor").updateValues({
    valueEditor: numObj(homeInsVal),
    valueEditorFrequency: "yearly",
  });
  return taxesVal + homeInsVal;
}

export function addOngoingTaxesHomeInsYearly(
  property: SolverSection<"property">,
  taxesVal: number,
  homeInsVal: number
) {
  const taxes = property.onlyChild("taxesOngoing");
  taxes.onlyChild("valueDollarsEditor").updateValues({
    valueEditor: numObj(taxesVal),
    valueEditorFrequency: "yearly",
  });
  const homeIns = property.onlyChild("homeInsOngoing");
  homeIns.onlyChild("valueDollarsEditor").updateValues({
    valueEditor: numObj(homeInsVal),
    valueEditorFrequency: "yearly",
  });
  return {
    taxesMonthly: taxesVal / 12,
    homeInsMonthly: homeInsVal / 12,
  };
}

export function setLoanBaseValue(loan: SolverSection<"loan">, num: number) {
  const baseValue = loan.onlyChild("loanBaseValue");
  baseValue.updateValues({ valueSourceName: "customAmountEditor" });
  const custom = baseValue.onlyChild("customLoanBase");
  custom.updateValues({
    valueSourceName: "valueDollarsEditor",
    valueDollarsEditor: numObj(num),
  });
}
type LoanOptions = {
  hasMortgageIns?: boolean;
  mortgageInsUpfront?: number;
  mortgageInsMonthly?: number;
};
export function setLoanValues(
  loan: SolverSection<"loan">,
  loanAmount: number,
  interestRateYearly: number,
  loanTermYears: number,
  loanOptions: LoanOptions = {}
) {
  const { hasMortgageIns, mortgageInsMonthly, mortgageInsUpfront } =
    loanOptions;

  setLoanBaseValue(loan, loanAmount);

  if (mortgageInsUpfront) {
    const upfrontMortIns = loan.onlyChild("mortgageInsUpfrontValue");
    upfrontMortIns.updateValues({
      valueDollarsEditor: numObj(mortgageInsUpfront),
      valueSourceName: "valueDollarsEditor",
    });
  }

  if (mortgageInsMonthly) {
    const periodicMortIns = loan.onlyChild("mortgageInsPeriodicValue");
    periodicMortIns.updateValues({ valueSourceName: "valueDollarsEditor" });
    periodicMortIns.onlyChild("valueDollarsEditor").updateValues({
      valueEditor: numObj(mortgageInsMonthly),
      valueEditorFrequency: "monthly",
    });
  }

  loan.updateValues({ ...(hasMortgageIns && { hasMortgageIns }) });
  loan.onlyChild("interestRateEditor").updateValues({
    valueEditor: numObj(interestRateYearly),
    valueEditorFrequency: "yearly",
  });
  loan.onlyChild("loanTermEditor").updateValues({
    valueEditor: numObj(loanTermYears),
    valueEditorUnit: "years",
  });

  return loan.numValue("loanPaymentMonthly");
}

export function addRents(
  property: SolverSection<"property">,
  rents: number[],
  periodicSwitch: "monthly" | "yearly" = "monthly"
): number {
  let total = 0;
  for (const rent of rents) {
    total += rent;
    const unit = property.addAndGetChild("unit");
    unit.onlyChild("targetRentEditor").updateValues({
      valueEditor: numObj(rent),
      valueEditorFrequency: periodicSwitch,
    });
  }
  return total;
}

type OnetimeCostSN = StrictExtract<
  SectionName,
  | "miscOnetimeValue"
  | "repairValue"
  | "costOverrunValue"
  | "sellingCostValue"
  | "closingCostValue"
  | "loanBaseExtra"
  | "customLoanBase"
>;

export function setOnetimeEditor<SN extends OnetimeCostSN>(
  onetime: SolverSection<SN>,
  num: number
): number {
  (onetime as SolverSection<any> as SolverSection<OnetimeCostSN>).updateValues({
    valueSourceName: "valueDollarsEditor",
    valueDollarsEditor: numObj(num),
  });
  return num;
}

export function setOnetimeList<SN extends OnetimeCostSN>(
  onetimeCost: SolverSection<SN>,
  listItems: number[]
): number {
  let total = 0;
  const onetime =
    onetimeCost as SolverSection<any> as SolverSection<OnetimeCostSN>;
  onetime.updateValues({ valueSourceName: "listTotal" });
  const list = onetime.onlyChild("onetimeList");
  for (const item of listItems) {
    total += item;
    list.addChildAndSolve("onetimeItem", {
      sectionValues: {
        valueSourceName: "valueDollarsEditor",
        valueDollarsEditor: numObj(item),
      },
    });
  }
  return total;
}

type PeriodicSectionName =
  | "miscPeriodicValue"
  | "maintenanceValue"
  | "utilityValue"
  | "capExValue"
  | "taxesValue"
  | "homeInsValue"
  | "vacancyLossValue"
  | "mgmtBasePayValue"
  | "mortgageInsPeriodicValue"
  | "periodicItem";

export const setPeriodicEditor = <SN extends PeriodicSectionName>(
  section: SolverSection<SN>,
  amount: number,
  groupKey: GroupKey<"periodic"> = "monthly"
) => {
  const typeSection =
    section as SolverSection<any> as SolverSection<PeriodicSectionName>;
  typeSection.updateValues({
    valueSourceName: "valueDollarsEditor",
  });
  const child = typeSection.onlyChild("valueDollarsEditor");
  child.updateValues({
    valueEditor: numObj(amount),
    valueEditorFrequency: groupKey,
  });
};

type PeriodicListSn = StrictExclude<PeriodicSectionName, "periodicItem">;
export function setPeriodicList<SN extends PeriodicListSn>(
  section: SolverSection<SN>,
  items: number[],
  groupKey: GroupKey<"periodic">
) {
  const value = section as SolverSection<any> as SolverSection<PeriodicListSn>;
  value.updateValues({ valueSourceName: "listTotal" });
  const list = value.onlyChild("periodicList");
  list.removeChildrenAndSolve("periodicItem");
  for (const item of items) {
    const pItem = list.addAndGetChild("periodicItem");
    setPeriodicEditor(pItem, item, groupKey);
  }
}

// const testOngoing = (
//   dealMode: DealMode,
//   baseName: "miscOngoingRevenue" | "miscCosts" | "holdingCost",
//   childName: "miscOngoingRevenue" | "miscOngoingCost" | "miscHoldingCost"
// ) => {
//   const property = getProperty(dealMode);
//   const varbNames = switchKeyToVarbNames(baseName, "periodic");

//   const test = (num: number) => {
//     expect(property.numValue(varbNames.monthly)).toBe(num);
//     expect(property.numValue(varbNames.yearly)).toBe(num * 12);
//   };

//   const value = property.onlyChild(childName);
//   addOngoing(property.onlyChild(childName), 100, "monthly");
//   test(100);

//   value.updateValues({ valueSourceName: "listTotal" });
//   const list = value.onlyChild("periodicList");
//   const listItems = [200, 100, 100];
//   for (const item of listItems) {
//     list.addAndGetChild("periodicItem", {
//       sectionValues: {
//         valueSourceName: "valueEditor",
//         valuePeriodicSwitch: "monthly",
//         valuePeriodicEditor: numObj(item),
//       },
//     });
//   }
//   test(400);
// };

export function setRehabCostBase(
  property: SolverSection<"property">,
  repairNum: number,
  miscNum: number
) {
  setOnetimeEditor(property.onlyChild("repairValue"), repairNum);
  setOnetimeEditor(property.onlyChild("miscOnetimeCost"), miscNum);
  return repairNum + miscNum;
}

export function setFirstLoanFor912p6Monthly(
  financing: SolverSection<"financing">,
  property: SolverSection<"property">
): void {
  property.updateValues({ purchasePrice: numObj(200000) });
  financing.updateValues({ financingMethod: "useLoan" });

  const loan = financing.onlyChild("loan");
  loan.onlyChild("interestRateEditor").updateValues({
    valueEditor: numObj(5),
    valueEditorFrequency: "yearly",
  });
  loan.onlyChild("loanTermEditor").updateValues({
    valueEditor: numObj(30),
    valueEditorUnit: "years",
  });

  const baseValue = loan.onlyChild("loanBaseValue");
  baseValue.updateValues({ valueSourceName: "purchaseLoanValue" });
  const purchaseValue = baseValue.onlyChild("purchaseLoanValue");
  purchaseValue.updateValues({
    valueSourceName: "amountPercentEditor",
    amountPercentEditor: numObj(75),
  });

  const extras = baseValue.onlyChild("loanBaseExtra");
  extras.updateValues({ hasLoanExtra: true, valueSourceName: "listTotal" });

  const amounts = [6000, 14000];
  setOnetimeList(extras, amounts);
}
