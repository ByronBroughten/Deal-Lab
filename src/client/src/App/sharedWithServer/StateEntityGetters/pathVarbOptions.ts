import { fullDisplayNameString } from "../SectionsMeta/allDisplaySectionVarbs";
import { mixedInfoS } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import {
  getVarbPathExtras,
  VarbPathName,
  varbPathNames,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { Arr } from "../utils/Arr";
import { VariableOption } from "./VariableGetterSections";

const varbPathOptionNames = Arr.extractStrict(varbPathNames, [
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

  "vacancyLossPercent",

  "cocRoiMonthly",
  "cocRoiYearly",
  "totalInvestment",
] as const);

export const varbPathOptions = makeVarbPathOptions();
function makeVarbPathOptions(): VariableOption[] {
  return varbPathOptionNames.reduce((options, varbPathName) => {
    options.push(makeVarbPathOption(varbPathName));
    return options;
  }, [] as VariableOption[]);
}
export function makeVarbPathOption(varbPathName: VarbPathName): VariableOption {
  const { collectionName, sectionName, varbName } =
    getVarbPathExtras(varbPathName);
  return {
    collectionName,
    varbInfo: mixedInfoS.varbPathName(varbPathName),
    displayName: fullDisplayNameString(sectionName, varbName as any),
  };
}
