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
  "taxesMonthly",
  "taxesYearly",
  "homeInsMonthly",
  "homeInsYearly",
  "utilitiesMonthly",
] as const;

const sharedUpfront = ["rehabCost", "repairCostBase"] as const;

const financing = [
  "downPaymentDollars",
  "downPaymentPercent",
  "loanTotalDollars",
  "loanPaymentMonthly",
  "loanPaymentYearly",
  "pitiMonthly",
  "pitiYearly",
] as const;

const mgmt = [
  "basePayDollarsMonthly",
  "basePayDollarsYearly",
  "managementExpensesMonthly",
  "managementExpensesYearly",
] as const;

const sharedOutputs = ["totalInvestment"] as const;
const sharedExtras = ["onePercentPrice", "twoPercentPrice"] as const;

const fixAndFlipBasics = [
  "afterRepairValue",
  "sellingCosts",
  "holdingPeriodMonths",
] as const;
const fixAndFlipOutputs = [
  "totalProfit",
  "roiPercent",
  "roiPercentAnnualized",
] as const;
const fixAndFlip = [
  ...sharedBasics,
  ...nonHomebuyBasics,
  ...fixAndFlipBasics,
  ...sharedOngoing,
  ...sharedUpfront,
  ...financing,
  ...sharedOutputs,
  ...fixAndFlipOutputs,
  ...sharedExtras,
] as const;

const ongoingOutputs = ["dealExpensesMonthly", "dealExpensesYearly"] as const;

const buyAndHoldBasics = [
  "numBedrooms",
  "targetRentMonthly",
  "targetRentYearly",
] as const;
const buyAndHoldOutputs = [
  "cashFlowMonthly",
  "cashFlowYearly",
  "cocRoiMonthly",
  "cocRoiYearly",
] as const;
const buyAndHoldExtras = [
  "fivePercentRentMonthly",
  "fivePercentRentYearly",
] as const;
const buyAndHold = [
  ...sharedBasics,
  ...nonHomebuyBasics,
  ...buyAndHoldBasics,
  ...sharedOngoing,
  ...sharedUpfront,
  ...financing,
  ...mgmt,
  ...sharedOutputs,
  ...ongoingOutputs,
  ...buyAndHoldOutputs,
  ...sharedExtras,
  ...buyAndHoldExtras,
] as const;

const homeBuyer = [
  ...sharedBasics,
  "numBedrooms",
  ...sharedOngoing,
  ...sharedUpfront,
  ...financing,
  ...sharedOutputs,
  ...ongoingOutputs,
  ...sharedExtras,
] as const;

export const fixedVarbPathNames = checkFixedVarbNames({
  buyAndHold,
  fixAndFlip,
  homeBuyer,
  mixed: [
    ...sharedBasics,
    ...nonHomebuyBasics,
    "numBedrooms",
    ...buyAndHoldBasics,
    ...fixAndFlipBasics,
    ...sharedOngoing,
    ...sharedUpfront,
    ...financing,
    ...mgmt,
    ...sharedOutputs,
    ...ongoingOutputs,
    ...buyAndHoldOutputs,
    ...fixAndFlipOutputs,
    ...sharedExtras,
    ...buyAndHoldExtras,
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
