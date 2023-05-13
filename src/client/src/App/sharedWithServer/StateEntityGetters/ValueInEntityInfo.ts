import { Id } from "../SectionsMeta/IdS";
import {
  VarbPathName,
  VarbPathNameDbInfoMixed,
  VarbPathNameInfoMixed,
  varbPathNames,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { DealModeOrMixed } from "../SectionsMeta/values/StateValue/dealMode";
import { Arr } from "../utils/Arr";
import { ValidationError } from "../utils/Error";
import { Obj } from "../utils/Obj";
import { validateS } from "../validateS";

const checkFixedVarbNames = <
  T extends Record<DealModeOrMixed, readonly VarbPathName[]>
>(
  t: T
) => t;

const sharedBasics = ["purchasePrice", "sqft", "numUnits"] as const;

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
  ...fixAndFlipBasics,
  ...sharedOngoing,
  ...sharedUpfront,
  ...financing,
  ...sharedOutputs,
  ...fixAndFlipOutputs,
  ...sharedExtras,
] as const;

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
  ...buyAndHoldBasics,
  ...sharedOngoing,
  ...sharedUpfront,
  ...financing,
  ...mgmt,
  ...sharedOutputs,
  ...buyAndHoldOutputs,
  ...sharedExtras,
  ...buyAndHoldExtras,
] as const;

export const fixedVarbPathNames = checkFixedVarbNames({
  buyAndHold,
  fixAndFlip,
  mixed: [
    ...sharedBasics,
    ...buyAndHoldBasics,
    ...fixAndFlipBasics,
    ...sharedOngoing,
    ...sharedUpfront,
    ...financing,
    ...mgmt,
    ...sharedOutputs,
    ...buyAndHoldOutputs,
    ...fixAndFlipOutputs,
    ...sharedExtras,
    ...buyAndHoldExtras,
  ] as const,
});
type FixedVarbPathOptions = typeof fixedVarbPathNames;
export type ValueFixedVarbPathName =
  FixedVarbPathOptions[DealModeOrMixed][number];

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
  try {
    return validateInEntityInfoFixed(value);
  } catch (err) {
    if (!(err instanceof ValidationError)) {
      throw err;
    }
  }
  return validateInEntityInfoCustom(value);
}
