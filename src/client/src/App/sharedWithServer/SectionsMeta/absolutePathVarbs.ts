import { Obj } from "../utils/Obj";
import { Arr } from "./../utils/Arr";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";
import { VarbNames } from "./baseSectionsDerived/baseVarbInfo";
import { SectionName } from "./SectionName";
import {
  SectionNameOfPath,
  sectionPathNames,
} from "./sectionPathContexts/sectionPathNames";
import { VarbMeta } from "./VarbMeta";

export const activePathNames = Arr.extractStrict(sectionPathNames, [
  "dealFocal",
  "financingFocal",
  "mgmtGeneralFocal",
  "propertyGeneralFocal",
] as const);

export type ActivePathName = typeof activePathNames[number];

export function activeVarbDisplayName<SN extends SectionName>({
  sectionName,
  varbName,
}: VarbNames<SN>): string {
  const varbMeta = VarbMeta.init({
    sectionName,
    varbName: varbName as string,
  });
  return varbMeta.displayNameFull;
}

type OptionVarbsProp<
  PN extends ActivePathName,
  VNS extends VarbName<SectionNameOfPath<PN>>
> = {
  [P in PN]: VNS[];
};

function optionVarbsProp<
  PN extends ActivePathName,
  VNS extends VarbName<SectionNameOfPath<PN>>
>(pathName: PN, varbNames: VNS[]): OptionVarbsProp<PN, VNS> {
  return {
    [pathName]: varbNames,
  } as OptionVarbsProp<PN, VNS>;
}

export const soloVarbOptions = {
  ...optionVarbsProp("propertyGeneralFocal", [
    "price",
    "sqft",
    "taxesYearly",
    "taxesMonthly",
    "numBedrooms",
    "numUnits",
    "targetRentMonthly",
    "targetRentYearly",
  ]),
  ...optionVarbsProp("mgmtGeneralFocal", [
    "vacancyRatePercent",
    "rentCutDollarsMonthly",
    "rentCutDollarsYearly",
  ]),
  ...optionVarbsProp("financingFocal", [
    "loanBaseDollars",
    "loanBasePercent",
    "mortgageInsYearly",
    "mortgageInsMonthly",
    "closingCosts",
    "wrappedInLoan",
    "loanPaymentMonthly",
    "loanPaymentYearly",
  ]),
  ...optionVarbsProp("dealFocal", [
    "pitiMonthly",
    "pitiYearly",
    "downPaymentDollars",
    "downPaymentPercent",
    "totalInvestment",
    "cashFlowMonthly",
    "cashFlowYearly",
    "cocRoiMonthly",
    "cocRoiYearly",
    "upfrontExpenses",
    "expensesMonthly",
    "expensesYearly",
    "revenueMonthly",
    "revenueYearly",
  ]),
} as const;

type GlobalOptionVarbArrs = typeof soloVarbOptions;
type GlobalOptionVarbs = {
  [PN in keyof GlobalOptionVarbArrs]: GlobalOptionVarbArrs[PN][number];
};
type OptionVarbsToPathName = {
  [PN in keyof GlobalOptionVarbs as GlobalOptionVarbs[PN]]: PN;
};
const optionVarbsToPathName = Obj.keys(soloVarbOptions).reduce(
  (result, pathName) => {
    const varbNames = soloVarbOptions[pathName];
    for (const varbName of varbNames) {
      (result as any)[varbName] = pathName;
    }
    return result;
  },
  {} as OptionVarbsToPathName
);

export type OptionVarbName = keyof OptionVarbsToPathName;
export type OptionVarbPathName<OVN extends OptionVarbName> =
  OptionVarbsToPathName[OVN];
export function optionVarbPathName<OVN extends OptionVarbName>(
  varbName: OVN
): OptionVarbPathName<OVN> {
  return optionVarbsToPathName[varbName];
}
