import { fullDisplayNameString } from "../SectionsMeta/allDisplaySectionVarbs";
import { mixedInfoS } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import {
  getVarbPathExtras,
  getVarbPathParams,
  VarbPathName,
  VarbPathNameDbInfoMixed,
  VarbPathNameInfoMixed,
  VarbPathNameProp,
  varbPathNames,
  VarbPathParams,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { Arr } from "../utils/Arr";
import { StrictExtract } from "../utils/types";
import { VariableOption } from "./VariableGetterSections";

const varbPathOptionNames = Arr.extractOrder(varbPathNames, [
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

export type ValueFixedVarbPathName = typeof varbPathOptionNames[number];
export interface ValueFixedVarbPathInfo<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> extends VarbPathNameInfoMixed<VPN> {}

export interface ValueCustomVarbPathInfo<
  VPN extends StrictExtract<VarbPathName, "userVarbValue"> = "userVarbValue"
> extends VarbPathNameDbInfoMixed<VPN> {}

type VarbPathArrParam<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> = VarbPathParams<VPN> & VarbPathNameProp<VPN>;

export const varbPathOptionArr: VarbPathArrParam[] = varbPathOptionNames.map(
  (varbPathName) => ({
    varbPathName,
    ...getVarbPathParams(varbPathName),
  })
);

export const varbPathOptions = makeVarbPathOptions();
function makeVarbPathOptions(): VariableOption[] {
  return varbPathOptionNames.reduce((options, varbPathName) => {
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
