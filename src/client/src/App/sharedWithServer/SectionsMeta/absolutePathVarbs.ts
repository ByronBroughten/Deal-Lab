import { Obj } from "../utils/Obj";
import { Arr } from "./../utils/Arr";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";
import { VarbNames } from "./baseSectionsDerived/baseVarbInfo";
import { childPathNames, PathSectionName } from "./childPaths";
import { SectionName } from "./SectionName";
import { VarbMeta } from "./VarbMeta";

export const activePathNames = Arr.extractStrict(childPathNames, [
  "activeDeal",
  "activeFinancing",
  "activeMgmtGeneral",
  "activePropertyGeneral",
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
  VNS extends VarbName<PathSectionName<PN>>
> = {
  [P in PN]: VNS[];
};

function optionVarbsProp<
  PN extends ActivePathName,
  VNS extends VarbName<PathSectionName<PN>>
>(pathName: PN, varbNames: VNS[]): OptionVarbsProp<PN, VNS> {
  return {
    [pathName]: varbNames,
  } as OptionVarbsProp<PN, VNS>;
}

export const globalOptionVarbs = {
  ...optionVarbsProp("activePropertyGeneral", [
    "price",
    "sqft",
    "taxesYearly",
    "taxesMonthly",
    "numBedrooms",
    "numUnits",
    "targetRentMonthly",
    "targetRentYearly",
  ]),
  ...optionVarbsProp("activeMgmtGeneral", [
    "vacancyRatePercent",
    "rentCutDollarsMonthly",
    "rentCutDollarsYearly",
  ]),
  ...optionVarbsProp("activeFinancing", [
    "loanBaseDollars",
    "loanBasePercent",
    "mortgageInsYearly",
    "mortgageInsMonthly",
    "closingCosts",
    "wrappedInLoan",
    "loanPaymentMonthly",
    "loanPaymentYearly",
  ]),
  ...optionVarbsProp("activeDeal", [
    "pitiMonthly",
    "pitiYearly",
    "downPaymentDollars",
    "downPaymentPercent",
    "totalInvestment",
    "cashFlowMonthly",
    "cashFlowYearly",
    "roiMonthly",
    "roiYearly",
    "upfrontExpenses",
    "expensesMonthly",
    "expensesYearly",
    "revenueMonthly",
    "revenueYearly",
  ]),
} as const;

type GlobalOptionVarbArrs = typeof globalOptionVarbs;
type GlobalOptionVarbs = {
  [PN in keyof GlobalOptionVarbArrs]: GlobalOptionVarbArrs[PN][number];
};
type OptionVarbsToPathName = {
  [PN in keyof GlobalOptionVarbs as GlobalOptionVarbs[PN]]: PN;
};
const optionVarbsToPathName = Obj.keys(globalOptionVarbs).reduce(
  (result, pathName) => {
    const varbNames = globalOptionVarbs[pathName];
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
