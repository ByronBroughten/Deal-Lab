import { mixedInfoS } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import {
  getVarbPathParams,
  VarbPathName,
  varbPathNames,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { pathSectionName } from "../SectionsMeta/sectionPathContexts/sectionPathNames";
import { getVarbMeta } from "../SectionsMeta/VarbMeta";
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
  const { pathName, varbName, collectionName } =
    getVarbPathParams(varbPathName);
  const sectionName = pathSectionName(pathName);
  return {
    varbInfo: mixedInfoS.varbPathName(varbPathName),
    collectionName,
    displayName: getVarbMeta({ sectionName, varbName: varbName as string })
      .displayNameFull,
  };
}
