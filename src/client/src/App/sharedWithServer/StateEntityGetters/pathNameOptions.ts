import { fullDisplayNameString } from "../SectionsMeta/allDisplaySectionVarbs";
import { Id } from "../SectionsMeta/IdS";
import { mixedInfoS } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import {
  getVarbPathExtras,
  getVarbPathParams,
  VarbPathNameDbInfoMixed,
  VarbPathNameInfoMixed,
  VarbPathNameProp,
  varbPathNames,
  VarbPathParams,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { validateValueS } from "../validators";
import { VariableOption } from "./VariableGetterSections";

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
  "upfrontRepairCost",

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
    infoType: validateValueS.literal(obj.infoType, "varbPathName"),
    varbPathName: validateValueS.unionLiteral(
      obj.varbPathName,
      fixedVarbOptionNames
    ),
  };
}

export const customVarbOptionNames = Arr.extractStrict(varbPathNames, [
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
    infoType: validateValueS.literal(obj.infoType, "varbPathDbId"),
    dbId: Id.validate(obj.dbId),
    varbPathName: validateValueS.unionLiteral(
      obj.varbPathName,
      customVarbOptionNames
    ),
  };
}

type VarbPathArrParam<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> = VarbPathParams<VPN> & VarbPathNameProp<VPN>;

export const varbPathOptionArr: VarbPathArrParam[] = fixedVarbOptionNames.map(
  (varbPathName) => ({
    varbPathName,
    ...getVarbPathParams(varbPathName),
  })
);

export const varbPathOptions = makeVarbPathOptions();
function makeVarbPathOptions(): VariableOption[] {
  return fixedVarbOptionNames.reduce((options, varbPathName) => {
    options.push(makeVarbPathOption(varbPathName));
    return options;
  }, [] as VariableOption[]);
}
function makeVarbPathOption(
  varbPathName: ValueFixedVarbPathName
): VariableOption {
  const { collectionName, sectionName, varbName } =
    getVarbPathExtras(varbPathName);
  return {
    collectionName,
    varbInfo: mixedInfoS.varbPathName(varbPathName),
    displayName: fullDisplayNameString(sectionName, varbName as any),
  };
}
