import { Id } from "../SectionsMeta/IdS";
import {
  VarbPathNameDbInfoMixed,
  VarbPathNameInfoMixed,
  varbPathNames,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { Arr } from "../utils/Arr";
import { ValidationError } from "../utils/Error";
import { Obj } from "../utils/Obj";
import { validateS } from "../validateS";

export const fixedVarbOptionNames = Arr.extractOrder(varbPathNames, [
  "purchasePrice",
  "taxesMonthly",
  "taxesYearly",
  "homeInsMonthly",
  "homeInsYearly",
  "sqft",

  "numUnits",
  "numBedrooms",
  "targetRentMonthly",
  "targetRentYearly",
  "rehabCost",
  "repairCostBase",

  "downPaymentDollars",
  "downPaymentPercent",
  "cashFlowMonthly",
  "cashFlowYearly",

  "onePercentPrice",
  "twoPercentPrice",
  "fivePercentRentMonthly",
  "fivePercentRentYearly",

  "loanTotalDollars",
  "loanPaymentMonthly",
  "loanPaymentYearly",
  "pitiMonthly",
  "pitiYearly",

  "basePayDollarsMonthly",
  "basePayDollarsYearly",
  "managementExpensesMonthly",
  "managementExpensesYearly",

  "cocRoiMonthly",
  "cocRoiYearly",
  "totalInvestment",
] as const);

export type ValueFixedVarbPathName = typeof fixedVarbOptionNames[number];
export interface ValueFixedVarbPathInfo<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> extends VarbPathNameInfoMixed<VPN> {}

export function validateInEntityInfoFixed(value: any): ValueFixedVarbPathInfo {
  const obj = Obj.validateObjToAny(value) as ValueFixedVarbPathInfo;
  return {
    infoType: validateS.literal(obj.infoType, "varbPathName"),
    varbPathName: validateS.unionLiteral(
      obj.varbPathName,
      fixedVarbOptionNames
    ),
  };
}

const customVarbOptionNames = Arr.extractStrict(varbPathNames, [
  "userVarbValue",
] as const);
type CustomVarbOptionName = typeof customVarbOptionNames[number];

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
