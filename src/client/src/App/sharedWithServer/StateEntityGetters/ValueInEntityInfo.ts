import { Id } from "../SectionsMeta/IdS";
import {
  VarbPathName,
  VarbPathNameDbInfoMixed,
  VarbPathNameInfoMixed,
  varbPathNames,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { DealMode } from "../SectionsMeta/values/StateValue/dealMode";
import { Arr } from "../utils/Arr";
import { ValidationError } from "../utils/Error";
import { Obj } from "../utils/Obj";
import { validateS } from "../validateS";

const checkFixedVarbNames = <
  T extends Record<DealMode<"plusMixed">, readonly VarbPathName[]>
>(
  t: T
) => t;

const sharedBasics = ["purchasePrice", "sqft"] as const;
const nonHomebuyBasics = ["numUnits"] as const;

const sharedOngoing = [
  "taxesOngoingMonthly",
  "taxesOngoingYearly",
  "homeInsOngoingMonthly",
  "homeInsOngoingYearly",
  "utilitiesOngoingMonthly",
] as const;

const sharedUpfront = ["rehabCost", "rehabCostBase"] as const;
const financing = [
  "ongoingPitiMonthly",
  "ongoingPitiYearly",
  "ongoingLoanPaymentMonthly",
  "ongoingLoanPaymentYearly",
] as const;

const mgmt = [
  "basePayDollarsMonthly",
  "basePayDollarsYearly",
  "managementExpensesMonthly",
  "managementExpensesYearly",
] as const;

const sharedOutputs = ["totalInvestment"] as const;
const sharedExtras = ["onePercentPrice", "twoPercentPrice"] as const;

const hasHoldingBasics = [
  "afterRepairValue",
  "holdingPeriodMonths",
  "onePercentArv",
  "twoPercentArv",
] as const;
const fixAndFlipBasics = ["sellingCosts"] as const;
const hasProfitOutputs = [
  "valueAddProfit",
  "valueAddRoiPercent",
  "valueAddRoiPercentAnnualized",

  "vaProfitOnSale",
  "vaRoiOnSalePercent",
  "vaRoiOnSalePercentAnnualized",
] as const;
const fixAndFlip = [
  ...sharedBasics,
  ...nonHomebuyBasics,
  ...hasHoldingBasics,
  ...fixAndFlipBasics,
  ...sharedUpfront,
  ...financing,
  ...sharedOutputs,
  ...hasProfitOutputs,
  ...sharedExtras,
] as const;

const hasOngoingOutputs = [
  "dealExpensesOngoingMonthly",
  "dealExpensesOngoingYearly",
  "averageNonPrincipalOngoingMonthly",
  "averageNonPrincipalOngoingYearly",
] as const;

const hasRentBasics = ["targetRentMonthly", "targetRentYearly"] as const;
const hasCashflowOutputs = [
  "cashFlowMonthly",
  "cashFlowYearly",
  "cocRoiMonthly",
  "cocRoiYearly",
] as const;
const hasRentExtras = [
  "fivePercentRentMonthly",
  "fivePercentRentYearly",
] as const;
const buyAndHold = [
  ...sharedBasics,
  "numBedrooms",
  ...nonHomebuyBasics,
  ...hasRentBasics,
  ...sharedOngoing,
  ...sharedUpfront,
  ...financing,
  ...mgmt,
  ...sharedOutputs,
  ...hasOngoingOutputs,
  ...hasCashflowOutputs,
  ...hasProfitOutputs,
  ...sharedExtras,
  ...hasRentExtras,
] as const;

const homeBuyer = [
  ...sharedBasics,
  "likability",
  "numBedrooms",
  ...sharedOngoing,
  ...sharedUpfront,
  ...financing,
  ...sharedOutputs,
  ...hasOngoingOutputs,
  ...sharedExtras,
] as const;

const brrrr = [
  ...sharedBasics,
  "numBedrooms",
  ...nonHomebuyBasics,
  ...hasRentBasics,
  ...hasHoldingBasics,
  ...sharedOngoing,
  ...sharedUpfront,
  ...financing,
  ...mgmt,
  ...sharedOutputs,
  ...hasOngoingOutputs,
  ...hasCashflowOutputs,
  ...hasProfitOutputs,
  ...sharedExtras,
  ...hasRentExtras,
] as const;

export const fixedVarbPathNames = checkFixedVarbNames({
  buyAndHold,
  fixAndFlip,
  homeBuyer,
  brrrr,
  mixed: [
    ...sharedBasics,
    "likability",
    "numBedrooms",
    ...nonHomebuyBasics,
    ...hasRentBasics,
    ...hasHoldingBasics,
    ...fixAndFlipBasics,
    ...sharedOngoing,
    ...sharedUpfront,
    ...financing,
    ...mgmt,
    ...sharedOutputs,
    ...hasOngoingOutputs,
    ...hasCashflowOutputs,
    ...hasProfitOutputs,
    ...sharedExtras,
    ...hasRentExtras,
  ] as const,
});

// const allVarbPathNames = [...new Set([
//   ...fixedVarbPathNames.homeBuyer,
//   ...fixedVarbPathNames.buyAndHold,
//   ...fixedVarbPathNames.fixAndFlip
// ])]

type FixedVarbPathOptions = typeof fixedVarbPathNames;
export type ValueFixedVarbPathName =
  FixedVarbPathOptions[DealMode<"plusMixed">][number];

const mixedVarbPathNames: readonly ValueFixedVarbPathName[] =
  fixedVarbPathNames["mixed"];

export interface ValueFixedVarbPathInfo<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> extends VarbPathNameInfoMixed<VPN> {}

export function validateInEntityInfoFixed(value: any): ValueFixedVarbPathInfo {
  const obj = Obj.validateObjToAny(value) as ValueFixedVarbPathInfo;
  return {
    infoType: validateS.literal(obj.infoType, "varbPathName"),
    varbPathName: validateS.unionLiteral(obj.varbPathName, mixedVarbPathNames),
  };
}

const customVarbOptionNames = Arr.extractStrict(varbPathNames, [
  "userVarbValue",
] as const);
type CustomVarbOptionName = (typeof customVarbOptionNames)[number];

export interface ValueCustomVarbPathInfo<
  VPN extends CustomVarbOptionName = CustomVarbOptionName
> extends VarbPathNameDbInfoMixed<VPN> {}
export function validateInEntityInfoCustom(
  value: any
): ValueCustomVarbPathInfo {
  const obj = Obj.validateObjToAny(value) as ValueCustomVarbPathInfo;
  return {
    infoType: validateS.literal(obj.infoType, "varbPathDbId"),
    dbId: Id.validate(obj.dbId),
    varbPathName: validateS.unionLiteral(
      obj.varbPathName,
      customVarbOptionNames
    ),
  };
}

export type ValueInEntityInfo =
  | ValueFixedVarbPathInfo
  | ValueCustomVarbPathInfo;

export function validateInEntityInfo(value: any): ValueInEntityInfo {
  if ((value as ValueInEntityInfo).infoType === "varbPathName") {
    return validateInEntityInfoFixed(value);
  } else if ((value as ValueInEntityInfo).infoType === "varbPathDbId") {
    return validateInEntityInfoCustom(value);
  } else {
    throw new ValidationError(
      `value infoType "${value.infoType}" is not valid`
    );
  }
}
