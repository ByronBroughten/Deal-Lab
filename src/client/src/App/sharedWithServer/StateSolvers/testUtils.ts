import { SectionName } from "../SectionsMeta/SectionName";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { StrictExtract } from "../utils/types";
import { DealMode } from "./../SectionsMeta/values/StateValue/dealMode";
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
  taxes.updateValues({
    valueDollarsPeriodicEditor: numObj(taxesVal),
    valueDollarsPeriodicSwitch: "yearly",
    valueSourceName: "valueDollarsPeriodicEditor",
  });
  const homeIns = property.onlyChild("homeInsHolding");
  homeIns.updateValues({
    valueDollarsPeriodicEditor: numObj(homeInsVal),
    valueDollarsPeriodicSwitch: "yearly",
    valueSourceName: "valueDollarsPeriodicEditor",
  });
  return taxesVal + homeInsVal;
}

export function addOngoingTaxesHomeInsYearly(
  property: SolverSection<"property">,
  taxesVal: number,
  homeInsVal: number
) {
  const taxes = property.onlyChild("taxesOngoing");
  taxes.updateValues({
    valueDollarsPeriodicEditor: numObj(taxesVal),
    valueDollarsPeriodicSwitch: "yearly",
  });
  const homeIns = property.onlyChild("homeInsOngoing");
  homeIns.updateValues({
    valueDollarsPeriodicEditor: numObj(homeInsVal),
    valueDollarsPeriodicSwitch: "yearly",
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
  loan.updateValues({
    ...(hasMortgageIns && { hasMortgageIns }),
    ...(mortgageInsMonthly && {
      mortgageInsPeriodicEditor: numObj(mortgageInsMonthly),
      mortgageInsPeriodicSwitch: "monthly",
    }),
    ...(mortgageInsUpfront && {
      mortgageInsUpfrontEditor: numObj(mortgageInsUpfront),
    }),
    interestRatePercentPeriodicSwitch: "yearly",
    interestRatePercentPeriodicEditor: numObj(interestRateYearly),
    loanTermSpanEditor: numObj(loanTermYears),
    loanTermSpanSwitch: "years",
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
    property.addChildAndSolve("unit", {
      sectionValues: {
        targetRentPeriodicEditor: numObj(rent),
        targetRentPeriodicSwitch: periodicSwitch,
      },
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
        valueEditor: numObj(item),
      },
    });
  }
  return total;
}

type OngoingSectionName =
  | "miscPeriodicValue"
  | "maintenanceValue"
  | "utilityValue"
  | "capExValue"
  | "taxesValue"
  | "homeInsValue"
  | "vacancyLossValue"
  | "mgmtBasePayValue";

export const setPeriodicEditor = <SN extends OngoingSectionName>(
  section: SolverSection<SN>,
  amount: number,
  switchVal: "yearly" | "monthly" = "monthly"
) => {
  (
    section as SolverSection<any> as SolverSection<OngoingSectionName>
  ).updateValues({
    valueSourceName: "valueDollarsPeriodicEditor",
    valueDollarsPeriodicSwitch: switchVal,
    valueDollarsPeriodicEditor: numObj(amount),
  });
};

type PeriodicListSn = OngoingSectionName | "utilityValue";
export function setPeriodicList<SN extends PeriodicListSn>(
  section: SolverSection<SN>,
  items: number[],
  switchVal: "yearly" | "monthly"
) {
  const value = section as SolverSection<any> as SolverSection<PeriodicListSn>;
  value.updateValues({
    valueSourceName: "listTotal",
    valueDollarsPeriodicSwitch: switchVal,
  });
  const list = value.onlyChild("periodicList");
  list.removeChildrenAndSolve("periodicItem");
  for (const item of items) {
    list.addAndGetChild("periodicItem", {
      sectionValues: {
        valueSourceName: "valueDollarsPeriodicEditor",
        valuePeriodicSwitch: switchVal,
        valuePeriodicEditor: numObj(item),
      },
    });
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
  loan.updateValues({
    interestRatePercentPeriodicSwitch: "yearly",
    interestRatePercentPeriodicEditor: numObj(5),
    loanTermSpanSwitch: "years",
    loanTermSpanEditor: numObj(30),
  });

  const baseValue = loan.onlyChild("loanBaseValue");
  baseValue.updateValues({ valueSourceName: "purchaseLoanValue" });
  const purchaseValue = baseValue.onlyChild("purchaseLoanValue");
  purchaseValue.updateValues({
    valueSourceName: "amountPercentEditor",
    amountPercentEditor: numObj(75),
  });

  const wrappedValue = loan.addAndGetChild("wrappedInLoanValue", {
    sectionValues: { valueSourceName: "listTotal" },
  });
  const wrapped = wrappedValue.onlyChild("onetimeList");
  const amounts = [6000, 14000];

  for (const amount of amounts) {
    wrapped.addChildAndSolve("onetimeItem", {
      sectionValues: { valueEditor: numObj(amount) },
    });
  }
}
