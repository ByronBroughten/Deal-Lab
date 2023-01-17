import {
  SectionPathName,
  SectionPathVarbName,
} from "../sectionPathContexts/sectionPathNames";

type VarbPathParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
> = {
  pathName: PN;
  varbName: VN;
  collectionName: string;
};

export const allVarbPathParams = {
  ...sectionVarbNameParams("calculatedVarbsFocal", "Financing", [
    "loanBaseDollars",
    "mortgageInsYearly",
    "mortgageInsMonthly",
    "closingCosts",
    "loanPaymentMonthly",
    "loanPaymentYearly",
  ]),
  ...sectionVarbNameParams("calculatedVarbsFocal", "Property", [
    "onePercentPrice",
  ]),
  ...sectionVarbNameParams("propertyFocal", "Property", [
    "price",
    "sqft",
    "taxesYearly",
    "taxesMonthly",
    "numBedrooms",
    "numUnits",
    "targetRentMonthly",
    "targetRentYearly",
  ]),
  ...sectionVarbNameParams("mgmtFocal", "Management", [
    "vacancyLossPercent",
    "basePayDollarsMonthly",
    "basePayDollarsYearly",
  ]),
  ...sectionVarbNameParams("dealFocal", "Deal", [
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
};
type AllVarbPathParams = typeof allVarbPathParams;
export type VarbPathName = keyof AllVarbPathParams;
export type VarbSectionPathName<VPN extends VarbPathName = VarbPathName> =
  AllVarbPathParams[VPN]["pathName"];
export function varbSectionPathName<VPN extends VarbPathName>(
  varbPathName: VPN
): VarbSectionPathName<VPN> {
  return allVarbPathParams[varbPathName]["pathName"];
}

export function getVarbPathParams<VPN extends VarbPathName>(
  varbPathName: VPN
): AllVarbPathParams[VPN] {
  return allVarbPathParams[varbPathName];
}

interface VarbPathNameInfo<VPN extends VarbPathName> {
  varbPathName: VPN;
}

type SectionVarbPathParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
> = {
  [V in VN]: VarbPathParams<PN, V>;
};
function sectionVarbNameParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
>(
  pathName: PN,
  collectionName: string,
  varbNames: VN[]
): SectionVarbPathParams<PN, VN> {
  return varbNames.reduce((options, varbName) => {
    options[varbName] = {
      pathName,
      collectionName,
      varbName,
    };
    return options;
  }, {} as SectionVarbPathParams<PN, VN>);
}
