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
  property.updateValues({
    taxesHoldingPeriodicEditor: numObj(taxesVal),
    taxesHoldingPeriodicSwitch: "yearly",
    homeInsHoldingPeriodicEditor: numObj(homeInsVal),
    homeInsHoldingPeriodicSwitch: "yearly",
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
}

export function addRents(
  property: SolverSection<"property">,
  rents: number[]
): number {
  let total = 0;
  for (const rent of rents) {
    total += rent;
    property.addChildAndSolve("unit", {
      sectionValues: {
        targetRentPeriodicEditor: numObj(rent),
        targetRentPeriodicSwitch: "monthly",
      },
    });
  }
  return total;
}

type OnetimeCostSN = StrictExtract<
  SectionName,
  | "miscOnetimeCost"
  | "repairValue"
  | "costOverrunValue"
  | "sellingCostValue"
  | "closingCostValue"
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
    list.addChildAndSolve("singleTimeItem", {
      sectionValues: {
        valueSourceName: "valueEditor",
        valueEditor: numObj(item),
      },
    });
  }
  return total;
}

type OngoingSectionName =
  | "miscOngoingCost"
  | "miscRevenueValue"
  | "miscHoldingCost"
  | "maintenanceValue"
  | "capExValue";

export const setPeriodicEditor = <SN extends OngoingSectionName>(
  section: SolverSection<SN>,
  amount: number,
  switchVal: "yearly" | "monthly"
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
  value.updateValues({ valueSourceName: "listTotal" });
  const list = value.onlyChild("ongoingList");
  for (const item of items) {
    list.addAndGetChild("ongoingItem", {
      sectionValues: {
        valueSourceName: "valueEditor",
        valuePeriodicSwitch: switchVal,
        valuePeriodicEditor: numObj(item),
      },
    });
  }
}

// const testOngoing = (
//   dealMode: DealMode,
//   baseName: "miscRevenue" | "miscCosts" | "holdingCost",
//   childName: "miscRevenueValue" | "miscOngoingCost" | "miscHoldingCost"
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
//   const list = value.onlyChild("ongoingList");
//   const listItems = [200, 100, 100];
//   for (const item of listItems) {
//     list.addAndGetChild("ongoingItem", {
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
