import { fullDisplayNameString } from "../SectionsMeta/allDisplaySectionVarbs";
import { mixedInfoS } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import {
  getVarbPathExtras,
  getVarbPathParams,
  VarbPathName,
  varbPathNames,
  VarbPathParams,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { Arr } from "../utils/Arr";
import { VariableOption } from "./VariableGetterSections";

const varbPathOptionNames = Arr.extractOrder(varbPathNames, [
  "price",
  "taxesMonthly",
  "taxesYearly",
  "homeInsMonthly",
  "homeInsYearly",
  "sqft",

  "numUnits",
  "numBedrooms",
  "targetRentMonthly",
  "targetRentYearly",

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

export type VarbPathOptionName = typeof varbPathOptionNames[number];

type VarbPathArrParam<VPN extends VarbPathName = VarbPathName> =
  VarbPathParams<VPN> & {
    varbPathName: VPN;
  };

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
function makeVarbPathOption(varbPathName: VarbPathName): VariableOption {
  const { collectionName, sectionName, varbName } =
    getVarbPathExtras(varbPathName);
  return {
    collectionName,
    varbInfo: mixedInfoS.varbPathName(varbPathName),
    displayName: fullDisplayNameString(sectionName, varbName as any),
  };
}
