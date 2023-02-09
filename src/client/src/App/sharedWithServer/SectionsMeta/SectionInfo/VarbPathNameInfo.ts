import { Obj } from "../../utils/Obj";
import { targetNames } from "../allBaseSectionVarbs/baseSwitchNames";
import { fullDisplayNameString } from "../allDisplaySectionVarbs";
import { VarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import {
  pathSectionName,
  PathSectionName,
  SectionPathName,
  SectionPathVarbName,
} from "../sectionPathContexts/sectionPathNames";
import { VarbValue } from "../values/StateValue";
import { MixedInfoProps } from "./VarbInfoBase";

type MakeVarbPathParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
> = {
  pathName: PN;
  varbName: VN;
  collectionName: string;
};

export const allVarbPathParams = {
  ...sectionVarbNameParams("financingFocal", "Financing", [
    "financingMode",
    "loanBaseDollars",
    "closingCosts",
    "loanUpfrontExpenses",
    "loanTotalDollars",
    ...targetNames("mortgageIns", "ongoing"),
    ...targetNames("loanPayment", "ongoing"),
    ...targetNames("loanExpenses", "ongoing"),
  ]),
  ...sectionVarbNameParams("calculatedVarbsFocal", "Property", [
    "two",
    "onePercentPrice",
    "twoPercentPrice",
    "onePercentPricePlusSqft",
    "onePercentPriceSqftAverage",
    ...targetNames("fivePercentRent", "ongoing"),
  ]),
  ...sectionVarbNameParams("propertyFocal", "Property", [
    "price",
    "sqft",
    "numBedrooms",
    "numUnits",
    ...targetNames("taxes", "ongoing"),
    ...targetNames("homeIns", "ongoing"),
    ...targetNames("targetRent", "ongoing"),
  ]),
  ...sectionVarbNameParams("mgmtFocal", "Management", [
    "vacancyLossPercent",
    ...targetNames("basePayDollars", "ongoing"),
  ]),
  ...sectionVarbNameParams("dealFocal", "Deal", [
    "downPaymentDollars",
    "downPaymentPercent",
    "upfrontExpenses",
    "totalInvestment",
    ...targetNames("piti", "ongoing"),
    ...targetNames("cashFlow", "ongoing"),
    ...targetNames("cocRoi", "ongoing"),
    ...targetNames("expenses", "ongoing"),
    ...targetNames("revenue", "ongoing"),
  ]),
};

export const varbPathNames = Obj.keys(allVarbPathParams);
export function isVarbPathName(value: any): value is VarbPathName {
  return varbPathNames.includes(value);
}

type AllVarbPathParams = typeof allVarbPathParams;
export type VarbPathName = keyof AllVarbPathParams;

export type VarbSectionPathName<VPN extends VarbPathName = VarbPathName> =
  AllVarbPathParams[VPN]["pathName"];
export function varbSectionPathName<VPN extends VarbPathName>(
  varbPathName: VPN
): VarbSectionPathName<VPN> {
  return allVarbPathParams[varbPathName]["pathName"];
}

type VarbPathParams<VPN extends VarbPathName> = AllVarbPathParams[VPN];

type VarbPathSectionName<VPN extends VarbPathName> = PathSectionName<
  VarbPathParams<VPN>["pathName"]
>;

export type VarbPathValue<VPN extends VarbPathName> = VarbValue<
  VarbPathSectionName<VPN>,
  VarbPathParams<VPN>["varbName"] & VarbName<VarbPathSectionName<VPN>>
>;

export function getVarbPathParams<VPN extends VarbPathName>(
  varbPathName: VPN
): AllVarbPathParams[VPN] {
  return allVarbPathParams[varbPathName];
}

type VarbPathExtras<VPN extends VarbPathName> = AllVarbPathParams[VPN] & {
  displayName: string;
  varbInfo: VarbPathNameInfoMixed<VPN>;
  sectionName: VarbPathSectionName<VPN>;
};
export function getVarbPathExtras<VPN extends VarbPathName>(
  varbPathName: VPN
): VarbPathExtras<VPN> {
  const params = getVarbPathParams(varbPathName);
  const { pathName, varbName } = params;
  const sectionName = pathSectionName(pathName) as VarbPathSectionName<VPN>;
  return {
    ...params,
    sectionName,
    displayName: fullDisplayNameString(sectionName, varbName as any),
    varbInfo: varbPathInfo(varbPathName),
  } as VarbPathExtras<VPN>;
}

export interface VarbPathNameInfo<VPN extends VarbPathName = VarbPathName> {
  varbPathName: VPN;
}
export interface VarbPathNameInfoMixed<VPN extends VarbPathName = VarbPathName>
  extends MixedInfoProps<"varbPathName"> {
  varbPathName: VPN;
}

type SectionVarbPathParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
> = {
  [V in VN]: MakeVarbPathParams<PN, V>;
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

export function varbPathInfo(
  varbPathName: VarbPathName
): VarbPathNameInfoMixed {
  return {
    infoType: "varbPathName",
    varbPathName,
  };
}
